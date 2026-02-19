'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, MonitorSpeaker, CircuitBoard, MemoryStick, HardDrive, Plug, Box, Fan,
  AlertTriangle, AlertCircle, Check, Plus, X, ChevronDown, Zap, BarChart3, DollarSign, Save, Sparkles, RefreshCcw, Printer, Edit3, Dice5,
} from 'lucide-react';
import { useBuild } from '@/store/buildContext';
import { formatINR } from '@/lib/utils';
import { generateRandomName } from '@/utils/nameGenerator';
import {
  categoryLabels, categoryOrder,
  type ComponentCategory, type PCComponent,
} from '@/data/mockComponents';
import { cn } from '@/lib/utils';
import BuildStrategySelector from '@/components/BuildStrategySelector';
import ComponentSelectionModal from '@/components/ComponentSelectionModal';
import ComponentSelector from '@/components/ComponentSelector';

function PerformanceBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#b4bcd0]">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function BuildPage() {
  const {
    build, setBudget, addComponent, removeComponent, clearBuild,
    totalPrice, remainingBudget, compatibilityIssues, isFullyCompatible,
    performanceScores, totalWattage, completionPercentage,
    suggestions, saveBuild, generateAutoBuild,
    alternatives, upgradePath,
  } = useBuild();

  const handlePrint = () => {
    window.print();
  };

  const [openCategory, setOpenCategory] = useState<ComponentCategory | null>(null);
  const [modalCategory, setModalCategory] = useState<ComponentCategory | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [buildName, setBuildName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = () => {
    setBuildName(generateRandomName());
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    await saveBuild(buildName);
    setIsSaving(false);
    setIsSaveModalOpen(false);
  };

  const handleRandomizeName = () => {
    setBuildName(generateRandomName());
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
          Build Configurator
        </h1>
        <p className="mt-2 text-[#b4bcd0]">Select components for your custom PC build</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Component List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Budget control */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#00ff9f]" />
                <span className="text-sm font-medium text-white">Budget</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={clearBuild} className="text-xs text-[#6b7280] hover:text-white transition-colors">
                  Clear All
                </button>
                <div className="h-4 w-px bg-white/10" />
                <button
                  onClick={generateAutoBuild}
                  className="text-xs text-[#ff9500] hover:text-[#ff9500]/80 transition-colors flex items-center gap-1"
                >
                  <RefreshCcw className="h-3 w-3" /> Regenerate
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={500}
                max={5000}
                step={100}
                value={build.budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-white/10 accent-[#ff9500]"
              />
              <span className="text-lg font-mono font-bold text-[#ff9500] min-w-[80px] text-right">
                {formatINR(build.budget)}
              </span>
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#6b7280]">
              <span>Spent: {formatINR(totalPrice)}</span>
              <span className={remainingBudget < 0 ? 'text-[#ff006e]' : ''}>
                Remaining: {formatINR(remainingBudget)}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden border border-white/5">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  remainingBudget < 0 ? 'bg-[#ff006e]' : 'bg-gradient-to-r from-[#ff9500] to-[#a855f7]'
                )}
                style={{ width: `${Math.min(100, (totalPrice / build.budget) * 100)}%` }}
              />
            </div>
          </div>

          {/* Component selectors */}
          {categoryOrder.map((cat) => (
            <ComponentSelector
              key={cat}
              category={cat}
              selected={build.components[cat]}
              onSelect={addComponent}
              onRemove={() => removeComponent(cat)}
              isOpen={openCategory === cat}
              onToggle={() => setOpenCategory(openCategory === cat ? null : cat)}
              onBrowseAll={() => setModalCategory(cat)}
            />
          ))}

          {/* Alternative Builds - Moved to Sidebar */}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Strategy Selector */}
          <BuildStrategySelector />

          {/* Build Summary */}
          <div className="glass rounded-xl p-5 sticky top-20 border border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Build Summary
            </h3>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#a855f7]/10 to-[#ff9500]/10 border border-[#a855f7]/20">
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-[#a855f7]">
                  <Sparkles className="h-4 w-4" /> AI Suggestions
                </div>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <div key={i} className="text-xs text-[#b4bcd0] flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#ff9500] mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#b4bcd0]">Completion</span>
                <span className="text-white font-semibold">{completionPercentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#ff9500] to-[#a855f7]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-y border-white/5">
              <span className="text-sm text-[#b4bcd0]">Total</span>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                {formatINR(totalPrice)}
              </span>
            </div>

            {/* Performance FPS - Removed FPSEstimator */}
            {performanceScores.overall > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#b4bcd0]">Performance Score</span>
                  <span className="font-mono font-semibold text-[#ff9500]">{performanceScores.overall}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${performanceScores.overall}%` }}
                    className="h-full rounded-full bg-[#ff9500]"
                  />
                </div>
              </div>
            )}

            {/* Wattage */}
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-white/[0.03]">
              <Zap className="h-4 w-4 text-[#ff9500]" />
              <span className="text-sm text-[#b4bcd0]">Est. Power Draw</span>
              <span className="ml-auto text-sm font-mono font-semibold text-[#ff9500]">{totalWattage}W</span>
            </div>

            {/* Compatibility */}
            {compatibilityIssues.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-semibold text-[#b4bcd0] uppercase tracking-wider">Issues</div>
                {compatibilityIssues.map((issue, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-2 p-2.5 rounded-lg text-xs',
                      issue.type === 'error'
                        ? 'bg-[#ff006e]/10 text-[#ff006e]'
                        : 'bg-[#ff9500]/10 text-[#ff9500]'
                    )}
                  >
                    {issue.type === 'error' ? (
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    )}
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}

            {compatibilityIssues.length === 0 && Object.keys(build.components).length > 1 && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-[#00ff9f]/10 text-[#00ff9f] text-xs">
                <Check className="h-3.5 w-3.5" />
                All components are compatible
              </div>
            )}
            {/* Actions */}
            <div className="flex gap-3 print:hidden">
              {isFullyCompatible && Object.keys(build.components).length > 0 && (
                <button
                  onClick={handleSaveClick}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00ff9f] text-black font-bold hover:shadow-[0_0_20px_rgba(0,255,159,0.3)] transition-all active:scale-95"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              )}
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all active:scale-95 border border-white/10"
              >
                <Printer className="h-4 w-4" /> Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0d1220] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Name Your Build</h3>
              <div className="mb-6">
                <label className="block text-xs text-[#b4bcd0] mb-2 uppercase tracking-wider font-semibold">Build Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff9500]/50 focus:bg-white/10 transition-colors"
                    placeholder="e.g. My Gaming Beast"
                    autoFocus
                  />
                  <button
                    onClick={handleRandomizeName}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#ff9500] hover:bg-[#ff9500]/10 transition-colors"
                    title="Generate Random Name"
                  >
                    <Dice5 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 text-[#b4bcd0] font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSave}
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-lg bg-[#00ff9f] text-black font-bold hover:bg-[#00ff9f]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving…' : 'Save Build'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Component Selection Modal */}
      {modalCategory && (
        <ComponentSelectionModal
          isOpen={!!modalCategory}
          onClose={() => setModalCategory(null)}
          category={modalCategory}
          onSelect={addComponent}
          currentBuild={build}
          selectedComponentId={build.components[modalCategory]?.id}
        />
      )}
    </div>
  );
}
