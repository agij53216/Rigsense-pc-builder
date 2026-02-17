// Educational content for the Learn page

export interface QuickTip {
    id: string;
    title: string;
    icon: string;
    shortDesc: string;
    fullDesc: string[];
}

export interface BudgetAllocation {
    component: string;
    gaming: number;
    content: number;
    workstation: number;
    color: string;
    why: string;
    examples: {
        budget: string;
        mid: string;
        high: string;
    };
}

export interface ComponentGuide {
    id: string;
    name: string;
    icon: string;
    color: string;
    whatItDoes: string;
    keyPoints: string[];
    commonMistake: string;
}

export const quickTips: QuickTip[] = [
    {
        id: 'use-case',
        title: 'Start with Your Use Case',
        icon: '🎯',
        shortDesc: 'Gaming, editing, or general use determines everything',
        fullDesc: [
            'Your intended use determines every component choice and budget allocation.',
            'Gaming prioritizes GPU (35-40% of budget), editing needs strong CPU and RAM, general use can use integrated graphics.',
            'Don\'t buy the "best" - buy what fits your actual needs to avoid wasting money on unused performance.'
        ]
    },
    {
        id: 'gpu-budget',
        title: 'GPU Gets Biggest Slice (Gaming)',
        icon: '💰',
        shortDesc: 'Allocate 35-40% of budget to GPU for gaming',
        fullDesc: [
            'The GPU is the primary performance driver in games, determining 70% of gaming performance.',
            'An RTX 4070 with a mid-range CPU will outperform an RTX 4060 with a flagship CPU in most games.',
            'For work builds, CPU takes priority instead with 28-30% allocation.'
        ]
    },
    {
        id: 'compatibility',
        title: 'Never Skip Compatibility',
        icon: '⚠️',
        shortDesc: 'Use PCPartPicker or compatibility checkers',
        fullDesc: [
            'Wrong socket/RAM type = expensive mistake that can\'t be fixed without returns.',
            'Check: CPU socket, DDR4 vs DDR5, case clearances, PSU connectors, and BIOS compatibility.',
            'Tools like PCPartPicker automatically verify compatibility and warn about issues.'
        ]
    },
    {
        id: 'psu-quality',
        title: 'Don\'t Cheap Out on PSU',
        icon: '⚡',
        shortDesc: 'Bad PSU can destroy entire build',
        fullDesc: [
            'A failing PSU can damage every component in your system - it\'s not worth the risk.',
            'Quality 80+ Gold units last 10+ years across multiple builds and save on electricity.',
            'Stick to reputable brands: Corsair, Seasonic, EVGA, MSI with 7-10 year warranties.'
        ]
    },
    {
        id: 'upgrades',
        title: 'Plan for Upgrades',
        icon: '🔄',
        shortDesc: 'Choose AM5 for CPU upgrades through 2027+',
        fullDesc: [
            'AMD AM5 platform supports upgrades through 2027+, letting you swap CPUs without changing motherboards.',
            'Extra RAM slots and M.2 slots provide flexibility for future expansion.',
            'Choose motherboards with modern I/O (USB-C, PCIe 4.0/5.0) for longevity.'
        ]
    },
    {
        id: 'balance',
        title: 'Balance Your Build',
        icon: '⚖️',
        shortDesc: 'Match components to avoid bottlenecks',
        fullDesc: [
            'RTX 4090 + weak CPU = wasted money. Your PC is only as fast as its weakest component.',
            'Match your CPU to your GPU tier: budget GPU with budget CPU, high-end GPU with high-end CPU.',
            'Don\'t forget RAM and storage - even the best CPU/GPU will stutter with 8GB RAM or slow HDD.'
        ]
    }
];

