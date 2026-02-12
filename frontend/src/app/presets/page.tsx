'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight, Gamepad2, Film, Radio, Briefcase, Monitor,
  Filter, Cpu, MonitorSpeaker, CircuitBoard, MemoryStick,
  HardDrive, Plug, Box, Fan, Zap, Check, Trash2,
} from 'lucide-react';
import { useBuild, formatINR, buildStateToPreset } from '@/store/buildContext';
import {
  presetBuilds, allComponents,
  type PresetBuild, type ComponentCategory, type UseCase, type ComponentTier,
  categoryLabels,
} from '@/data/mockComponents';
import { cn } from '@/lib/utils';

import { TIER_COLORS } from "@/lib/constants";;

const useCaseIcons: Record<string, React.ElementType> = {
  gaming: Gamepad2,
  editing: Film,
  streaming: Radio,
  workstation: Briefcase,
  general: Monitor,
};

const categoryIcons: Record<ComponentCategory, React.ElementType> = {
  cpu: Cpu, gpu: MonitorSpeaker, motherboard: CircuitBoard, ram: MemoryStick,
  storage: HardDrive, psu: Plug, case: Box, cooling: Fan,
};

export default function PresetsPage() {
  const router = useRouter();
  const { loadPreset, setBudget, savedBuilds, deleteBuild } = useBuild();
  const [tierFilter, setTierFilter] = useState<ComponentTier | 'all'>('all');
  const [useCaseFilter, setUseCaseFilter] = useState<UseCase | 'all'>('all');
  const [showCustomOnly, setShowCustomOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState<PresetBuild | null>(null);

  // Convert saved builds to preset format and merge with default presets
  const customPresets = savedBuilds.map(buildStateToPreset);
  const allPresets = [...customPresets, ...presetBuilds];

  const filtered = allPresets.filter((p) => {
    if (tierFilter !== 'all' && p.tier !== tierFilter) return false;
    if (useCaseFilter !== 'all' && p.useCase !== useCaseFilter) return false;
    if (showCustomOnly && p.tagline !== 'Custom Build') return false;
    return true;
  });

  const handleLoad = (preset: PresetBuild) => {
    loadPreset(preset.components);
    setBudget(preset.price + 200);
    router.push('/build');
  };

  const handleDeleteClick = (preset: PresetBuild, e: React.MouseEvent) => {
    e.stopPropagation();
    setBuildToDelete(preset);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (buildToDelete) {
      deleteBuild(buildToDelete.id);
      setDeleteModalOpen(false);
      setBuildToDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
          Preset Builds
        </h1>
        <p className="mt-2 text-[#b4bcd0]">
          Curated builds and your custom builds. Select one to customize or use as-is.
        </p>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-[#ff9500]" />
          <span className="text-sm font-medium text-white">Filters</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-[#6b7280] self-center mr-1">Tier:</span>
          {(['all', 'budget', 'mid', 'premium'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                tierFilter === t
                  ? 'bg-[#ff9500]/15 text-[#ff9500] border border-[#ff9500]/30'
                  : 'glass text-[#b4bcd0] hover:text-white'
              )}
            >
              {t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <div className="w-px h-6 bg-white/10 self-center mx-1" />
          <span className="text-xs text-[#6b7280] self-center mr-1">Use:</span>
          {(['all', 'gaming', 'editing', 'streaming', 'workstation', 'general'] as const).map((u) => {
            const Icon = u !== 'all' ? useCaseIcons[u] : null;
            return (
              <button
                key={u}
                onClick={() => setUseCaseFilter(u)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  useCaseFilter === u
                    ? 'bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30'
                    : 'glass text-[#b4bcd0] hover:text-white'
                )}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {u === 'all' ? 'All' : u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            );
          })}
          <div className="w-px h-6 bg-white/10 self-center mx-1" />
          <button
            onClick={() => setShowCustomOnly(!showCustomOnly)}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              showCustomOnly
                ? 'bg-[#00ff9f]/15 text-[#00ff9f] border border-[#00ff9f]/30'
                : 'glass text-[#b4bcd0] hover:text-white'
            )}
          >
            <Check className={cn('h-3 w-3', showCustomOnly ? 'opacity-100' : 'opacity-0')} />
            Custom
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-[#6b7280]">No presets match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((preset, i) => {
            const UseCaseIcon = useCaseIcons[preset.useCase] || Monitor;
            const isExpanded = expandedId === preset.id;
            return (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                layout
                className="glass rounded-2xl overflow-hidden hover:bg-white/[0.03] transition-colors"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          color: TIER_COLORS[preset.tier],
                          backgroundColor: `${TIER_COLORS[preset.tier]}15`,
                          border: `1px solid ${TIER_COLORS[preset.tier]}30`,
                        }}
                      >
                        {preset.tier}
                      </span>
                      {/* Custom badge for user-created builds */}
                      {preset.tagline === 'Custom Build' && (
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            color: '#00ff9f',
                            backgroundColor: '#00ff9f15',
                            border: '1px solid #00ff9f30',
                          }}
                        >
                          Custom
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                        <UseCaseIcon className="h-3 w-3" />
                        {preset.useCase}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                      {formatINR(preset.price)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{preset.name}</h3>
                  <p className="text-sm text-[#b4bcd0] mb-4">{preset.tagline}</p>

                  {/* FPS badges */}
                  {preset.fps && preset.fps.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {preset.fps.map((f) => (
                        <div key={f.game} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] text-xs">
                          <span className="text-[#6b7280]">{f.game}</span>
                          <span className="text-[#b4bcd0]">{f.resolution}</span>
                          <span className="font-mono font-bold text-[#ff9500]">{f.fps}</span>
                          <span className="text-[#6b7280]">FPS</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Expand / collapse component list */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : preset.id)}
                    className="text-xs text-[#ff9500] hover:underline mb-4 block"
                  >
                    {isExpanded ? 'Hide components' : 'Show components'}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 mb-4"
                    >
                      {(Object.entries(preset.components) as [ComponentCategory, string][]).map(([cat, compId]) => {
                        const comp = allComponents[cat]?.find(c => c.id === compId);
                        if (!comp) return null;
                        const CatIcon = categoryIcons[cat];
                        return (
                          <div key={cat} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] text-xs">
                            <CatIcon className="h-3.5 w-3.5 text-[#6b7280]" />
                            <span className="text-[#6b7280] min-w-[60px]">{categoryLabels[cat].split(' (')[0]}</span>
                            <span className="text-white flex-1 truncate">{comp.name}</span>
                            <span className="font-mono text-[#b4bcd0]">{formatINR(comp.price)}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  <p className="text-xs text-[#6b7280] leading-relaxed mb-5">{preset.description}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(preset)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#050810] bg-gradient-to-r from-[#ff9500] to-[#ff6b00] rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] hover:scale-[1.02] active:scale-95"
                    >
                      Use This Build <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    {/* Delete button for custom builds */}
                    {preset.tagline === 'Custom Build' && (
                      <button
                        onClick={(e) => handleDeleteClick(preset, e)}
                        className="px-4 py-2.5 rounded-xl bg-[#ff006e]/10 text-[#ff006e] hover:bg-[#ff006e]/20 transition-all hover:scale-[1.02] active:scale-95 border border-[#ff006e]/30"
                        title="Delete build"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDeleteModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-[#0d1220] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff006e]/10 border border-[#ff006e]/30">
                <Trash2 className="h-6 w-6 text-[#ff006e]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Delete Build?</h3>
                <p className="text-sm text-[#b4bcd0]">
                  Are you sure you want to delete <span className="font-semibold text-white">"{buildToDelete?.name}"</span>?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#ff006e]/5 border border-[#ff006e]/20 mb-6">
              <p className="text-xs text-[#ff006e] font-medium">
                ⚠️ This action cannot be undone
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-white/5 text-[#b4bcd0] font-semibold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-lg bg-[#ff006e] text-white font-bold hover:bg-[#ff006e]/90 transition-colors"
              >
                Delete Build
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


