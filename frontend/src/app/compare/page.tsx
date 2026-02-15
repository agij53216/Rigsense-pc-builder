'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GitCompare, Plus, X, BarChart3, Zap, DollarSign, Shield, Check, AlertTriangle,
  Cpu, MonitorSpeaker, CircuitBoard, MemoryStick, HardDrive, Plug, Box, Fan,
  ChevronDown, ArrowRight,
} from 'lucide-react';
import {
  presetBuilds, allComponents,
  type PresetBuild, type ComponentCategory,
  categoryLabels, categoryOrder,
} from '@/data/mockComponents';
import { cn } from '@/lib/utils';
import { formatINR, buildStateToPreset, useBuild } from '@/store/buildContext';

const categoryIcons: Record<ComponentCategory, React.ElementType> = {
  cpu: Cpu, gpu: MonitorSpeaker, motherboard: CircuitBoard, ram: MemoryStick,
  storage: HardDrive, psu: Plug, case: Box, cooling: Fan,
};

import { TIER_COLORS } from "@/lib/constants";;

function getPresetPerformance(preset: PresetBuild) {
  let gaming = 0, prod = 0, total = 0, wattage = 100, count = 0;
  for (const [cat, compId] of Object.entries(preset.components)) {
    const comp = allComponents[cat as ComponentCategory]?.find(c => c.id === compId);
    if (!comp) continue;
    total += comp.price;
    count++;
    if (cat === 'gpu') { gaming += comp.performance * 0.5; prod += comp.performance * 0.15; wattage += comp.wattage || 150; }
    else if (cat === 'cpu') { gaming += comp.performance * 0.3; prod += comp.performance * 0.4; wattage += comp.wattage || 65; }
    else if (cat === 'ram') { gaming += comp.performance * 0.1; prod += comp.performance * 0.25; }
    else if (cat === 'storage') { gaming += comp.performance * 0.1; prod += comp.performance * 0.2; }
  }
  return {
    gaming: Math.round(gaming),
    productivity: Math.round(prod),
    price: total,
    wattage,
    valueScore: total > 0 ? Math.round(((gaming + prod) / 2) / (total / 1000)) : 0,
  };
}

function MetricBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#b4bcd0]">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.6 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [slots, setSlots] = useState<(PresetBuild | null)[]>([null, null]);
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const { savedBuilds } = useBuild();

  // Convert saved builds to preset format and merge with default presets
  const customPresets = savedBuilds.map(buildStateToPreset);
  const allPresets = [...customPresets, ...presetBuilds];

  const addSlot = () => {
    if (slots.length < 3) setSlots([...slots, null]);
  };

  const removeSlot = (idx: number) => {
    if (slots.length > 2) {
      setSlots(slots.filter((_, i) => i !== idx));
    } else {
      setSlots(slots.map((s, i) => i === idx ? null : s));
    }
  };

  const selectPreset = (idx: number, preset: PresetBuild) => {
    setSlots(slots.map((s, i) => i === idx ? preset : s));
    setOpenSlot(null);
  };

  const stats = useMemo(() => slots.map(s => s ? getPresetPerformance(s) : null), [slots]);
  const maxGaming = Math.max(...stats.map(s => s?.gaming || 0), 1);
  const maxProd = Math.max(...stats.map(s => s?.productivity || 0), 1);
  const maxValue = Math.max(...stats.map(s => s?.valueScore || 0), 1);

  const slotColors = ['#ff9500', '#a855f7', '#ff006e'];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
          Compare Builds
        </h1>
        <p className="mt-2 text-[#b4bcd0]">
          Place preset builds side by side to compare specs, performance, and value.
        </p>
      </div>

      {/* Slot selectors */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${slots.length}, 1fr)` }}>
        {slots.map((slot, idx) => (
          <div key={idx} className="relative">
            <div
              className={cn(
                'glass rounded-xl p-4 transition-all',
                slot ? '' : 'border-dashed border-white/10'
              )}
              style={slot ? { borderColor: `${slotColors[idx]}30` } : {}}
            >
              {slot ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      style={{
                        color: TIER_COLORS[slot.tier],
                        backgroundColor: `${TIER_COLORS[slot.tier]}15`,
                      }}
                    >
                      {slot.tier}
                    </span>
                    <button
                      onClick={() => removeSlot(idx)}
                      className="p-1 rounded hover:bg-white/10 text-[#6b7280] hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-white">{slot.name}</h3>
                  <p className="text-xs text-[#6b7280] mb-2">{slot.tagline}</p>
                  <div className="text-xl font-bold" style={{ fontFamily: 'Press Start 2P, sans-serif', color: slotColors[idx] }}>
                    {formatINR(slot.price)}
                  </div>
                  <button
                    onClick={() => setOpenSlot(openSlot === idx ? null : idx)}
                    className="mt-2 text-xs text-[#ff9500] hover:underline"
                  >
                    Change build
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setOpenSlot(openSlot === idx ? null : idx)}
                  className="w-full py-8 flex flex-col items-center gap-2 text-[#6b7280] hover:text-white transition-colors"
                >
                  <Plus className="h-8 w-8" />
                  <span className="text-sm">Select a build</span>
                </button>
              )}
            </div>

            {/* Preset dropdown */}
            {openSlot === idx && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 top-full mt-2 z-20 glass-strong rounded-xl p-2 max-h-72 overflow-y-auto space-y-1"
              >
                {allPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectPreset(idx, p)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{p.name}</span>
                        {p.tagline === 'Custom Build' && (
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase"
                            style={{
                              color: '#00ff9f',
                              backgroundColor: '#00ff9f15',
                              border: '1px solid #00ff9f30',
                            }}
                          >
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#6b7280]">{p.tagline}</div>
                    </div>
                    <span className="text-sm font-mono font-semibold text-[#ff9500]">{formatINR(p.price)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        ))}

        {slots.length < 3 && (
          <button
            onClick={addSlot}
            className="glass rounded-xl border-dashed flex items-center justify-center gap-2 text-[#6b7280] hover:text-white hover:bg-white/[0.03] transition-colors min-h-[140px]"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">Add Build</span>
          </button>
        )}
      </div>

      {/* Comparison content */}
      {slots.some(Boolean) && (
        <div className="mt-8 space-y-6">
          {/* Performance Overview */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-[#a855f7]" />
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                Performance Overview
              </h2>
            </div>
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${slots.length}, 1fr)` }}>
              {slots.map((slot, idx) => {
                const s = stats[idx];
                if (!slot || !s) return <div key={idx} className="text-center text-sm text-[#6b7280]">No build selected</div>;
                return (
                  <div key={idx} className="space-y-4">
                    <div className="text-sm font-semibold text-center" style={{ color: slotColors[idx] }}>{slot.name}</div>
                    <MetricBar label="Gaming" value={s.gaming} maxValue={maxGaming} color={slotColors[idx]} />
                    <MetricBar label="Productivity" value={s.productivity} maxValue={maxProd} color={slotColors[idx]} />
                    <MetricBar label="Value Score" value={s.valueScore} maxValue={maxValue} color={slotColors[idx]} />
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] text-xs">
                      <Zap className="h-3.5 w-3.5 text-[#ff9500]" />
                      <span className="text-[#b4bcd0]">Est. Power</span>
                      <span className="ml-auto font-mono text-[#ff9500]">{s.wattage}W</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Component-by-component */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-[#ff9500]" />
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                Component Breakdown
              </h2>
            </div>
            <div className="space-y-3">
              {categoryOrder.map((cat) => {
                const CatIcon = categoryIcons[cat];
                return (
                  <div key={cat} className="rounded-lg bg-white/[0.02] p-3">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-[#b4bcd0]">
                      <CatIcon className="h-4 w-4 text-[#6b7280]" />
                      {categoryLabels[cat]}
                    </div>
                    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${slots.length}, 1fr)` }}>
                      {slots.map((slot, idx) => {
                        if (!slot) return <div key={idx} className="text-xs text-[#6b7280]">—</div>;
                        const compId = slot.components[cat];
                        const comp = compId ? allComponents[cat]?.find(c => c.id === compId) : null;
                        if (!comp) return <div key={idx} className="text-xs text-[#6b7280]">—</div>;
                        return (
                          <div key={idx} className="text-xs">
                            <div className="text-white font-medium truncate">{comp.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono" style={{ color: slotColors[idx] }}>{formatINR(comp.price)}</span>
                              <span className="text-[#6b7280]">Perf: {comp.performance}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="h-5 w-5 text-[#00ff9f]" />
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                Price Summary
              </h2>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${slots.length}, 1fr)` }}>
              {slots.map((slot, idx) => {
                const s = stats[idx];
                if (!slot || !s) return <div key={idx} />;
                return (
                  <div key={idx} className="glass rounded-xl p-4 text-center">
                    <div className="text-sm font-medium mb-2" style={{ color: slotColors[idx] }}>{slot.name}</div>
                    <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                      {formatINR(s.price)}
                    </div>
                    <div className="text-xs text-[#6b7280] mt-1">
                      {Object.keys(slot.components).length} components
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!slots.some(Boolean) && (
        <div className="mt-16 text-center">
          <GitCompare className="h-16 w-16 text-[#6b7280]/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Select builds to compare</h3>
          <p className="text-sm text-[#6b7280] max-w-md mx-auto">
            Choose two or three preset builds above to see a detailed side-by-side comparison of specs, performance, and price.
          </p>
        </div>
      )}
    </div>
  );
}


