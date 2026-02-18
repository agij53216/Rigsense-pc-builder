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

    const normalize = (str) => str ? str.toString().toLowerCase().replace(/\s+/g, '') : '';

    if (cpu && mb && normalize(cpu.socket) !== normalize(mb.socket)) {
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

const calculatePerformance = (components, useCase = 'general') => {
    // Helper to get score safely
    const getScore = (comp) => comp?.performance_score || comp?.performance || 0;

    const cpu = getScore(components.cpu);
    const gpu = getScore(components.gpu);
    const ram = getScore(components.ram);
    const storage = getScore(components.storage);

    // Weighted scores based on component importance
    const gaming = Math.round(gpu * 0.45 + cpu * 0.35 + ram * 0.15 + storage * 0.05);
    const productivity = Math.round(cpu * 0.40 + ram * 0.25 + storage * 0.20 + gpu * 0.15);
    const rendering = Math.round(cpu * 0.35 + gpu * 0.35 + ram * 0.20 + storage * 0.10);

    let overall;
    switch (useCase) {
        case 'gaming': overall = gaming; break;
        case 'editing': overall = rendering; break;
        case 'streaming': overall = Math.round((gaming + productivity) / 2); break;
        case 'workstation': overall = productivity; break;
        default: overall = Math.round((gaming + productivity + rendering) / 3);
    }

    // Calculate total wattage
    let totalWattage = 0;
    Object.values(components).forEach(c => {
        if (c && c.wattage) totalWattage += c.wattage;
    });
    // Add buffer for other components if not explicit
    if (totalWattage > 0) totalWattage += 50;

    // FPS Estimation (Simple logic for now, can be enhanced)
    // Using a base baseline plus modifiers from GPU/CPU score
    const fps = {};
    if (gpu > 0 && cpu > 0) {
        const tier = gpu > 80 ? 'Ultra' : gpu > 60 ? 'High' : gpu > 40 ? 'Med' : 'Low';
        fps['1080p'] = Math.round((gpu * 1.5 + cpu * 0.5) * (tier === 'Ultra' ? 1.2 : 1));
        fps['1440p'] = Math.round(fps['1080p'] * 0.75);
        fps['4k'] = Math.round(fps['1080p'] * 0.45);
    }

    return {
        gaming,
        productivity,
        rendering,
        overall,
        totalWattage,
        fps
    };
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
