import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu, MonitorSpeaker, CircuitBoard, MemoryStick, HardDrive, Plug, Box, Fan,
    AlertTriangle, Check, X, ChevronDown
} from 'lucide-react';
import { useBuild } from '@/store/buildContext';
import { formatINR, cn } from '@/lib/utils';
import { categoryLabels, type ComponentCategory, type PCComponent } from '@/data/mockComponents';

const categoryIcons: Record<ComponentCategory, React.ElementType> = {
    cpu: Cpu, gpu: MonitorSpeaker, motherboard: CircuitBoard, ram: MemoryStick,
    storage: HardDrive, psu: Plug, case: Box, cooling: Fan,
};

export default function ComponentSelector({
    category,
    selected,
    onSelect,
    onRemove,
    isOpen,
    onToggle,
    onBrowseAll,
}: {
    category: ComponentCategory;
    selected?: PCComponent;
    onSelect: (c: PCComponent) => void;
    onRemove: () => void;
    isOpen: boolean;
    onToggle: () => void;
    onBrowseAll?: () => void;
}) {
    const Icon = categoryIcons[category];
    const [items, setItems] = useState<PCComponent[]>([]);
    const [loading, setLoading] = useState(false);
    const { compatibilityIssues } = useBuild();
    const issuesForCategory = compatibilityIssues.filter(i => i.category === category);

    // Fetch components when section is opened
    useEffect(() => {
        if (isOpen && items.length === 0) {
            setLoading(true);
            import('@/lib/api').then(({ fetchComponents }) => {
                // Fetch components for this category
                fetchComponents({ category, minPrice: 0, maxPrice: 1000000, inStock: false })
                    .then(data => setItems(data))
                    .catch(err => console.error('Failed to load components:', err))
                    .finally(() => setLoading(false));
            });
        }
    }, [isOpen, category, items.length]);

    return (
        <div className="glass rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors"
            >
                <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    selected ? 'bg-[#ff9500]/10 border border-[#ff9500]/30 shadow-[0_0_15px_rgba(255,149,0,0.1)]' : 'bg-white/5 border border-white/10 hover:border-white/20'
                )}>
                    <Icon className={cn('h-5 w-5', selected ? 'text-[#ff9500]' : 'text-[#6b7280]')} />
                </div>
                <div className="flex-1 text-left min-w-0">
                    <div className="text-xs text-[#6b7280] uppercase tracking-wider">{categoryLabels[category]}</div>
                    {selected ? (
                        <div className="text-sm font-medium text-white truncate">{selected.name}</div>
                    ) : (
                        <div className="text-sm text-[#6b7280]">Not selected</div>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {selected && (
                        <>
                            <span className="text-sm font-mono font-semibold text-[#ff9500]">{formatINR(selected.price)}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                                className="p-1 rounded-lg hover:bg-white/10 text-[#6b7280] hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </>
                    )}
                    {issuesForCategory.length > 0 && (
                        <AlertTriangle className="h-4 w-4 text-[#ff9500]" />
                    )}
                    <ChevronDown className={cn('h-4 w-4 text-[#6b7280] transition-transform', isOpen && 'rotate-180')} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-white/5 p-3 space-y-2 max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="text-center py-4 text-sm text-[#6b7280]">Loading...</div>
                            ) : items.length > 0 ? (
                                items.map((item) => {
                                    const isSelected = selected?.id === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => onSelect(item)}
                                            className={cn(
                                                'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all',
                                                isSelected
                                                    ? 'bg-[#ff9500]/10 border border-[#ff9500]/30'
                                                    : 'hover:bg-white/[0.04] border border-transparent'
                                            )}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-white truncate">{item.name}</span>
                                                    <span className={cn(
                                                        'px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
                                                        item.tier === 'budget' ? 'bg-[#00ff9f]/10 text-[#00ff9f]' :
                                                            item.tier === 'mid' ? 'bg-[#ff9500]/10 text-[#ff9500]' :
                                                                'bg-[#a855f7]/10 text-[#a855f7]'
                                                    )}>
                                                        {item.tier || 'mid'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-[#6b7280]">
                                                    {/* Safe specs display */}
                                                    {item.specs && Object.entries(item.specs).slice(0, 3).map(([k, v]) => (
                                                        <span key={k}>{v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-sm font-mono font-semibold text-white">{formatINR(item.price)}</div>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <div className="h-1.5 w-12 rounded-full bg-white/10 overflow-hidden border border-white/5">
                                                        <div
                                                            className="h-full rounded-full bg-[#ff9500]"
                                                            style={{ width: `${item.performance || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-[#6b7280]">{item.performance || 0}</span>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="h-4 w-4 text-[#ff9500] shrink-0" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-4 text-sm text-[#6b7280]">No components found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
