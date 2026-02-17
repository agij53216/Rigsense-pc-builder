const Build = require('../models/Build');
const Component = require('../models/Component');
const { checkCompatibility, calculatePerformance, getSmartSuggestions } = require('../utils/buildCalculations');
const { generateAlternativeBuilds, generateUpgradePath } = require('../utils/recommendations');

// Budget allocation ratios based on use case
const BUDGET_RATIOS = {
    gaming: { gpu: 0.40, cpu: 0.20, other: 0.40 },
    editing: { gpu: 0.30, cpu: 0.30, ram: 0.15, other: 0.25 },
    streaming: { cpu: 0.25, gpu: 0.35, ram: 0.15, other: 0.25 },
    workstation: { cpu: 0.40, gpu: 0.20, ram: 0.20, other: 0.20 },
    general: { cpu: 0.30, other: 0.70 },
};

// @desc    Validate build and get metrics (compatibility, performance, etc)
// @route   POST /api/builds/validate
// @access  Public
exports.validateBuild = async (req, res) => {
    try {
        const { components, budget, useCase, performancePreference } = req.body;

        // Perform all calculations
        const { issues, estimatedWattage } = checkCompatibility(components);
        const performanceScores = calculatePerformance(components, useCase || 'gaming');
        const suggestions = getSmartSuggestions(components, budget || 0);
        const upgradePath = generateUpgradePath(components);

        // Async recommendations
        const alternatives = await generateAlternativeBuilds(components);

        const totalPrice = Object.values(components).reduce((acc, c) => acc + (c ? c.price : 0), 0);
        const completionPercentage = Math.round((Object.keys(components).length / 8) * 100);

        res.json({
            compatibilityIssues: issues,
            isFullyCompatible: issues.filter(i => i.type === 'error').length === 0,
            estimatedWattage,
            performanceScores,
            suggestions,
            upgradePath,
            alternatives,
            totalPrice,
            remainingBudget: (budget || 0) - totalPrice,
            completionPercentage
        });

    } catch (error) {
        console.error('Error validating build:', error);
        res.status(500).json({ message: 'Validation failed', error: error.message });
    }
};

// @desc    Generate a build based on budget and use case
// @route   POST /api/builds/generate
// @access  Public
exports.generateBuild = async (req, res) => {
    try {
        const { budget, useCase = 'gaming', performancePreference = 50 } = req.body;

        if (!budget || budget < 500) {
            return res.status(400).json({ message: 'Please provide a valid budget (min 500)' });
        }

        const ratios = BUDGET_RATIOS[useCase] || BUDGET_RATIOS['gaming'];
        const components = {};
        let currentBudget = Number(budget);

        // Helper to pick best component
        const pick = async (category, maxPrice, query = {}) => {
            // Sort by performance if preference is high
            // performancePreference > 70 ? performance : price/performance balance
            // For now, sticking to raw performance within budget for simplicity + compatibility
            const sort = performancePreference > 70 ? { performance: -1 } : { price: -1, performance: -1 };

            return await Component.findOne({
                category,
                price: { $lte: maxPrice },
                ...query
            }).sort(sort);
        };

        // 1. CPU
        const cpuBudget = currentBudget * (ratios.cpu || 0.25);
        const cpu = await pick('cpu', cpuBudget);
        if (cpu) {
            components.cpu = cpu;
            currentBudget -= cpu.price;
        }

        // 2. Motherboard (Socket match)
        if (components.cpu) {
            const mbBudget = Math.min(250, currentBudget * 0.15);
            const mb = await pick('motherboard', mbBudget, { socket: components.cpu.socket });
            if (mb) {
                components.motherboard = mb;
                currentBudget -= mb.price;
            }
        }

        // 3. RAM (Type match)
        if (components.motherboard) {
            const ramBudget = currentBudget * (ratios.ram || 0.10);
            const ram = await pick('ram', ramBudget, { ramType: components.motherboard.ramType });
            if (ram) {
                components.ram = ram;
                currentBudget -= ram.price;
            }
        }

        // 4. GPU
        const gpuBudget = currentBudget * (ratios.gpu || 0.35);
        const gpu = await pick('gpu', gpuBudget);
        if (gpu) {
            components.gpu = gpu;
            currentBudget -= gpu.price;
        }

        // 5. Storage
        const storage = await pick('storage', 150);
        if (storage) {
            components.storage = storage;
            currentBudget -= storage.price;
        }

        // 6. Case
        const pCase = await pick('case', 120);
        if (pCase) {
            components.case = pCase;
            currentBudget -= pCase.price;
        }

        // 7. PSU (Wattage check)
        let estimatedWattage = (components.cpu?.wattage || 65) + (components.gpu?.wattage || 150) + 100;
        const psu = await Component.findOne({
            category: 'psu',
            price: { $lte: 200 },
            wattage: { $gte: estimatedWattage }
        }).sort({ performance: -1 });

        if (psu) {
            components.psu = psu;
            currentBudget -= psu.price;
        }

        // 8. Cooling
        const cooling = await pick('cooling', 150);
        if (cooling) {
            components.cooling = cooling;
            currentBudget -= cooling.price;
        }

        const totalPrice = Object.values(components).reduce((acc, c) => acc + (c ? c.price : 0), 0);

        // --- ENHANCED RESPONSE ---
        // Run all calculations on the generated build 
        const { issues } = checkCompatibility(components);
        const performanceScores = calculatePerformance(components, useCase);
        const suggestions = getSmartSuggestions(components, budget);
        const upgradePath = generateUpgradePath(components);
        const alternatives = await generateAlternativeBuilds(components); // Generate alternatives for the new build

        res.json({
            build: components,
            totalPrice,
            remainingBudget: budget - totalPrice,
            // Enhanced metadata
            compatibilityIssues: issues,
            isFullyCompatible: issues.filter(i => i.type === 'error').length === 0,
            estimatedWattage,
            performanceScores,
            suggestions,
            upgradePath,
            alternatives
        });

    } catch (error) {
        console.error('Error generating build:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user builds
// @route   GET /api/builds
// @access  Private
exports.getUserBuilds = async (req, res) => {
    try {
        const builds = await Build.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(builds);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new build
// @route   POST /api/builds
// @access  Private
exports.createBuild = async (req, res) => {
    try {
        const { name, components, totalPrice, useCase, isPublic } = req.body;

        const build = await Build.create({
            user: req.user._id,
            name,
            components,
            totalPrice,
            useCase,
            isPublic
        });

        res.status(201).json(build);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update build
// @route   PUT /api/builds/:id
// @access  Private
exports.updateBuild = async (req, res) => {
    try {
        const build = await Build.findById(req.params.id);

        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        // Make sure user owns build
        if (build.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedBuild = await Build.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedBuild);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete build
// @route   DELETE /api/builds/:id
// @access  Private
exports.deleteBuild = async (req, res) => {
    try {
        const build = await Build.findById(req.params.id);

        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        // Make sure user owns build
        if (build.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await build.deleteOne();

        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
