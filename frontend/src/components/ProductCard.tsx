'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Sparkles } from 'lucide-react';
import { type PCComponent } from '@/data/mockComponents';
import { formatINR } from '@/store/buildContext';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface ProductCardProps {
    component: PCComponent;
    isSelected: boolean;
    onSelect: () => void;
    onDelete?: () => void;
}

import { TIER_COLORS } from "@/lib/constants";;

export default function ProductCard({
    component,
    isSelected,
    onSelect,
    onDelete,
}: ProductCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
    };

    // Get first 3-4 features or specs
    const displayFeatures = component.features || Object.entries(component.specs).slice(0, 3).map(([k, v]) => v);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    'group relative glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]',
                    isSelected
                        ? 'bg-[#ff9500]/10 border-[#ff9500]/30 shadow-[0_0_20px_rgba(255,149,0,0.2)]'
                        : 'hover:bg-white/[0.06] border-transparent'
                )}
            >
                {/* Delete Button - Only for custom builds */}
                {component.isCustom && onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDeleteModalOpen(true);
                        }}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-[#ff006e]/10 text-[#ff006e] opacity-0 group-hover:opacity-100 hover:bg-[#ff006e]/20 transition-all"
                        title="Delete build"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}

                {/* Image */}
                <div className="relative aspect-square rounded-lg bg-white/5 mb-3 overflow-hidden border border-white/10">
                    {component.imageUrl && !imageError ? (
                        <img
                            src={component.imageUrl}
                            alt={component.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6b7280]">
                            <Sparkles className="h-12 w-12" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {/* Custom Build Badge */}
                        {component.isCustom && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ff9500]/90 text-[#050810]">
                                Custom
                            </span>
                        )}

                        {/* Discount Badge */}
                        {component.discount && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ff006e]/90 text-white">
                                -{component.discount}%
                            </span>
                        )}
                    </div>

                    {/* 3D Badge (placeholder) */}
                    {component.imageUrl && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#a855f7]/90 text-white text-[10px] font-bold">
                            3D
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                    {/* Tier Badge */}
                    <div className="flex items-center gap-2">
                        <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                            style={{
                                color: TIER_COLORS[component.tier],
                                backgroundColor: `${TIER_COLORS[component.tier]}15`,
                                border: `1px solid ${TIER_COLORS[component.tier]}30`,
                            }}
                        >
                            {component.tier}
                        </span>
                        {!component.inStock && component.inStock !== undefined && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/30">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem]">
                        {component.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        {component.discount ? (
                            <>
                                <span className="text-lg font-bold text-[#ff9500]" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                                    {formatINR(component.price * (1 - component.discount / 100))}
                                </span>
                                <span className="text-xs text-[#6b7280] line-through">
                                    {formatINR(component.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                                {formatINR(component.price)}
                            </span>
                        )}
                    </div>

                    {/* Features */}
                    <div className="space-y-1">
                        {displayFeatures.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-[#b4bcd0]">
                                <div className="h-1 w-1 rounded-full bg-[#ff9500] mt-1.5 shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Performance Bar */}
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

                    {/* Add to Build Button */}
                    <button
                        onClick={onSelect}
                        className={cn(
                            'w-full py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2',
                            isSelected
                                ? 'bg-[#ff9500] text-[#050810] hover:bg-[#ff9500]/90'
                                : 'bg-white/5 text-white hover:bg-white/10'
                        )}
                    >
                        {isSelected ? (
                            <>
                                <Check className="h-4 w-4" /> Selected
                            </>
                        ) : (
                            'Add to Build'
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                buildName={component.name}
            />
        </>
    );
}


