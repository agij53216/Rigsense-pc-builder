const Build = require('../models/Build');
const Component = require('../models/Component');
const { calculatePerformance, checkCompatibility, getSmartSuggestions } = require('../utils/buildCalculations');
const { generateUpgradePath } = require('../utils/recommendations');



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
        const totalPrice = Object.values(components).reduce((acc, c) => acc + (c ? c.price : 0), 0);
        const completionPercentage = Math.round((Object.keys(components).length / 8) * 100);

        res.json({
            compatibilityIssues: issues,
            isFullyCompatible: issues.filter(i => i.type === 'error').length === 0,
            estimatedWattage,
            performanceScores,
            suggestions,
            upgradePath,
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



        // Fetch all components
        const allParts = await Component.find({}).lean();

        if (allParts.length === 0) {
            return res.status(500).json({ error: "Database is empty. Please run seed script." });
        }

        // Prepare Data for Python
        const inputData = {
            request: { budget, useCase },
            database: allParts
        };

        const { spawn } = require('child_process');
        const path = require('path');

        // Determine Python Path (Check for Venv first)
        // Adjust this path if you are not using the same venv structure
        const isWindows = process.platform === 'win32';
        const venvPython = isWindows
            // Try looking for 'python' in PATH first as a general fallback if venv is missing
            ? 'python'
            : 'python3';

        // Use a more robust way to find the script
        const scriptPath = path.join(__dirname, '../ai/optimizer.py');




        // Spawn Python Process
        const pythonProcess = spawn(venvPython, [scriptPath]);

        let dataString = '';
        let errorString = '';

        // Send JSON to Python (stdin)
        pythonProcess.stdin.on('error', (err) => {
            console.error('[AI ERROR] Failed to write to Python stdin:', err);
        });
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

        // Listen for Result (stdout)
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        // Listen for Errors (stderr)
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        // Handle Completion
        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error(`[AI ERROR] Python exited with code ${code}: ${errorString}`);
                return res.status(500).json({ message: 'AI Engine Failed', details: errorString || 'Unknown Python Error' });
            }

            try {
                const result = JSON.parse(dataString);

                if (result.status === 'error') {
                    return res.status(500).json({ message: result.message });
                }

                // Pick strategy based on performancePreference slider (0-100)
                // 0–33 → value, 34–66 → performance, 67–100 → future_proof
                let selectedStrategy = 'performance'; // default
                if (performancePreference <= 33) selectedStrategy = 'value';
                else if (performancePreference >= 67) selectedStrategy = 'future_proof';

                const aiBuildData = result.options[selectedStrategy] || result.options['performance'];

                // Normalise parts — ensure id field is consistent
                const components = {};
                if (aiBuildData?.parts) {
                    for (const [type, part] of Object.entries(aiBuildData.parts)) {
                        if (part && part.name !== 'Unknown') {
                            components[type] = { ...part, id: part._id || part.id || null };
                        }
                    }
                }

                const totalPrice = aiBuildData.totalPrice ?? 0;

                // Build alternatives map from the other two strategies
                const alternatives = {};
                for (const [strat, data] of Object.entries(result.options)) {
                    if (strat !== selectedStrategy) {
                        alternatives[strat] = {
                            build: data.parts,
                            totalPrice: data.totalPrice,
                            score: data.ai_score,
                            label: data.label,
                            description: data.description,
                            budgetDelta: data.budgetDelta,
                            targetBudget: data.targetBudget,
                            difference: `${data.label}: ₹${data.totalPrice?.toLocaleString('en-IN')}`,
                        };
                    }
                }

                // Node.js safety-net checks
                const { issues, estimatedWattage } = checkCompatibility(components);
                const performanceScores = calculatePerformance(components, useCase);
                const suggestions = getSmartSuggestions(components, budget);
                const upgradePath = generateUpgradePath(components);

                res.json({
                    build: components,
                    totalPrice,
                    remainingBudget: budget - totalPrice,
                    budgetDelta: aiBuildData.budgetDelta,
                    targetBudget: aiBuildData.targetBudget,
                    withinBudget: aiBuildData.withinBudget,
                    selectedStrategy,
                    strategyLabel: aiBuildData.label,
                    strategyDescription: aiBuildData.description,
                    strategySummary: result.summary,
                    compatibilityIssues: issues,
                    // Python bottleneck warnings (merged separately so UI can show them distinctly)
                    aiIssues: aiBuildData.issues || [],
                    isFullyCompatible: issues.filter(i => i.type === 'error').length === 0,
                    estimatedWattage,
                    performanceScores,
                    suggestions,
                    upgradePath,
                    alternatives,
                    aiReasoning: result.reasoning,
                });

            } catch (e) {
                console.error('[AI ERROR] Failed to parse Python response:', e.message);
                console.error('[AI STDOUT] Raw:', dataString.substring(0, 200));
                res.status(500).json({ message: 'Invalid AI Response', details: e.message });
            }
        });

    } catch (error) {
        console.error('Error generating build:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user/guest builds
// @route   GET /api/builds
// @access  Public (Guest) / Private (User)
exports.getBuilds = async (req, res) => {
    try {
        let query = {};
        if (req.user) {
            query.user = req.user._id;
        } else if (req.query.guestId) {
            query.guestId = req.query.guestId;
        } else {
            return res.status(400).json({ message: 'User or Guest ID required' });
        }

        const builds = await Build.find(query).sort({ createdAt: -1 });
        res.json(builds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new build (User or Guest)
// @route   POST /api/builds
// @access  Public
exports.saveBuild = async (req, res) => {
    try {
        const { name, components, totalPrice, useCase, isPublic, guestId } = req.body;

        const buildData = {
            name,
            components,
            totalPrice,
            useCase,
            isPublic: isPublic || false
        };

        if (req.user) {
            buildData.user = req.user._id;
        } else if (guestId) {
            buildData.guestId = guestId;
        } else {
            return res.status(400).json({ message: 'User or Guest ID required to save' });
        }

        const build = await Build.create(buildData);
        res.status(201).json(build);
    } catch (error) {
        console.error("Save build error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete build
// @route   DELETE /api/builds/:id
// @access  Public (if guest owns) / Private
exports.deleteBuild = async (req, res) => {
    try {
        const build = await Build.findById(req.params.id);

        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        // Authorization check
        if (build.user) {
            // Must be logged in and own it
            if (!req.user || build.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
        } else if (build.guestId) {
            const requestGuestId = req.query.guestId || req.body.guestId;
            if (!requestGuestId || requestGuestId !== build.guestId) {
                return res.status(401).json({ message: 'Not authorized (Guest ID mismatch)' });
            }
        }

        await build.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        console.error("Delete build error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update build
// @route   PUT /api/builds/:id
// @access  Private
exports.updateBuild = async (req, res) => {
    try {
        const build = await Build.findById(req.params.id);
        if (!build) return res.status(404).json({ message: 'Build not found' });
        if (!req.user || build.user?.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const updated = await Build.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Calculate build stats (stateless)
// @route   POST /api/builds/calculate
// @access  Public
exports.calculateBuild = async (req, res) => {
    try {
        const { components, useCase } = req.body;
        if (!components) return res.status(400).json({ message: 'Components required' });
        const { issues, estimatedWattage } = checkCompatibility(components);
        const performanceScores = calculatePerformance(components, useCase || 'gaming');
        const totalPrice = Object.values(components).reduce((acc, c) => acc + (c?.price || 0), 0);
        res.json({ issues, estimatedWattage, performanceScores, totalPrice });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
