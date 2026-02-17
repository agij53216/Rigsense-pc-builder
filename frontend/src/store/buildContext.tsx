import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import { type ComponentCategory, type PCComponent, allComponents, type UseCase, type PresetBuild, type ComponentTier } from '@/data/mockComponents';
import { generateBuild, type AlternativeBuilds } from '@/lib/api';
import { generateRandomName } from '@/utils/nameGenerator';
import { toast } from 'sonner';

export interface BuildState {
  id?: string;
  name?: string;
  date?: string;
  components: Partial<Record<ComponentCategory, PCComponent>>;
  budget: number;
  useCase: string;
  performancePreference: number; // 0-100 balanced to performance
}

interface CompatibilityIssue {
  type: 'error' | 'warning';
  message: string;
  category?: ComponentCategory;
}

interface PerformanceScores {
  gaming: number;
  productivity: number;
  rendering: number;
  overall: number;
  confidenceScore: number;
  tier: string;
  fps: Record<string, number>;
}

interface BuildContextType {
  build: BuildState;
  savedBuilds: BuildState[];
  setBudget: (budget: number) => void;
  setUseCase: (useCase: string) => void;
  setPerformancePreference: (pref: number) => void;
  addComponent: (component: PCComponent) => void;
  removeComponent: (category: ComponentCategory) => void;
  clearBuild: () => void;
  loadBuild: (build: BuildState) => void;
  loadPreset: (components: Partial<Record<ComponentCategory, string>>) => void;
  generateAutoBuild: () => void;
  saveBuild: (name?: string) => Promise<void>;
  deleteBuild: (buildId: string) => void;
  suggestions: string[];
  alternatives: AlternativeBuilds;
  upgradePath: string;
  totalPrice: number;
  remainingBudget: number;
  compatibilityIssues: CompatibilityIssue[];
  isFullyCompatible: boolean;
  performanceScores: PerformanceScores;
  totalWattage: number;
  completionPercentage: number;
}

const defaultBuild: BuildState = {
  id: '',
  name: '',
  date: '',
  budget: 1500,
  components: {},
  useCase: 'gaming',
  performancePreference: 50,
};

const BuildContext = createContext<BuildContextType | null>(null);

const STORAGE_KEY = 'rigsense_saved_builds';

// Utility function to format price in INR
export function formatINR(price: number): string {
  return `₹${price.toLocaleString()}`;
}

// Convert BuildState to PresetBuild format for display in presets/comparison
export function buildStateToPreset(build: BuildState): PresetBuild {
  // Convert component objects to component IDs
  const componentIds: Partial<Record<ComponentCategory, string>> = {};
  for (const [category, component] of Object.entries(build.components)) {
    if (component) {
      componentIds[category as ComponentCategory] = component.id;
    }
  }

  // Calculate total price
  const price = Object.values(build.components).reduce((sum, c) => sum + (c?.price || 0), 0);

  // Determine tier based on price
  const tier: ComponentTier = price > 2000 ? 'premium' : price > 1000 ? 'mid' : 'budget';

  return {
    id: build.id || `build_${Date.now()}`,
    name: build.name || 'Untitled Build',
    tagline: 'Custom Build',
    tier,
    useCase: (build.useCase as UseCase) || 'general',
    price,
    components: componentIds,
    description: `Custom build created on ${build.date ? new Date(build.date).toLocaleDateString() : 'unknown date'}`,
  };
}