export const budgetAllocations: BudgetAllocation[] = [
    {
        component: 'GPU',
        gaming: 35,
        content: 25,
        workstation: 20,
        color: '#a855f7',
        why: 'Determines 70% of gaming performance',
        examples: {
            budget: 'RTX 4060 ($280)',
            mid: 'RTX 4070 Super ($600)',
            high: 'RTX 4080 Super ($1000)'
        }
    },
    {
        component: 'CPU',
        gaming: 20,
        content: 28,
        workstation: 30,
        color: '#00d9ff',
        why: 'Brain of your PC, critical for productivity',
        examples: {
            budget: 'Ryzen 5 7600 ($160)',
            mid: 'Ryzen 7 7700X ($300)',
            high: 'Ryzen 9 7900X ($500)'
        }
    },
    {
        component: 'RAM',
        gaming: 12,
        content: 15,
        workstation: 20,
        color: '#ff9500',
        why: 'Short-term storage for active tasks',
        examples: {
            budget: '16GB DDR5 ($90)',
            mid: '32GB DDR5 ($150)',
            high: '32GB 6000MHz ($200)'
        }
    },
    {
        component: 'Motherboard',
        gaming: 10,
        content: 10,
        workstation: 10,
        color: '#00ff88',
        why: 'Connects everything, enables features',
        examples: {
            budget: 'B650 ($130)',
            mid: 'B650 ($150)',
            high: 'X670 ($280)'
        }
    },
    {
        component: 'Storage',
        gaming: 10,
        content: 12,
        workstation: 12,
        color: '#ff006e',
        why: 'Stores OS, games, and files',
        examples: {
            budget: '1TB NVMe ($75)',
            mid: '1TB Gen4 ($110)',
            high: '2TB Gen4 ($180)'
        }
    },
    {
        component: 'PSU',
        gaming: 8,
        content: 7,
        workstation: 5,
        color: '#ffd60a',
        why: 'Powers everything safely',
        examples: {
            budget: '650W Bronze ($60)',
            mid: '750W Gold ($110)',
            high: '850W Gold ($170)'
        }
    },
    {
        component: 'Case',
        gaming: 5,
        content: 3,
        workstation: 3,
        color: '#94a3b8',
        why: 'Houses components, provides airflow',
        examples: {
            budget: 'Budget Mesh ($45)',
            mid: 'Quality Airflow ($80)',
            high: 'Premium ($170)'
        }
    }
];

export const componentGuides: ComponentGuide[] = [
    {
        id: 'cpu',
        name: 'CPU (Processor)',
        icon: 'Cpu',
        color: '#00d9ff',
        whatItDoes: 'Brain of your PC - handles all calculations and instructions',
        keyPoints: [
            'Gaming: 6-8 cores enough | Work: 12+ cores for rendering',
            'Intel vs AMD: Both great, choose by price/availability',
            'Clock speed matters for gaming, cores matter for productivity',
            'Ryzen 7000 (AM5) offers better upgrade path through 2027+'
        ],
        commonMistake: 'Buying i9 when i5 performs the same for gaming'
    },
    {
        id: 'gpu',
        name: 'GPU (Graphics Card)',
        icon: 'MonitorSpeaker',
        color: '#a855f7',
        whatItDoes: 'Renders your games and graphics',
        keyPoints: [
            '1080p: RTX 4060/RX 7600 | 1440p: RTX 4070/RX 7800 XT | 4K: RTX 4080+',
            'VRAM: 8GB for 1080p, 12GB for 1440p, 16GB for 4K',
            'NVIDIA: Better ray tracing, DLSS | AMD: Better value, FSR',
            'Most important component for gaming performance'
        ],
        commonMistake: 'Overspending on CPU, underspending on GPU for gaming'
    },
    {
        id: 'motherboard',
        name: 'Motherboard',
        icon: 'CircuitBoard',
        color: '#00ff88',
        whatItDoes: 'Connects all components together',
        keyPoints: [
            'Must match CPU socket (AM5 for Ryzen 7000, LGA1700 for Intel 12-14th gen)',
            'B-series chipsets are enough for most users',
            'Check: RAM type support (DDR4 vs DDR5), M.2 slots, USB ports',
            'More expensive doesn\'t mean better performance for non-overclockers'
        ],
        commonMistake: 'Buying Z790 when B760 does the same for locked CPUs'
    },
    {
        id: 'ram',
        name: 'RAM (Memory)',
        icon: 'MemoryStick',
        color: '#ff9500',
        whatItDoes: 'Short-term storage for active programs and data',
        keyPoints: [
            '16GB for gaming | 32GB for work | 64GB+ for professional',
            'DDR4 vs DDR5: Can\'t mix, check motherboard compatibility',
            'Always buy 2 sticks (dual-channel) for 30-40% better performance',
            'Install in correct slots (usually A2/B2) - check manual'
        ],
        commonMistake: 'Buying single stick instead of 2-stick kit (kills performance)'
    },
    {
        id: 'storage',
        name: 'Storage',
        icon: 'HardDrive',
        color: '#ff006e',
        whatItDoes: 'Stores your OS, games, and files permanently',
        keyPoints: [
            'Must have: 1TB NVMe SSD minimum for boot drive',
            'Gen3 vs Gen4: Minimal difference for gaming',
            'Add 2TB+ HDD for bulk media storage if needed',
            'Leave 10-20% free space on SSD for best performance'
        ],
        commonMistake: 'Buying slow HDD for boot drive (use SSD only)'
    },
    {
        id: 'psu',
        name: 'PSU (Power Supply)',
        icon: 'Plug',
        color: '#ffd60a',
        whatItDoes: 'Powers all components safely and efficiently',
        keyPoints: [
            '650W budget | 750W mid | 850W+ high-end builds',
            '80+ Gold efficiency is the sweet spot for value',
            'Quality matters: Corsair, Seasonic, EVGA with 10-year warranty',
            'Calculate: CPU TDP + GPU TDP + 100W, then add 20-30% headroom'
        ],
        commonMistake: 'Buying cheap no-name PSU (can destroy entire system)'
    },
    {
        id: 'case',
        name: 'Case',
        icon: 'Box',
        color: '#94a3b8',
        whatItDoes: 'Houses components and provides airflow',
        keyPoints: [
            'Mesh front panel for good airflow (beats solid glass)',
            'Mid-tower fits most builds, check GPU length clearance',
            'Must have: PSU shroud, cable management space, dust filters',
            'Airflow > Aesthetics for temperatures and noise'
        ],
        commonMistake: 'Solid glass front (looks cool, chokes airflow)'
    },
    {
        id: 'cooling',
        name: 'Cooling',
        icon: 'Fan',
        color: '#60a5fa',
        whatItDoes: 'Keeps CPU from overheating',
        keyPoints: [
            'Stock cooler works for budget CPUs (65W TDP)',
            'Tower cooler ($30-80) for mid-range, AIO ($100+) for high-end',
            'Don\'t forget case fans: 2-3 intake front, 1-2 exhaust top/rear',
            'Good airflow case + decent cooler = quiet, cool system'
        ],
        commonMistake: 'Forgetting to remove plastic from cooler bottom before install'
    }
];

