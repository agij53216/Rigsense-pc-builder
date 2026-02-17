export type ComponentTier = 'budget' | 'mid' | 'premium';
export type UseCase = 'gaming' | 'editing' | 'streaming' | 'workstation' | 'general';
export type ComponentCategory = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling';

export interface PCComponent {
  id: string;
  category: ComponentCategory;
  name: string;
  brand: string;
  price: number;
  tier: ComponentTier;
  specs: Record<string, string>;
  performance: number;
  image?: string;
  imageUrl: string; // URL for component image in modal
  manufacturer: string; // For filtering
  inStock: boolean; // Stock status
  discount?: number; // Discount percentage (optional)
  features: string[]; // Detailed features for modal display
  isCustom: boolean; // True for user-saved builds, false for presets
  socket?: string;
  ramType?: string;
  wattage?: number;
  formFactor?: string;
}

export const mockCPUs: PCComponent[] = [
  {
    id: 'cpu-1', category: 'cpu', name: 'AMD Ryzen 5 5600', brand: 'AMD', price: 132, tier: 'budget',
    specs: { cores: '6', threads: '12', baseClock: '3.5 GHz', boostClock: '4.4 GHz', tdp: '65W', socket: 'AM4', cache: '32MB' },
    performance: 68, socket: 'AM4', wattage: 65,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'AMD',
    inStock: true,
    features: ['6 Cores / 12 Threads', 'Up to 4.4 GHz Boost', '32MB L3 Cache', 'AM4 Socket'],
    isCustom: false,
  },
  {
    id: 'cpu-2', category: 'cpu', name: 'Intel Core i5-12400F', brand: 'Intel', price: 149, tier: 'budget',
    specs: { cores: '6', threads: '12', baseClock: '2.5 GHz', boostClock: '4.4 GHz', tdp: '65W', socket: 'LGA1700', cache: '18MB' },
    performance: 70, socket: 'LGA1700', wattage: 65,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'Intel',
    inStock: true,
    features: ['6 Cores / 12 Threads', 'Up to 4.4 GHz Boost', '18MB Cache', 'LGA1700 Socket'],
    isCustom: false,
  },
  {
    id: 'cpu-3', category: 'cpu', name: 'AMD Ryzen 5 7600X', brand: 'AMD', price: 229, tier: 'mid',
    specs: { cores: '6', threads: '12', baseClock: '4.7 GHz', boostClock: '5.3 GHz', tdp: '105W', socket: 'AM5', cache: '32MB' },
    performance: 78, socket: 'AM5', wattage: 105,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'AMD',
    inStock: true,
    discount: 10,
    features: ['6 Cores / 12 Threads', 'Up to 5.3 GHz Boost', 'Zen 4 Architecture', 'AM5 Platform'],
    isCustom: false,
  },
  {
    id: 'cpu-4', category: 'cpu', name: 'Intel Core i5-13600KF', brand: 'Intel', price: 264, tier: 'mid',
    specs: { cores: '14', threads: '20', baseClock: '3.5 GHz', boostClock: '5.1 GHz', tdp: '125W', socket: 'LGA1700', cache: '24MB' },
    performance: 82, socket: 'LGA1700', wattage: 125,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'Intel',
    inStock: true,
    features: ['14 Cores / 20 Threads', 'Up to 5.1 GHz Boost', 'Hybrid Architecture', 'Unlocked Multiplier'],
    isCustom: false,
  },
  {
    id: 'cpu-5', category: 'cpu', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', price: 449, tier: 'premium',
    specs: { cores: '8', threads: '16', baseClock: '4.2 GHz', boostClock: '5.0 GHz', tdp: '120W', socket: 'AM5', cache: '96MB' },
    performance: 95, socket: 'AM5', wattage: 120,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'AMD',
    inStock: true,
    features: ['8 Cores / 16 Threads', '96MB 3D V-Cache', 'Best Gaming CPU', 'Up to 5.0 GHz'],
    isCustom: false,
  },
  {
    id: 'cpu-6', category: 'cpu', name: 'Intel Core i7-14700K', brand: 'Intel', price: 399, tier: 'premium',
    specs: { cores: '20', threads: '28', baseClock: '3.4 GHz', boostClock: '5.6 GHz', tdp: '125W', socket: 'LGA1700', cache: '33MB' },
    performance: 92, socket: 'LGA1700', wattage: 125,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'Intel',
    inStock: false,
    features: ['20 Cores / 28 Threads', 'Up to 5.6 GHz Boost', 'Unlocked Multiplier', '33MB Cache'],
    isCustom: false,
  },
  {
    id: 'cpu-7', category: 'cpu', name: 'AMD Ryzen 9 7950X', brand: 'AMD', price: 549, tier: 'premium',
    specs: { cores: '16', threads: '32', baseClock: '4.5 GHz', boostClock: '5.7 GHz', tdp: '170W', socket: 'AM5', cache: '64MB' },
    performance: 97, socket: 'AM5', wattage: 170,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'AMD',
    inStock: true,
    features: ['16 Cores / 32 Threads', 'Up to 5.7 GHz Boost', 'Flagship Performance', '64MB Cache'],
    isCustom: false,
  },
  {
    id: 'cpu-8', category: 'cpu', name: 'Intel Core i9-14900K', brand: 'Intel', price: 589, tier: 'premium',
    specs: { cores: '24', threads: '32', baseClock: '3.2 GHz', boostClock: '6.0 GHz', tdp: '125W', socket: 'LGA1700', cache: '36MB' },
    performance: 98, socket: 'LGA1700', wattage: 125,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
    manufacturer: 'Intel',
    inStock: true,
    discount: 5,
    features: ['24 Cores / 32 Threads', 'Up to 6.0 GHz Boost', 'Ultimate Performance', 'Thermal Velocity Boost'],
    isCustom: false,
  },
];