export function BuildProvider({ children }: { children: ReactNode }) {
  const [build, setBuild] = useState<BuildState>(defaultBuild);
  const [savedBuilds, setSavedBuilds] = useState<BuildState[]>([]);

  // Backend State
  const [compatibilityIssues, setCompatibilityIssues] = useState<CompatibilityIssue[]>([]);
  const [isFullyCompatible, setIsFullyCompatible] = useState(true);
  const [performanceScores, setPerformanceScores] = useState<PerformanceScores>({
    gaming: 0, productivity: 0, rendering: 0, overall: 0, confidenceScore: 0, tier: 'Entry', fps: {}
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<AlternativeBuilds>({});
  const [upgradePath, setUpgradePath] = useState('');
  const [totalWattage, setTotalWattage] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setSavedBuilds(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved builds', e);
        }
      }
    }
  }, []);

  // Validate build with backend whenever relevant state changes
  useEffect(() => {
    const validate = async () => {
      try {
        // Only validate if we have at least one component, or to reset stats
        if (Object.keys(build.components).length === 0) {
          setCompatibilityIssues([]);
          setIsFullyCompatible(true);
          setTotalWattage(0);
          setTotalPrice(0);
          setCompletionPercentage(0);
          setSuggestions([]);
          setAlternatives({});
          setUpgradePath('');
          return;
        }

        const data = await import('@/lib/api').then(mod => mod.validateBuild(build.components, build.budget, build.useCase));

        setCompatibilityIssues(data.compatibilityIssues);
        setIsFullyCompatible(data.isFullyCompatible);
        setPerformanceScores(data.performanceScores);
        setSuggestions(data.suggestions);
        setAlternatives(data.alternatives);
        setUpgradePath(data.upgradePath);
        setTotalWattage(data.estimatedWattage);
        setTotalPrice(data.totalPrice);
        setCompletionPercentage(data.completionPercentage);

      } catch (error) {
        console.error('Validation failed:', error);
      }
    };

    // Debounce slightly to avoid rapid API calls
    const timeout = setTimeout(validate, 500);
    return () => clearTimeout(timeout);
  }, [build.components, build.budget, build.useCase]);

  const remainingBudget = build.budget - totalPrice;

  const setBudget = useCallback((budget: number) => setBuild(prev => ({ ...prev, budget })), []);
  const setUseCase = useCallback((useCase: string) => setBuild(prev => ({ ...prev, useCase })), []);
  const setPerformancePreference = useCallback((performancePreference: number) => setBuild(prev => ({ ...prev, performancePreference })), []);

  const addComponent = useCallback((component: PCComponent) => {
    setBuild(prev => ({ ...prev, components: { ...prev.components, [component.category]: component } }));
  }, []);

  const removeComponent = useCallback((category: ComponentCategory) => {
    setBuild(prev => {
      const newComponents = { ...prev.components };
      delete newComponents[category];
      return { ...prev, components: newComponents };
    });
  }, []);

  const clearBuild = useCallback(() => {
    setBuild(prev => ({ ...prev, components: {} }));
  }, []);

  const loadBuild = useCallback((savedBuild: BuildState) => {
    setBuild(savedBuild);
    toast.success(`Loaded build: ${savedBuild.name}`);
  }, []);

  const loadPreset = useCallback((componentIds: Partial<Record<ComponentCategory, string>>) => {
    const components: Partial<Record<ComponentCategory, PCComponent>> = {};
    for (const [category, id] of Object.entries(componentIds)) {
      const cat = category as ComponentCategory;
      const found = allComponents[cat]?.find(c => c.id === id);
      if (found) components[cat] = found;
    }
    setBuild(prev => ({ ...prev, components }));
  }, []);

  const generateAutoBuild = useCallback(async () => {
    try {
      const result = await generateBuild(build.budget, build.useCase as UseCase, build.performancePreference);
      // Backend now returns full build and metrics
      setBuild(prev => ({ ...prev, components: result.build }));

      // Update local state directly from response to skip one validation round trip
      if (result.performanceScores) setPerformanceScores(result.performanceScores);
      if (result.compatibilityIssues) setCompatibilityIssues(result.compatibilityIssues);
      if (result.suggestions) setSuggestions(result.suggestions);

      toast.success('Build generated based on your preferences!');
    } catch (error) {
      console.error('Auto-build generation failed:', error);
      toast.error('Failed to generate build. Please try again.');
    }
  }, [build.budget, build.useCase, build.performancePreference]);

  const saveBuild = useCallback(async (name?: string) => {
    if (!name || name.trim() === '') {
      toast.error('Please provide a name for your build');
      return;
    }

    const newBuild: BuildState = {
      ...build,
      id: `build_${Date.now()}`,
      name: name.trim(),
      date: new Date().toISOString(),
    };

    const updatedBuilds = [...savedBuilds, newBuild];
    setSavedBuilds(updatedBuilds);

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBuilds));
      toast.success('Build saved successfully!', {
        description: 'View it in the Presets page.'
      });
    } catch (e) {
      console.error('Failed to save build to localStorage', e);
      toast.error('Failed to save build. Please try again.');
    }
  }, [build, savedBuilds]);

  const deleteBuild = useCallback((buildId: string) => {
    const buildToDelete = savedBuilds.find(b => b.id === buildId);
    if (!buildToDelete) {
      toast.error('Build not found');
      return;
    }

    const updatedBuilds = savedBuilds.filter(b => b.id !== buildId);
    setSavedBuilds(updatedBuilds);

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBuilds));
      toast.success(`Deleted "${buildToDelete.name}"`, {
        description: 'Build removed successfully.'
      });
    } catch (e) {
      console.error('Failed to delete build from localStorage', e);
      toast.error('Failed to delete build. Please try again.');
    }
  }, [savedBuilds]);

  return (
    <BuildContext.Provider value={{
      build, savedBuilds, setBudget, setUseCase, setPerformancePreference,
      addComponent, removeComponent, clearBuild, loadPreset, loadBuild,
      generateAutoBuild, saveBuild, deleteBuild, suggestions, alternatives, upgradePath,
      totalPrice, remainingBudget, compatibilityIssues, isFullyCompatible,
      performanceScores, totalWattage, completionPercentage,
    }}>
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error('useBuild must be used within BuildProvider');
  return ctx;
}

