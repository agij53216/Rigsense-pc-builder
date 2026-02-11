
const ADJECTIVES = [
    'Neon', 'Cyber', 'Quantum', 'Hyper', 'Stealth', 'Void', 'Solar', 'Lunar', 'Crimson', 'Azure',
    'Shadow', 'Ghost', 'Phantom', 'Crystal', 'Titan', 'Iron', 'Golden', 'Silver', 'Obsidian', 'Emerald',
    'Rapid', 'Turbo', 'Sonic', 'Vortex', 'Thunder', 'Lightning', 'Frost', 'Inferno', 'Mystic', 'Arcane'
];

const NOUNS = [
    'Destroyer', 'Machine', 'Beast', 'Engine', 'Station', 'Rig', 'Tower', 'Core', 'System', 'Unit',
    'Phantom', 'Spectre', 'Titan', 'Guardian', 'Sentinel', 'Warrior', 'Hunter', 'Stalker', 'Viper', 'Cobra',
    'Falcon', 'Eagle', 'Wolf', 'Lion', 'Bear', 'Dragon', 'Phoenix', 'Hydra', 'Kraken', 'Leviathan'
];

export function generateRandomName(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj} ${noun} ${num}`;
}
