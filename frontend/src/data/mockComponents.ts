// ─────────────────────────────────────────────────────────────────────────────
// mockComponents.ts — Type Definitions & Constants
// ALL DATA is now fetched from the Backend API. This file remains for Types.
// ─────────────────────────────────────────────────────────────────────────────

export type ComponentTier = 'budget' | 'mid' | 'premium';
export type UseCase = 'gaming' | 'editing' | 'streaming' | 'workstation' | 'general';
export type ComponentCategory =
  | 'cpu' | 'gpu' | 'motherboard' | 'ram'
  | 'storage' | 'psu' | 'case' | 'cooling';

// ─── Component spec embedded inside a prebuilt ───────────────────────────────
export interface BuildComponent {
  name: string;           // Full product name
  brand: string;
  price: number;          // INR
  specs: Record<string, string>;
  performance_score: number; // 0–100
  wattage?: number;
  socket?: string;
  ramType?: string;
  formFactor?: string;
}

// ─── Complete Prebuilt PC Model ───────────────────────────────────────────────
export interface PrebuiltPC {
  id: string;
  name: string;                          // Marketing name e.g. "Arena Starter"
  tagline: string;                       // One-liner
  tier: ComponentTier;
  useCase: UseCase;
  totalPrice: number;                    // INR — sum of all parts
  totalWattage: number;                  // Estimated system draw
  ai_score: number;                      // Weighted performance score 0–100
  description: string;
  highlights: string[];                  // 3-4 key selling points for cards
  fps?: { game: string; resolution: string; fps: number }[];
  components: Record<ComponentCategory, BuildComponent>;
  price?: number; // Normalized from totalPrice by API layer
}

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

export const categoryOrder: ComponentCategory[] = [
  'cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooling',
];

export type { ComponentTier as ComponentTierType, UseCase as UseCaseType, ComponentCategory as ComponentCategoryType };

// COMPATIBILITY LAYERS (Types only)
// -----------------------------------------------------

export type PresetBuild = PrebuiltPC;

// Re-create "PCComponent" type for consumers
export interface PCComponent extends BuildComponent {
  id: string;
  category: ComponentCategory;
  tier: ComponentTier;
  imageUrl?: string;
  inStock?: boolean;
  features?: string[];
  isCustom?: boolean;
  performance: number; // map performance_score to performance
}
