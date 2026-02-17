const Component = require('../models/Component');

const generateAlternativeBuilds = async (currentComponents) => {
    const alternatives = {};
    const categories = Object.keys(currentComponents);

    if (categories.length < 3) return alternatives;

    // 1. Cheaper Build Logic
    let lowerCostBuild = { ...currentComponents };
    let savings = 0;
    let differences = [];

    const gpu = currentComponents.gpu;
    if (gpu && gpu.tier !== 'budget') {
        const targetTier = gpu.tier === 'premium' ? 'mid' : 'budget';
        // Find cheaper GPU in target tier
        const cheaperGpu = await Component.findOne({
            category: 'gpu',
            tier: targetTier,
            price: { $lt: gpu.price }
        }).sort({ performance: -1 });

        if (cheaperGpu) {
            lowerCostBuild.gpu = cheaperGpu;
            savings += (gpu.price - cheaperGpu.price);
            differences.push(`Swapped ${gpu.name} for ${cheaperGpu.name}`);
        }
    }

    // Try CPU if GPU didn't save enough
    const cpu = currentComponents.cpu;
    if (savings < 100 && cpu && cpu.tier !== 'budget') {
        const targetTier = cpu.tier === 'premium' ? 'mid' : 'budget';
        const cheaperCpu = await Component.findOne({
            category: 'cpu',
            tier: targetTier,
            price: { $lt: cpu.price },
            socket: cpu.socket
        }).sort({ performance: -1 });

        if (cheaperCpu) {
            lowerCostBuild.cpu = cheaperCpu;
            savings += (cpu.price - cheaperCpu.price);
            differences.push(`Swapped ${cpu.name} for ${cheaperCpu.name}`);
        }
    }

    if (savings > 0) {
        alternatives.cheaper = {
            build: lowerCostBuild,
            savings,
            difference: differences.join(', '),
        };
    }

    // 2. Performance Build Logic
    let higherPerfBuild = { ...currentComponents };
    let addedCost = 0;
    let perfGain = 0;
    let perfDifferences = [];

    if (gpu && gpu.tier !== 'premium') {
        const targetTier = gpu.tier === 'budget' ? 'mid' : 'premium';
        const betterGpu = await Component.findOne({
            category: 'gpu',
            tier: targetTier,
            price: { $gt: gpu.price }
        }).sort({ price: 1 }); // Cheapest better one

        if (betterGpu) {
            higherPerfBuild.gpu = betterGpu;
            addedCost += (betterGpu.price - gpu.price);
            perfGain += (betterGpu.performance - gpu.performance);
            perfDifferences.push(`Upgraded to ${betterGpu.name}`);
        }
    }

    if (addedCost > 0) {
        alternatives.performance = {
            build: higherPerfBuild,
            cost: addedCost,
            performanceGain: perfGain,
            difference: perfDifferences.join(', '),
        };
    }

    return alternatives;
};

const generateUpgradePath = (currentComponents) => {
    const cpu = currentComponents.cpu;
    const gpu = currentComponents.gpu;
    const ram = currentComponents.ram;

    if (!cpu || !gpu) return "Complete your build to see upgrade suggestions.";

    if (cpu.performance < gpu.performance - 15) {
        return `Your CPU (${cpu.name}) is holding back your GPU. Consider upgrading to a higher-tier processor like an Intel i7 or Ryzen 7.`;
    }

    if (gpu.performance < cpu.performance - 15 && gpu.tier !== 'premium') {
        return `Your GPU (${gpu.name}) is the bottleneck. A graphics card upgrade would significantly improve gaming performance.`;
    }

    if (ram && ram.tier === 'budget' && (cpu.tier === 'premium' || gpu.tier === 'premium')) {
        return `Your RAM (${ram.name}) is entry-level. Upgrading to 32GB or faster memory would improve multitasking and stability.`;
    }

    if (gpu.tier === 'premium' && cpu.tier === 'premium') {
        return "Your build is top-tier! The next upgrade might be custom cooling or more fast NVMe storage.";
    }

    return "Your system is well-balanced. No immediate upgrades needed.";
};

module.exports = {
    generateAlternativeBuilds,
    generateUpgradePath
};