export const buildExamples = [
    {
        id: 'budget',
        name: '$800 - 1080p Gaming Beast',
        budget: 800,
        resolution: '1080p',
        performance: '60+ fps at high settings',
        parts: [
            { component: 'CPU', name: 'Ryzen 5 7600', price: 160 },
            { component: 'GPU', name: 'RTX 4060 8GB', price: 280 },
            { component: 'RAM', name: '16GB DDR5', price: 90 },
            { component: 'Motherboard', name: 'B650', price: 130 },
            { component: 'Storage', name: '1TB NVMe SSD', price: 75 },
            { component: 'PSU', name: '650W 80+ Bronze', price: 60 },
            { component: 'Case', name: 'Budget Mesh', price: 45 }
        ]
    },
    {
        id: 'mid',
        name: '$1,500 - 1440p Power',
        budget: 1500,
        resolution: '1440p',
        performance: '100+ fps maxed settings',
        parts: [
            { component: 'CPU', name: 'Ryzen 7 7700X', price: 300 },
            { component: 'GPU', name: 'RTX 4070 Super 12GB', price: 600 },
            { component: 'RAM', name: '32GB DDR5', price: 150 },
            { component: 'Motherboard', name: 'B650', price: 150 },
            { component: 'Storage', name: '1TB Gen4 NVMe', price: 110 },
            { component: 'PSU', name: '750W 80+ Gold', price: 110 },
            { component: 'Case', name: 'Quality Airflow', price: 80 }
        ]
    },
    {
        id: 'high',
        name: '$2,500 - 4K Enthusiast',
        budget: 2500,
        resolution: '4K',
        performance: 'Ultra settings, ray tracing on',
        parts: [
            { component: 'CPU', name: 'Ryzen 9 7900X', price: 500 },
            { component: 'GPU', name: 'RTX 4080 Super 16GB', price: 1000 },
            { component: 'RAM', name: '32GB DDR5 6000MHz', price: 200 },
            { component: 'Motherboard', name: 'X670', price: 280 },
            { component: 'Storage', name: '2TB Gen4 NVMe', price: 180 },
            { component: 'PSU', name: '850W 80+ Gold', price: 170 },
            { component: 'Case', name: 'Premium', price: 170 }
        ]
    }
];

export const faqs = [
    {
        q: 'How long will my PC last?',
        a: '5-7 years for gaming at current settings. GPU and CPU typically last through multiple builds. Plan to upgrade GPU every 3-5 years, CPU every 5-7 years.'
    },
    {
        q: 'Intel or AMD?',
        a: 'Both excellent. AMD Ryzen 7000 offers better efficiency and AM5 upgrade path through 2027+. Intel 13th/14th gen offers competitive performance. Choose based on current prices and motherboard features.'
    },
    {
        q: 'How much RAM do I really need?',
        a: '16GB for gaming, 32GB for content creation or future-proofing, 64GB+ for professional work. Always dual-channel (2 sticks) for best performance.'
    },
    {
        q: 'Is building really cheaper than buying prebuilt?',
        a: 'Usually saves 15-25%, plus you get exactly what you want, better components (especially PSU), and valuable learning experience.'
    },
    {
        q: 'What if it doesn\'t turn on?',
        a: 'Check: RAM fully seated, CPU power connected (8-pin), GPU power connected, monitor plugged into GPU not motherboard, PSU switch on. These solve 90% of first-boot issues.'
    },
    {
        q: 'Should I wait for next generation?',
        a: 'There\'s always something new coming. If current parts meet your needs and budget, build now. Waiting 6 months for 10% improvement isn\'t worth it unless new gen is weeks away.'
    }
];
