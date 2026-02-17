const getEstimatedFPS = (cpuScore, gpuScore, resolution) => {
    const baseScore = (gpuScore * 0.7) + (cpuScore * 0.3);

    // Modifiers based on resolution difficulty
    const resolutionMod = resolution === '1080p' ? 1.5 : resolution === '1440p' ? 1.0 : 0.6;

    return {
        "Cyberpunk 2077": Math.round(baseScore * resolutionMod * 0.8),
        "Fortnite": Math.round(baseScore * resolutionMod * 2.5),
        "Call of Duty: MW3": Math.round(baseScore * resolutionMod * 1.8),
        "Elden Ring": Math.min(60, Math.round(baseScore * resolutionMod * 1.2)), // Capped at 60 usually
    };
};

const checkCompatibility = (components) => {
    const issues = [];
    const cpu = components.cpu;
    const mb = components.motherboard;
    const ram = components.ram;
    const psu = components.psu;

    if (cpu && mb && cpu.socket !== mb.socket) {
        issues.push({ type: 'error', message: `CPU socket (${cpu.socket}) does not match motherboard socket (${mb.socket})`, category: 'motherboard' });
    }

    if (mb && ram && mb.ramType !== ram.ramType) {
        // Handle array ramType if present (some boards support multiple)
        const mbRamTypes = Array.isArray(mb.ramType) ? mb.ramType : [mb.ramType];
        // RAM usually has single type, but allow array check just in case
        const ramTypeVal = Array.isArray(ram.ramType) ? ram.ramType[0] : ram.ramType;

        if (!mbRamTypes.includes(ramTypeVal) && ramTypeVal) {
            issues.push({ type: 'error', message: `Motherboard supports ${mbRamTypes.join('/')} but selected RAM is ${ramTypeVal}`, category: 'ram' });
        }
    }

    // PSU wattage check
    let estimatedWattage = 0;
    if (cpu) estimatedWattage += cpu.wattage || 65;
    if (components.gpu) estimatedWattage += components.gpu.wattage || 150;
    estimatedWattage += 100; // other components

    if (psu && psu.wattage && psu.wattage < estimatedWattage) {
        issues.push({ type: 'warning', message: `PSU (${psu.wattage}W) may be insufficient. Estimated draw: ${estimatedWattage}W. Recommended: ${Math.ceil(estimatedWattage * 1.2)}W`, category: 'psu' });
    }

    // Bottleneck detection
    if (cpu && components.gpu) {
        const diff = Math.abs(cpu.performance - components.gpu.performance);
        if (diff > 25) {
            const bottleneck = cpu.performance < components.gpu.performance ? 'CPU' : 'GPU';
            issues.push({ type: 'warning', message: `Potential bottleneck: ${bottleneck} is significantly weaker than the other. Consider rebalancing.` });
        }
    }

    return { issues, estimatedWattage };
};

const calculatePerformance = (components, useCase) => {
    const cpu = components.cpu?.performance || 0;
    const gpu = components.gpu?.performance || 0;
    const ram = components.ram?.performance || 0;
    const storage = components.storage?.performance || 0;

    const gaming = Math.round(gpu * 0.5 + cpu * 0.3 + ram * 0.1 + storage * 0.1);
    const productivity = Math.round(cpu * 0.4 + ram * 0.25 + storage * 0.2 + gpu * 0.15);
    const rendering = Math.round(cpu * 0.35 + gpu * 0.35 + ram * 0.2 + storage * 0.1);

    let overall;
    switch (useCase) {
        case 'gaming': overall = gaming; break;
        case 'editing': overall = rendering; break;
        case 'streaming': overall = Math.round((gaming + productivity) / 2); break;
        case 'workstation': overall = productivity; break;
        default: overall = Math.round((gaming + productivity + rendering) / 3);
    }

    const filledSlots = Object.keys(components).length;
    // Don't punish score for empty slots too harshly in backend, primarily score what's there but maybe scale confidence
    const confidenceScore = Math.min(100, Math.round(overall * (filledSlots / 8)));

    let tier = 'Entry';
    if (overall > 90) tier = 'Enthusiast';
    else if (overall > 70) tier = 'High-End';
    else if (overall > 40) tier = 'Mid-Range';

    const fps = getEstimatedFPS(cpu, gpu, overall > 85 ? '4k' : overall > 60 ? '1440p' : '1080p');

    return { gaming, productivity, rendering, overall, confidenceScore, tier, fps };
};

const formatINR = (price) => {
    return `₹${price.toLocaleString()}`;
}

const getSmartSuggestions = (components, budget) => {
    const suggestions = [];
    const total = Object.values(components).reduce((sum, c) => sum + (c?.price || 0), 0);
    const remaining = budget - total;

    if (remaining > 100) {
        suggestions.push(`You have ${formatINR(remaining)} left. Consider upgrading your GPU.`);
    }

    if (components.cpu && components.gpu) {
        const diff = components.cpu.performance - components.gpu.performance;
        if (diff > 20) {
            suggestions.push('Your CPU is much stronger than your GPU. Upgrade GPU for better gaming performance.');
        } else if (diff < -20) {
            suggestions.push('Your GPU is bottlenecked by the CPU. Upgrade CPU.');
        }
    }

    if (components.ram && components.ram.price < 50 && remaining > 30) {
        suggestions.push('Upgrade to 32GB RAM for better multitasking.');
    }

    return suggestions;
};

module.exports = {
    checkCompatibility,
    calculatePerformance,
    getSmartSuggestions,
    getEstimatedFPS
};