export const mockGPUs: PCComponent[] = [
  {
    id: 'gpu-1', category: 'gpu', name: 'AMD Radeon RX 6600', brand: 'AMD', price: 199, tier: 'budget',
    specs: { vram: '8GB GDDR6', coreClock: '1626 MHz', boostClock: '2491 MHz', tdp: '132W', busWidth: '128-bit' },
    performance: 58, wattage: 132,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    manufacturer: 'AMD',
    inStock: true,
    features: ['8GB GDDR6 VRAM', '1080p Gaming', 'Ray Tracing', 'Low Power 132W'],
    isCustom: false,
  },
  {
    id: 'gpu-2', category: 'gpu', name: 'NVIDIA RTX 4060', brand: 'NVIDIA', price: 299, tier: 'budget',
    specs: { vram: '8GB GDDR6', coreClock: '1830 MHz', boostClock: '2460 MHz', tdp: '115W', busWidth: '128-bit' },
    performance: 68, wattage: 115,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    manufacturer: 'NVIDIA',
    inStock: true,
    features: ['8GB GDDR6 VRAM', 'DLSS 3.0', 'Ray Tracing', 'Efficient 115W TDP'],
    isCustom: false,
  },
  {
    id: 'gpu-3', category: 'gpu', name: 'NVIDIA RTX 4060 Ti', brand: 'NVIDIA', price: 399, tier: 'mid',
    specs: { vram: '8GB GDDR6', coreClock: '2310 MHz', boostClock: '2535 MHz', tdp: '160W', busWidth: '128-bit' },
    performance: 75, wattage: 160,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    manufacturer: 'NVIDIA',
    inStock: true,
    discount: 15,
    features: ['8GB GDDR6 VRAM', 'DLSS 3.0', '1440p Gaming', 'Ray Tracing'],
    isCustom: false,
  },
  {
    id: 'gpu-4', category: 'gpu', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', price: 449, tier: 'mid',
    specs: { vram: '16GB GDDR6', coreClock: '1295 MHz', boostClock: '2430 MHz', tdp: '263W', busWidth: '256-bit' },
    performance: 82, wattage: 263,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    manufacturer: 'AMD',
    inStock: true,
    features: ['16GB GDDR6 VRAM', '1440p High FPS', 'Ray Tracing', '256-bit Bus'],
    isCustom: false,
  },
  {
    id: 'gpu-5', category: 'gpu', name: 'NVIDIA RTX 4070 Ti Super', brand: 'NVIDIA', price: 799, tier: 'premium',
    specs: { vram: '16GB GDDR6X', coreClock: '2340 MHz', boostClock: '2610 MHz', tdp: '285W', busWidth: '256-bit' },
    performance: 90, wattage: 285,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    manufacturer: 'NVIDIA',
    inStock: true,
    features: ['16GB GDDR6X VRAM', '4K Gaming', 'DLSS 3.5', 'Advanced Ray Tracing'],
    isCustom: false,
  },
  {
    id: 'gpu-6', category: 'gpu', name: 'NVIDIA RTX 4080 Super', brand: 'NVIDIA', price: 999, tier: 'premium',
    specs: { vram: '16GB GDDR6X', coreClock: '2295 MHz', boostClock: '2550 MHz', tdp: '320W', busWidth: '256-bit' },
    performance: 94, wattage: 320,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    manufacturer: 'NVIDIA',
    inStock: false,
    features: ['16GB GDDR6X VRAM', '4K Ultra Gaming', 'DLSS 3.5', '320W Performance'],
    isCustom: false,
  },
  {
    id: 'gpu-7', category: 'gpu', name: 'NVIDIA RTX 4090', brand: 'NVIDIA', price: 1599, tier: 'premium',
    specs: { vram: '24GB GDDR6X', coreClock: '2235 MHz', boostClock: '2520 MHz', tdp: '450W', busWidth: '384-bit' },
    performance: 99, wattage: 450,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    manufacturer: 'NVIDIA',
    inStock: true,
    features: ['24GB GDDR6X VRAM', '4K Max Settings', 'Flagship Performance', 'AI Acceleration'],
    isCustom: false,
  },
];

