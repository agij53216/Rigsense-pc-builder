import { createContext, useContext, useState, useCallback, useRef, type ReactNode, useEffect, useMemo } from 'react';
import { type ComponentCategory, type PCComponent, type UseCase, type PresetBuild, type ComponentTier } from '@/data/mockComponents';
import { generateBuild, type AlternativeBuilds } from '@/lib/api';
import { generateRandomName } from '@/utils/nameGenerator';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils';
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
  setComponents: (components: Partial<Record<ComponentCategory, PCComponent>>) => void;
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

// Convert BuildState to PresetBuild format for display in presets/comparison
export function buildStateToPreset(build: BuildState): PresetBuild {
  // Store full component objects or IDs
  const components: Partial<Record<ComponentCategory, string | PCComponent>> = {};
  for (const [category, component] of Object.entries(build.components)) {
    if (component) {
      // Store the full object so ComparePage allows it even if not in allComponents
      components[category as ComponentCategory] = component;
    }
  }

  // Calculate total price
  const price = Object.values(build.components).reduce((sum, c) => sum + (c?.price || 0), 0);

  // Determine tier based on price (updated for USD)
  const tier: ComponentTier = price > 2000 ? 'premium' : price > 1000 ? 'mid' : 'budget';

  return {
    id: build.id || `build_${Date.now()}`,
    name: build.name || 'Untitled Build',
    tagline: 'Custom Build',
    tier,
    useCase: (build.useCase as UseCase) || 'general',
    price,
    totalPrice: price,
    totalWattage: 0,
    ai_score: 0,
    highlights: [],
    components: components as any, // Backend-shaped objects are compatible at runtime
    description: `Custom build created on ${build.date ? new Date(build.date).toLocaleDateString() : 'unknown date'}`,
  };
}


export function BuildProvider({ children }: { children: ReactNode }) {
  const [build, setBuild] = useState<BuildState>(defaultBuild);
  const [savedBuilds, setSavedBuilds] = useState<BuildState[]>([]);
  const isSavingRef = useRef(false);

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

  // Guest ID management
  const [guestId, setGuestId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let gid = localStorage.getItem('rigsense_guest_id');
      if (!gid) {
        gid = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('rigsense_guest_id', gid);
      }
      setGuestId(gid);

      // Migration: Check for local builds and move to backend
      const localBuilds = localStorage.getItem(STORAGE_KEY);
      if (localBuilds) {
        try {
          const parsed = JSON.parse(localBuilds);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Migration logic: Upload to backend
            const migrate = async () => {
              for (const b of parsed) {
                try {
                  await import('@/lib/api').then(mod => mod.saveBuildApi(b, gid));
                } catch (err) {
                  console.error('Failed to migrate build', b, err);
                }
              }
              localStorage.removeItem(STORAGE_KEY); // Clear after migration
              // Refresh contents
              import('@/lib/api').then(mod => mod.fetchSavedBuilds(gid)).then(setSavedBuilds).catch(console.error);
            };
            migrate();
          } else {
            // Just fetch if no migration needed
            import('@/lib/api').then(mod => mod.fetchSavedBuilds(gid)).then(setSavedBuilds).catch(console.error);
          }
        } catch (e) {
          console.error('Migration error', e);
          import('@/lib/api').then(mod => mod.fetchSavedBuilds(gid)).then(setSavedBuilds).catch(console.error);
        }
      } else {
        // No local builds, just fetch from backend
        import('@/lib/api').then(mod => mod.fetchSavedBuilds(gid)).then(setSavedBuilds).catch(console.error);
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

        const data = await import('@/lib/api').then(mod => mod.validateBuild(build.components, build.budget, build.useCase, build.performancePreference));

        setCompatibilityIssues(data.compatibilityIssues);
        setIsFullyCompatible(data.isFullyCompatible);
        setPerformanceScores(data.performanceScores);
        setSuggestions(data.suggestions);
        if (data.alternatives) setAlternatives(data.alternatives);
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

  const loadPreset = useCallback((presetComponents: Partial<Record<ComponentCategory, string | PCComponent>>) => {
    const components: Partial<Record<ComponentCategory, PCComponent>> = {};
    for (const [category, val] of Object.entries(presetComponents)) {
      const cat = category as ComponentCategory;
      if (typeof val === 'string') {
        // Legacy ID support removed - backend provides full objects now
        // If needed, could fetch component here, but for now just skip or placeholder
        console.warn('Legacy string ID found:', val);
      } else if (val && typeof val === 'object') {
        // Backend populated object
        components[cat] = val as PCComponent;
      }
    }
    setBuild(prev => ({ ...prev, components }));
  }, []);

  const setComponents = useCallback((components: Partial<Record<ComponentCategory, PCComponent>>) => {
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
      if (result.alternatives) setAlternatives(result.alternatives);

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

    // Prevent double-saves from rapid clicks
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    const newBuild = {
      ...build,
      name: name.trim(),
      totalPrice // ensure total price is saved
    };

    try {
      const saved = await import('@/lib/api').then(mod => mod.saveBuildApi(newBuild, guestId));

      // Normalize _id -> id then prepend to local state
      const normalised = { ...saved, id: saved._id || saved.id };
      setSavedBuilds(prev => [normalised, ...prev]);

      toast.success('Build saved successfully!', {
        description: 'View it in the Presets page.'
      });
    } catch (e) {
      console.error('Failed to save build', e);
      toast.error('Failed to save build. Please try again.');
    } finally {
      isSavingRef.current = false;
    }
  }, [build, guestId, totalPrice]);

  const deleteBuild = useCallback(async (buildId: string) => {
    try {
      await import('@/lib/api').then(mod => mod.deleteBuildApi(buildId, guestId));
      setSavedBuilds(prev => prev.filter(b => (b.id !== buildId && (b as any)._id !== buildId)));
      toast.success('Build deleted');
    } catch (e) {
      console.error('Failed to delete build', e);
      toast.error('Failed to delete build');
    }
  }, [guestId]);

  const contextValue = useMemo(() => ({
    build, savedBuilds, setBudget, setUseCase, setPerformancePreference,
    addComponent, removeComponent, clearBuild, loadPreset, setComponents, loadBuild,
    generateAutoBuild, saveBuild, deleteBuild, suggestions, alternatives, upgradePath,
    totalPrice, remainingBudget, compatibilityIssues, isFullyCompatible,
    performanceScores, totalWattage, completionPercentage,
  }), [
    build, savedBuilds, setBudget, setUseCase, setPerformancePreference,
    addComponent, removeComponent, clearBuild, loadPreset, setComponents, loadBuild,
    generateAutoBuild, saveBuild, deleteBuild, suggestions, alternatives, upgradePath,
    totalPrice, remainingBudget, compatibilityIssues, isFullyCompatible,
    performanceScores, totalWattage, completionPercentage,
  ]);

  return (
    <BuildContext.Provider value={contextValue}>
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error('useBuild must be used within BuildProvider');
  return ctx;
}

