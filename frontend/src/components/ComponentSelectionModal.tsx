'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronDown, Filter, DollarSign, Package, CheckCircle2, Users, Loader2 } from 'lucide-react';
import { type PCComponent, type ComponentCategory, categoryLabels } from '@/data/mockComponents';
import { type BuildState } from '@/store/buildContext';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';
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

    const handleDelete = (componentId: string) => {
        console.log('Delete component:', componentId);
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
                                    {components.map(component => (
                                        <ProductCard
                                            key={component.id}
                                            component={component}
                                            isSelected={component.id === selectedComponentId}
                                            onSelect={() => handleSelect(component)}
                                            onDelete={component.isCustom ? () => handleDelete(component.id) : undefined}
                                        />
                                    ))}
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