export const mockMotherboards: PCComponent[] = [
  {
    id: 'mb-1', category: 'motherboard', name: 'MSI B550M PRO-VDH', brand: 'MSI', price: 89, tier: 'budget',
    specs: { socket: 'AM4', chipset: 'B550', formFactor: 'Micro-ATX', ramSlots: '4', ramType: 'DDR4', maxRam: '128GB', m2Slots: '1' },
    performance: 55, socket: 'AM4', ramType: 'DDR4', formFactor: 'Micro-ATX',
    imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
    manufacturer: 'MSI',
    inStock: true,
    features: ['AM4 Socket', 'B550 Chipset', 'Micro-ATX', 'DDR4 Support'],
    isCustom: false,
  },
  {
    id: 'mb-2', category: 'motherboard', name: 'ASUS Prime B660M-A', brand: 'ASUS', price: 119, tier: 'budget',
    specs: { socket: 'LGA1700', chipset: 'B660', formFactor: 'Micro-ATX', ramSlots: '4', ramType: 'DDR4', maxRam: '128GB', m2Slots: '2' },
    performance: 60, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'Micro-ATX',
    imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
    manufacturer: 'ASUS',
    inStock: true,
    features: ['LGA1700 Socket', 'B660 Chipset', '2x M.2 Slots', 'DDR4 Support'],
    isCustom: false,
  },
  {
    id: 'mb-3', category: 'motherboard', name: 'MSI B650 GAMING PLUS WIFI', brand: 'MSI', price: 179, tier: 'mid',
    specs: { socket: 'AM5', chipset: 'B650', formFactor: 'ATX', ramSlots: '4', ramType: 'DDR5', maxRam: '128GB', m2Slots: '2' },
    performance: 72, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
    manufacturer: 'MSI',
    inStock: true,
    features: ['AM5 Socket', 'DDR5 Support', 'WiFi 6E', 'PCIe 5.0'],
    isCustom: false,
  },
  {
    id: 'mb-4', category: 'motherboard', name: 'ASUS TUF Gaming Z790-Plus', brand: 'ASUS', price: 219, tier: 'mid',
    specs: { socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX', ramSlots: '4', ramType: 'DDR5', maxRam: '128GB', m2Slots: '4' },
    performance: 80, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
    manufacturer: 'ASUS',
    inStock: true,
    discount: 8,
    features: ['LGA1700 Socket', 'DDR5 Support', '4x M.2 Slots', 'PCIe 5.0'],
    isCustom: false,
  },
  {
    id: 'mb-5', category: 'motherboard', name: 'MSI MAG X670E TOMAHAWK', brand: 'MSI', price: 299, tier: 'premium',
    specs: { socket: 'AM5', chipset: 'X670E', formFactor: 'ATX', ramSlots: '4', ramType: 'DDR5', maxRam: '128GB', m2Slots: '4' },
    performance: 88, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
    manufacturer: 'MSI',
    inStock: true,
    features: ['AM5 Socket', 'X670E Chipset', 'Premium VRM', 'PCIe 5.0'],
    isCustom: false,
  },
  {
    id: 'mb-6', category: 'motherboard', name: 'ASUS ROG Maximus Z790 Hero', brand: 'ASUS', price: 599, tier: 'premium',
    specs: { socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX', ramSlots: '4', ramType: 'DDR5', maxRam: '128GB', m2Slots: '5' },
    performance: 95, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
    manufacturer: 'ASUS',
    inStock: true,
    features: ['LGA1700 Socket', '5x M.2 Slots', 'Premium Features', 'WiFi 6E'],
    isCustom: false,
  },
];

export const mockRAM: PCComponent[] = [
  {
    id: 'ram-1', category: 'ram', name: 'Corsair Vengeance LPX 16GB (2x8)', brand: 'Corsair', price: 42, tier: 'budget',
    specs: { capacity: '16GB', type: 'DDR4', speed: '3200 MHz', cas: 'CL16', modules: '2x8GB' },
    performance: 55, ramType: 'DDR4',
    imageUrl: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400',
    manufacturer: 'Corsair',
    inStock: true,
    features: ['16GB (2x8GB)', 'DDR4 3200MHz', 'CL16 Latency', 'Low Profile'],
    isCustom: false,
  },
  {
    id: 'ram-2', category: 'ram', name: 'G.Skill Ripjaws V 32GB (2x16)', brand: 'G.Skill', price: 69, tier: 'budget',
    specs: { capacity: '32GB', type: 'DDR4', speed: '3600 MHz', cas: 'CL18', modules: '2x16GB' },
    performance: 65, ramType: 'DDR4',
    imageUrl: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400',
    manufacturer: 'G.Skill',
    inStock: true,
    features: ['32GB (2x16GB)', 'DDR4 3600MHz', 'CL18 Latency', 'Great Value'],
    isCustom: false,
  },
  {
    id: 'ram-3', category: 'ram', name: 'Kingston Fury Beast 32GB (2x16)', brand: 'Kingston', price: 89, tier: 'mid',
    specs: { capacity: '32GB', type: 'DDR5', speed: '5600 MHz', cas: 'CL36', modules: '2x16GB' },
    performance: 78, ramType: 'DDR5',
    imageUrl: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400',
    manufacturer: 'Kingston',
    inStock: true,
    features: ['32GB (2x16GB)', 'DDR5 5600MHz', 'Next-Gen Speed', 'RGB Lighting'],
    isCustom: false,
  },
  {
    id: 'ram-4', category: 'ram', name: 'G.Skill Trident Z5 RGB 32GB (2x16)', brand: 'G.Skill', price: 119, tier: 'mid',
    specs: { capacity: '32GB', type: 'DDR5', speed: '6000 MHz', cas: 'CL30', modules: '2x16GB' },
    performance: 85, ramType: 'DDR5',
    imageUrl: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400',
    manufacturer: 'G.Skill',
    inStock: true,
    features: ['32GB (2x16GB)', 'DDR5 6000MHz', 'CL30 Low Latency', 'Premium RGB'],
    isCustom: false,
  },
  {
    id: 'ram-5', category: 'ram', name: 'G.Skill Trident Z5 RGB 64GB (2x32)', brand: 'G.Skill', price: 219, tier: 'premium',
    specs: { capacity: '64GB', type: 'DDR5', speed: '6400 MHz', cas: 'CL32', modules: '2x32GB' },
    performance: 95, ramType: 'DDR5',
    imageUrl: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400',
    manufacturer: 'G.Skill',
    inStock: true,
    features: ['64GB (2x32GB)', 'DDR5 6400MHz', 'Extreme Performance', 'Customizable RGB'],
    isCustom: false,
  },
];

export const mockStorage: PCComponent[] = [
  {
    id: 'storage-1', category: 'storage', name: 'Kingston NV2 500GB NVMe', brand: 'Kingston', price: 32, tier: 'budget',
    specs: { capacity: '500GB', type: 'NVMe', interface: 'PCIe 4.0 x4', read: '3500 MB/s', write: '2100 MB/s' },
    performance: 50,
    imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    manufacturer: 'Kingston',
    inStock: true,
    features: ['500GB NVMe SSD', 'PCIe 4.0', '3500 MB/s Read', 'Budget Friendly'],
    isCustom: false,
  },
  {
    id: 'storage-2', category: 'storage', name: 'WD Blue SN580 1TB', brand: 'Western Digital', price: 59, tier: 'budget',
    specs: { capacity: '1TB', type: 'NVMe', interface: 'PCIe 4.0 x4', read: '4150 MB/s', write: '4150 MB/s' },
    performance: 65,
    imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    manufacturer: 'Western Digital',
    inStock: true,
    features: ['1TB NVMe SSD', 'PCIe 4.0', '4150 MB/s Read/Write', 'Reliable Performance'],
    isCustom: false,
  },
  {
    id: 'storage-3', category: 'storage', name: 'Samsung 980 PRO 1TB', brand: 'Samsung', price: 89, tier: 'mid',
    specs: { capacity: '1TB', type: 'NVMe', interface: 'PCIe 4.0 x4', read: '7000 MB/s', write: '5000 MB/s' },
    performance: 80,
    imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    manufacturer: 'Samsung',
    inStock: true,
    features: ['1TB NVMe SSD', '7000 MB/s Read', 'Premium Performance', 'Samsung Quality'],
    isCustom: false,
  },
  {
    id: 'storage-4', category: 'storage', name: 'Samsung 990 PRO 2TB', brand: 'Samsung', price: 159, tier: 'premium',
    specs: { capacity: '2TB', type: 'NVMe', interface: 'PCIe 4.0 x4', read: '7450 MB/s', write: '6900 MB/s' },
    performance: 92,
    imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    manufacturer: 'Samsung',
    inStock: true,
    features: ['2TB NVMe SSD', '7450 MB/s Read', 'Flagship Speed', 'Large Capacity'],
    isCustom: false,
  },
  {
    id: 'storage-5', category: 'storage', name: 'WD Black SN850X 2TB', brand: 'Western Digital', price: 149, tier: 'premium',
    specs: { capacity: '2TB', type: 'NVMe', interface: 'PCIe 4.0 x4', read: '7300 MB/s', write: '6600 MB/s' },
    performance: 90,
    imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    manufacturer: 'Western Digital',
    inStock: false,
    features: ['2TB NVMe SSD', '7300 MB/s Read', 'Gaming Optimized', 'High Endurance'],
    isCustom: false,
  },
];

export const mockPSUs: PCComponent[] = [
  {
    id: 'psu-1', category: 'psu', name: 'EVGA 500 BR', brand: 'EVGA', price: 44, tier: 'budget',
    specs: { wattage: '500W', efficiency: '80+ Bronze', modular: 'Non-Modular', fanSize: '120mm' },
    performance: 45, wattage: 500,
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    manufacturer: 'EVGA',
    inStock: true,
    features: ['500W Power', '80+ Bronze', 'Reliable', 'Budget Option'],
    isCustom: false,
  },
  {
    id: 'psu-2', category: 'psu', name: 'Corsair CX650M', brand: 'Corsair', price: 69, tier: 'budget',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Semi-Modular', fanSize: '120mm' },
    performance: 60, wattage: 650,
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    manufacturer: 'Corsair',
    inStock: true,
    features: ['650W Power', 'Semi-Modular', '80+ Bronze', 'Great Value'],
    isCustom: false,
  },
  {
    id: 'psu-3', category: 'psu', name: 'Corsair RM750', brand: 'Corsair', price: 99, tier: 'mid',
    specs: { wattage: '750W', efficiency: '80+ Gold', modular: 'Fully Modular', fanSize: '135mm' },
    performance: 75, wattage: 750,
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    manufacturer: 'Corsair',
    inStock: true,
    features: ['750W Power', 'Fully Modular', '80+ Gold', 'Quiet Operation'],
    isCustom: false,
  },
  {
    id: 'psu-4', category: 'psu', name: 'Seasonic Focus GX-850', brand: 'Seasonic', price: 129, tier: 'mid',
    specs: { wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular', fanSize: '120mm' },
    performance: 82, wattage: 850,
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    manufacturer: 'Seasonic',
    inStock: true,
    features: ['850W Power', 'Fully Modular', '80+ Gold', '10 Year Warranty'],
    isCustom: false,
  },
  {
    id: 'psu-5', category: 'psu', name: 'Corsair RM1000x', brand: 'Corsair', price: 189, tier: 'premium',
    specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Fully Modular', fanSize: '135mm' },
    performance: 90, wattage: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    manufacturer: 'Corsair',
    inStock: true,
    features: ['1000W Power', 'Fully Modular', '80+ Gold', 'Zero RPM Mode'],
    isCustom: false,
  },
  {
    id: 'psu-6', category: 'psu', name: 'be quiet! Dark Power 13 1000W', brand: 'be quiet!', price: 249, tier: 'premium',
    specs: { wattage: '1000W', efficiency: '80+ Titanium', modular: 'Fully Modular', fanSize: '135mm' },
    performance: 95, wattage: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    manufacturer: 'be quiet!',
    inStock: true,
    features: ['1000W Power', '80+ Titanium', 'Ultra Quiet', 'Premium Build'],
    isCustom: false,
  },
];

export const mockCases: PCComponent[] = [
  {
    id: 'case-1', category: 'case', name: 'Deepcool MATREXX 40', brand: 'Deepcool', price: 49, tier: 'budget',
    specs: { formFactor: 'Micro-ATX', maxGPU: '320mm', fans: '2 included', driveBays: '2x 3.5", 2x 2.5"' },
    performance: 45, formFactor: 'Micro-ATX',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400',
    manufacturer: 'Deepcool',
    inStock: true,
    features: ['Micro-ATX', 'Compact Design', '2 Fans Included', 'Budget Friendly'],
    isCustom: false,
  },
  {
    id: 'case-2', category: 'case', name: 'NZXT H5 Flow', brand: 'NZXT', price: 94, tier: 'mid',
    specs: { formFactor: 'ATX', maxGPU: '365mm', fans: '2x 120mm', driveBays: '2x 3.5", 2x 2.5"' },
    performance: 70, formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400',
    manufacturer: 'NZXT',
    inStock: true,
    features: ['ATX Support', 'High Airflow', 'Clean Design', 'Cable Management'],
    isCustom: false,
  },
  {
    id: 'case-3', category: 'case', name: 'Corsair 4000D Airflow', brand: 'Corsair', price: 104, tier: 'mid',
    specs: { formFactor: 'ATX', maxGPU: '360mm', fans: '2x 120mm', driveBays: '2x 3.5", 2x 2.5"' },
    performance: 75, formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400',
    manufacturer: 'Corsair',
    inStock: true,
    features: ['ATX Support', 'Optimized Airflow', 'Tempered Glass', 'Popular Choice'],
    isCustom: false,
  },
  {
    id: 'case-4', category: 'case', name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', price: 169, tier: 'premium',
    specs: { formFactor: 'ATX', maxGPU: '422mm', fans: '0 (9 slots)', driveBays: '4x 2.5", 2x 3.5"' },
    performance: 90, formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400',
    manufacturer: 'Lian Li',
    inStock: true,
    features: ['Premium Build', '9 Fan Slots', 'Dual Chamber', 'Showcase Design'],
    isCustom: false,
  },
  {
    id: 'case-5', category: 'case', name: 'Fractal Design Torrent', brand: 'Fractal Design', price: 189, tier: 'premium',
    specs: { formFactor: 'ATX', maxGPU: '461mm', fans: '2x 180mm + 3x 140mm', driveBays: '4x 3.5", 2x 2.5"' },
    performance: 92, formFactor: 'ATX',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400',
    manufacturer: 'Fractal Design',
    inStock: true,
    features: ['Massive Airflow', '5 Fans Included', 'Spacious Interior', 'Premium Quality'],
    isCustom: false,
  },
];

export const mockCooling: PCComponent[] = [
  {
    id: 'cool-1', category: 'cooling', name: 'AMD Wraith Stealth', brand: 'AMD', price: 0, tier: 'budget',
    specs: { type: 'Air', fans: '1x 92mm', tdp: '65W', noise: '28 dBA', height: '54mm' },
    performance: 30,
    imageUrl: 'https://images.unsplash.com/photo-1591238371159-c0a0e8b0a9f7?w=400',
    manufacturer: 'AMD',
    inStock: true,
    features: ['Stock Cooler', 'Low Profile', '65W TDP', 'Free with CPU'],
    isCustom: false,
  },
  {
    id: 'cool-2', category: 'cooling', name: 'Deepcool AK400', brand: 'Deepcool', price: 29, tier: 'budget',
    specs: { type: 'Air', fans: '1x 120mm', tdp: '220W', noise: '28 dBA', height: '155mm' },
    performance: 55,
    imageUrl: 'https://images.unsplash.com/photo-1591238371159-c0a0e8b0a9f7?w=400',
    manufacturer: 'Deepcool',
    inStock: true,
    features: ['Tower Cooler', '220W TDP', 'Quiet Operation', 'Great Value'],
    isCustom: false,
  },
  {
    id: 'cool-3', category: 'cooling', name: 'Noctua NH-U12S', brand: 'Noctua', price: 69, tier: 'mid',
    specs: { type: 'Air', fans: '1x 120mm', tdp: '220W', noise: '22.4 dBA', height: '158mm' },
    performance: 72,
    imageUrl: 'https://images.unsplash.com/photo-1591238371159-c0a0e8b0a9f7?w=400',
    manufacturer: 'Noctua',
    inStock: true,
    features: ['Premium Air Cooler', 'Ultra Quiet', '220W TDP', 'Noctua Quality'],
    isCustom: false,
  },
  {
    id: 'cool-4', category: 'cooling', name: 'Arctic Liquid Freezer II 240', brand: 'Arctic', price: 89, tier: 'mid',
    specs: { type: 'AIO Liquid', fans: '2x 120mm', tdp: '300W', noise: '22.5 dBA', radiator: '240mm' },
    performance: 82,
    imageUrl: 'https://images.unsplash.com/photo-1591238371159-c0a0e8b0a9f7?w=400',
    manufacturer: 'Arctic',
    inStock: true,
    features: ['240mm AIO', '300W TDP', 'VRM Cooling', 'Great Performance'],
    isCustom: false,
  },
  {
    id: 'cool-5', category: 'cooling', name: 'NZXT Kraken X63', brand: 'NZXT', price: 149, tier: 'premium',
    specs: { type: 'AIO Liquid', fans: '2x 140mm', tdp: '350W', noise: '21 dBA', radiator: '280mm' },
    performance: 88,
    imageUrl: 'https://images.unsplash.com/photo-1591238371159-c0a0e8b0a9f7?w=400',
    manufacturer: 'NZXT',
    inStock: true,
    features: ['280mm AIO', 'LCD Display', '350W TDP', 'RGB Lighting'],
    isCustom: false,
  },
  {
    id: 'cool-6', category: 'cooling', name: 'Corsair iCUE H150i Elite', brand: 'Corsair', price: 189, tier: 'premium',
    specs: { type: 'AIO Liquid', fans: '3x 120mm RGB', tdp: '400W', noise: '20 dBA', radiator: '360mm' },
    performance: 95,
    imageUrl: 'https://images.unsplash.com/photo-1591238371159-c0a0e8b0a9f7?w=400',
    manufacturer: 'Corsair',
    inStock: true,
    features: ['360mm AIO', '400W TDP', 'RGB Fans', 'Premium Cooling'],
    isCustom: false,
  },
];

export const allComponents: Record<ComponentCategory, PCComponent[]> = {
  cpu: mockCPUs,
  gpu: mockGPUs,
  motherboard: mockMotherboards,
  ram: mockRAM,
  storage: mockStorage,
  psu: mockPSUs,
  case: mockCases,
  cooling: mockCooling,
};

export const categoryLabels: Record<ComponentCategory, string> = {
  cpu: 'Processor (CPU)',
  gpu: 'Graphics Card (GPU)',
  motherboard: 'Motherboard',
  ram: 'Memory (RAM)',
  storage: 'Storage',
  psu: 'Power Supply (PSU)',
  case: 'Case',
  cooling: 'CPU Cooler',
};

export const categoryOrder: ComponentCategory[] = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooling'];

export interface PresetBuild {
  id: string;
  name: string;
  tagline: string;
  tier: ComponentTier;
  useCase: UseCase;
  price: number;
  components: Partial<Record<ComponentCategory, string>>;
  fps?: { game: string; resolution: string; fps: number }[];
  description: string;
}

export const presetBuilds: PresetBuild[] = [
  {
    id: 'preset-1', name: 'The Starter', tagline: 'Great entry into PC gaming',
    tier: 'budget', useCase: 'gaming', price: 55000,
    components: { cpu: 'cpu-1', gpu: 'gpu-1', motherboard: 'mb-1', ram: 'ram-1', storage: 'storage-2', psu: 'psu-2', case: 'case-1', cooling: 'cool-2' },
    fps: [{ game: 'Fortnite', resolution: '1080p', fps: 120 }, { game: 'Cyberpunk 2077', resolution: '1080p', fps: 55 }],
    description: 'A solid 1080p gaming build that handles modern titles at medium-high settings. Upgrade-friendly with a clear path to better GPU and CPU.',
  },
  {
    id: 'preset-2', name: 'The Workhorse', tagline: 'Balanced performance for everything',
    tier: 'mid', useCase: 'general', price: 85000,
    components: { cpu: 'cpu-4', gpu: 'gpu-3', motherboard: 'mb-4', ram: 'ram-3', storage: 'storage-3', psu: 'psu-3', case: 'case-2', cooling: 'cool-3' },
    fps: [{ game: 'Fortnite', resolution: '1440p', fps: 144 }, { game: 'Cyberpunk 2077', resolution: '1080p', fps: 85 }],
    description: 'A well-balanced mid-range system that excels in both gaming and productivity. DDR5 platform ensures longevity.',
  },
  {
    id: 'preset-3', name: 'The Content Machine', tagline: 'Edit, render, and create',
    tier: 'mid', useCase: 'editing', price: 110000,
    components: { cpu: 'cpu-4', gpu: 'gpu-4', motherboard: 'mb-4', ram: 'ram-4', storage: 'storage-4', psu: 'psu-4', case: 'case-3', cooling: 'cool-4' },
    fps: [{ game: 'DaVinci Resolve 4K Timeline', resolution: '4K', fps: 60 }],
    description: 'Optimized for video editing, 3D rendering, and content creation. Fast storage and ample RAM keep your workflow smooth.',
  },
  {
    id: 'preset-4', name: 'The 1440p Beast', tagline: 'High-FPS 1440p gaming',
    tier: 'premium', useCase: 'gaming', price: 160000,
    components: { cpu: 'cpu-5', gpu: 'gpu-5', motherboard: 'mb-5', ram: 'ram-4', storage: 'storage-4', psu: 'psu-4', case: 'case-4', cooling: 'cool-5' },
    fps: [{ game: 'Cyberpunk 2077', resolution: '1440p', fps: 100 }, { game: 'Fortnite', resolution: '1440p', fps: 240 }],
    description: 'The ultimate 1440p gaming machine. X3D cache gives unmatched gaming performance paired with a powerful GPU.',
  },
  {
    id: 'preset-5', name: 'The Ultra Rig', tagline: 'No compromises, maximum power',
    tier: 'premium', useCase: 'gaming', price: 320000,
    components: { cpu: 'cpu-8', gpu: 'gpu-7', motherboard: 'mb-6', ram: 'ram-5', storage: 'storage-4', psu: 'psu-5', case: 'case-5', cooling: 'cool-6' },
    fps: [{ game: 'Cyberpunk 2077', resolution: '4K', fps: 90 }, { game: 'Fortnite', resolution: '4K', fps: 240 }],
    description: 'The pinnacle of PC building. 4K gaming at ultra settings, lightning-fast content creation, and future-proof for years.',
  },
  {
    id: 'preset-6', name: 'The Stream Setup', tagline: 'Game and stream simultaneously',
    tier: 'mid', useCase: 'streaming', price: 125000,
    components: { cpu: 'cpu-6', gpu: 'gpu-4', motherboard: 'mb-4', ram: 'ram-4', storage: 'storage-4', psu: 'psu-4', case: 'case-3', cooling: 'cool-4' },
    fps: [{ game: 'Valorant (streaming)', resolution: '1080p', fps: 200 }],
    description: 'Designed for streaming and gaming simultaneously. High core count CPU handles encoding while the GPU maintains smooth gameplay.',
  },
];
