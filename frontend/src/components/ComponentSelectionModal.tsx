'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronDown, Filter, DollarSign, Package, CheckCircle2, Users, Loader2, Trash2, Sparkles } from 'lucide-react';
import { type PCComponent, type ComponentCategory, categoryLabels } from '@/data/mockComponents';
import { type BuildState } from '@/store/buildContext';
import { cn, formatINR } from '@/lib/utils';
import { fetchComponents, fetchBrands, type ComponentFilter } from '@/lib/api';

interface ComponentSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: ComponentCategory;
    onSelect: (component: PCComponent) => void;
    currentBuild: BuildState;
    selectedComponentId?: string;
}

type SortOption = 'price-asc' | 'price-desc' | 'performance' | 'name';

export default function ComponentSelectionModal({
    isOpen,
    onClose,
    category,
    onSelect,
    currentBuild,
    selectedComponentId,
}: ComponentSelectionModalProps) {
    const [components, setComponents] = useState<PCComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]); // Increased max range
    const [manufacturers, setManufacturers] = useState<string[]>([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
    const [showCompatibleOnly, setShowCompatibleOnly] = useState(true); // Default to true
    const [showInStockOnly, setShowInStockOnly] = useState(false);
    const [showCustomOnly, setShowCustomOnly] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('performance');
    const [showFilters, setShowFilters] = useState(true);

    // Fetch manufacturers on mount or category change
    useEffect(() => {
        fetchBrands(category)
            .then(brands => setManufacturers(brands))
            .catch(err => console.error('Failed to fetch brands:', err));
    }, [category]);

    // Fetch components when filters change
    useEffect(() => {
        const loadComponents = async () => {
            setLoading(true);
            try {
                // Determine compatibility filters
                let socket, ramType, formFactor;

                if (showCompatibleOnly) {
                    // Check socket compatibility
                    if (category === 'cpu' && currentBuild.components.motherboard) {
                        socket = currentBuild.components.motherboard.socket || currentBuild.components.motherboard.specs?.socket;
                    }
                    if (category === 'motherboard' && currentBuild.components.cpu) {
                        socket = currentBuild.components.cpu.socket || currentBuild.components.cpu.specs?.socket;
                    }

                    // Check RAM type compatibility
                    if (category === 'ram' && currentBuild.components.motherboard) {
                        ramType = currentBuild.components.motherboard.ramType || currentBuild.components.motherboard.specs?.ramType;
                    }
                    if (category === 'motherboard' && currentBuild.components.ram) {
                        ramType = currentBuild.components.ram.ramType || currentBuild.components.ram.specs?.ramType;
                    }

                    // Check case form factor (approximate)
                    // Note: Ideally backend handles "ATX fits Micro-ATX" logic. 
                    // Current backend strict equality check might be too strict for Form Factor (ATX case fits Micro-ATX board).
                    // For now, we only filter strict matches or client-side.
                    // Let's rely on client-side visual cues for complex compatibility if strict filter fails?
                    // Actually, let's skip formFactor strict filter in API for now to avoid empty results, 
                    // or implement smarter backend logic later.
                    // We'll proceed with socket/ramType which are usually strict.
                }

                const filter: ComponentFilter = {
                    category,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    brand: selectedManufacturers,
                    inStock: showInStockOnly,
                    search: searchQuery,
                    sort: sortBy === 'price-asc' ? 'price_asc' : sortBy === 'price-desc' ? 'price_desc' : sortBy, // Map sort keys
                    socket,
                    ramType
                };

                const data = await fetchComponents(filter);
                setComponents(data);
            } catch (error) {
                console.error('Failed to load components:', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search slightly
        const timeoutId = setTimeout(() => {
            if (isOpen) loadComponents();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [category, searchQuery, priceRange, selectedManufacturers, showInStockOnly, showCompatibleOnly, sortBy, isOpen, currentBuild]);

    const toggleManufacturer = (brand: string) => {
        setSelectedManufacturers(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleSelect = (component: PCComponent) => {
        onSelect(component);
        onClose();
    };

    const handleDelete = (component: PCComponent, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${component.name}"?`)) {
            // In a real app, this would call an API/store action
            console.log('Delete component:', component.id);
            // After delete logic (which isn't fully implemented in the original file either), reload or update state
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-4 md:inset-8 bg-[#050810] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                                Select {categoryLabels[category]}
                            </h2>
                            <p className="text-sm text-[#b4bcd0] mt-1">
                                {loading ? 'Loading...' : `Showing ${components.length} products`}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 text-[#6b7280] hover:text-white transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Top Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 md:p-6 border-b border-white/10">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                            <input
                                type="text"
                                placeholder="Search components..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#ff9500]/50 focus:bg-white/10 transition-colors"
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="appearance-none pl-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#ff9500]/50 focus:bg-white/10 transition-colors cursor-pointer"
                            >
                                <option value="performance">Sort: Performance</option>
                                <option value="price-asc">Sort: Price (Low to High)</option>
                                <option value="price-desc">Sort: Price (High to Low)</option>
                                <option value="name">Sort: Name</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280] pointer-events-none" />
                        </div>

                        {/* Toggle Filters (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar Filters */}
                        <div className={cn(
                            'w-full sm:w-72 border-r border-white/10 p-4 md:p-6 overflow-y-auto space-y-6',
                            showFilters ? 'block' : 'hidden sm:block'
                        )}>
                            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                                <Filter className="h-4 w-4" />
                                Filters
                            </div>

                            {/* Price Range */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-[#b4bcd0]">
                                    <DollarSign className="h-4 w-4" />
                                    Price Range
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min={0}
                                        max={5000}
                                        step={50}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-[#ff9500]"
                                    />
                                    <div className="flex justify-between text-xs text-[#6b7280]">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Manufacturers */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-[#b4bcd0]">
                                    <Users className="h-4 w-4" />
                                    Manufacturer
                                </div>
                                <div className="space-y-2">
                                    {manufacturers.map(brand => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedManufacturers.includes(brand)}
                                                onChange={() => toggleManufacturer(brand)}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff9500] focus:ring-[#ff9500] focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-[#b4bcd0] group-hover:text-white transition-colors">
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Compatibility */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-[#b4bcd0]">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Compatibility
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={showCompatibleOnly}
                                        onChange={(e) => setShowCompatibleOnly(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff9500] focus:ring-[#ff9500] focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-[#b4bcd0] group-hover:text-white transition-colors">
                                        Show compatible only
                                    </span>
                                </label>
                            </div>

                            {/* Stock Status */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-[#b4bcd0]">
                                    <Package className="h-4 w-4" />
                                    Availability
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={showInStockOnly}
                                        onChange={(e) => setShowInStockOnly(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff9500] focus:ring-[#ff9500] focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-[#b4bcd0] group-hover:text-white transition-colors">
                                        In stock only
                                    </span>
                                </label>
                            </div>

                            {/* Custom Builds Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-[#b4bcd0]">
                                    <Package className="h-4 w-4" />
                                    Build Type
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={showCustomOnly}
                                        onChange={(e) => setShowCustomOnly(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff9500] focus:ring-[#ff9500] focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-[#b4bcd0] group-hover:text-white transition-colors">
                                        Custom builds only
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Loader2 className="h-12 w-12 text-[#ff9500] animate-spin mb-4" />
                                    <p className="text-sm text-[#b4bcd0]">Loading components...</p>
                                </div>
                            ) : components.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {components.map(component => {
                                        const isSelected = component.id === selectedComponentId;
                                        return (
                                            <motion.div
                                                key={component.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={cn(
                                                    'group relative glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer',
                                                    isSelected
                                                        ? 'bg-[#ff9500]/10 border-[#ff9500]/30 shadow-[0_0_20px_rgba(255,149,0,0.2)]'
                                                        : 'hover:bg-white/[0.06] border-transparent'
                                                )}
                                                onClick={() => handleSelect(component)}
                                            >
                                                {/* Delete Button */}
                                                {component.isCustom && (
                                                    <button
                                                        onClick={(e) => handleDelete(component, e)}
                                                        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-[#ff006e]/10 text-[#ff006e] opacity-0 group-hover:opacity-100 hover:bg-[#ff006e]/20 transition-all"
                                                        title="Delete build"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {/* Image */}
                                                <div className="relative aspect-square rounded-lg bg-white/5 mb-3 overflow-hidden border border-white/10">
                                                    {component.imageUrl ? (
                                                        <img
                                                            src={component.imageUrl}
                                                            alt={component.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#6b7280]">
                                                            <Sparkles className="h-12 w-12" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="space-y-2">
                                                    {/* Tier Badge */}
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider",
                                                            component.tier === 'budget' ? 'text-[#00ff9f] bg-[#00ff9f]/10 border border-[#00ff9f]/30' :
                                                                component.tier === 'mid' ? 'text-[#ff9500] bg-[#ff9500]/10 border border-[#ff9500]/30' :
                                                                    'text-[#a855f7] bg-[#a855f7]/10 border border-[#a855f7]/30'
                                                        )}>
                                                            {component.tier}
                                                        </span>
                                                    </div>

                                                    {/* Name */}
                                                    <h3 className="text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem]">
                                                        {component.name}
                                                    </h3>

                                                    {/* Price */}
                                                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                                                        {formatINR(component.price)}
                                                    </div>

                                                    {/* Performance */}
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px]">
                                                            <span className="text-[#6b7280]">Performance</span>
                                                            <span className="text-[#ff9500] font-semibold">{component.performance}</span>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/5">
                                                            <div
                                                                className="h-full rounded-full bg-[#ff9500]"
                                                                style={{ width: `${component.performance}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Package className="h-16 w-16 text-[#6b7280] mb-4" />
                                    <h3 className="text-lg font-semibold text-white mb-2">No components found</h3>
                                    <p className="text-sm text-[#b4bcd0]">
                                        Try adjusting your filters or search query
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

