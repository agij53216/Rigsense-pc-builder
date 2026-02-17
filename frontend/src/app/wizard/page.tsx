'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Film, Radio, Briefcase, Monitor,
  ArrowRight, ArrowLeft, Zap, DollarSign,
  Target, TrendingUp, ChevronRight,
} from 'lucide-react';
import { useBuild, formatINR } from '@/store/buildContext';

const steps = ['Budget', 'Use Case', 'Performance', 'Review'];

const useCases = [
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, desc: 'High FPS, immersive visuals', color: '#ff9500' },
  { id: 'editing', label: 'Content Creation', icon: Film, desc: 'Video editing, 3D rendering', color: '#a855f7' },
  { id: 'streaming', label: 'Streaming', icon: Radio, desc: 'Game + stream simultaneously', color: '#ff006e' },
  { id: 'workstation', label: 'Workstation', icon: Briefcase, desc: 'Professional productivity', color: '#ff9500' },
  { id: 'general', label: 'General Use', icon: Monitor, desc: 'Everyday tasks and light gaming', color: '#00ff9f' },
];

const budgetPresets = [
  { label: 'Budget', range: '₹40,000 – ₹65,000', value: 50000, color: '#00ff9f' },
  { label: 'Mid-Range', range: '₹65,000 – ₹1,20,000', value: 90000, color: '#ff9500' },
  { label: 'High-End', range: '₹1,20,000 – ₹2,00,000', value: 150000, color: '#a855f7' },
  { label: 'Enthusiast', range: '₹2,00,000+', value: 250000, color: '#ff006e' },
];

export default function WizardPage() {
  const router = useRouter();
  const { setBudget, setUseCase, setPerformancePreference, build, generateAutoBuild } = useBuild();
  const [step, setStep] = useState(0);
  const [localBudget, setLocalBudget] = useState(build.budget);
  const [localUseCase, setLocalUseCase] = useState(build.useCase);
  const [localPerf, setLocalPerf] = useState(build.performancePreference);

  const next = () => {
    if (step === 0) setBudget(localBudget);
    if (step === 1) setUseCase(localUseCase);
    if (step === 2) setPerformancePreference(localPerf);
    if (step < 3) setStep(step + 1);
  };

  const finish = () => {
    setBudget(localBudget);
    setUseCase(localUseCase);
    setPerformancePreference(localPerf);
    generateAutoBuild();
    router.push('/build');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Progress */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${i < step
                  ? 'bg-[#ff9500] text-[#050810]'
                  : i === step
                    ? 'bg-[#ff9500]/20 text-[#ff9500] border border-[#ff9500]/50'
                    : 'glass text-[#6b7280]'
                  }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`hidden sm:inline text-sm font-medium ${i <= step ? 'text-white' : 'text-[#6b7280]'}`}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={`hidden sm:block w-12 h-px mx-2 ${i < step ? 'bg-[#ff9500]' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff9500] to-[#a855f7] rounded-full"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-[#ff9500] font-medium mb-4">
                    <DollarSign className="h-3 w-3" /> Step 1
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                    Set Your Budget
                  </h2>
                  <p className="mt-2 text-[#b4bcd0]">How much are you looking to spend on your build?</p>
                </div>

                {/* Budget Input */}
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="text-5xl font-bold text-[#ff9500] mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                    {formatINR(localBudget)}
                  </div>
                  <input
                    type="range"
                    min={30000}
                    max={400000}
                    step={5000}
                    value={localBudget}
                    onChange={(e) => setLocalBudget(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-[#ff9500]"
                  />
                  <div className="flex justify-between text-xs text-[#6b7280] mt-2">
                    <span>₹30,000</span>
                    <span>₹4,00,000</span>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {budgetPresets.map((bp) => (
                    <button
                      key={bp.label}
                      onClick={() => setLocalBudget(bp.value)}
                      className={`glass rounded-xl p-4 text-center transition-all hover:scale-[1.03] ${Math.abs(localBudget - bp.value) < 100 ? 'border-[#ff9500]/40 bg-white/[0.06]' : ''
                        }`}
                    >
                      <div className="text-sm font-bold text-white">{bp.label}</div>
                      <div className="text-xs mt-1" style={{ color: bp.color }}>{bp.range}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="usecase"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-[#a855f7] font-medium mb-4">
                    <Target className="h-3 w-3" /> Step 2
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                    Primary Use Case
                  </h2>
                  <p className="mt-2 text-[#b4bcd0]">What will you mainly use this PC for?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {useCases.map((uc) => (
                    <button
                      key={uc.id}
                      onClick={() => setLocalUseCase(uc.id)}
                      className={`group glass rounded-2xl p-6 text-left transition-all hover:scale-[1.02] ${localUseCase === uc.id ? 'bg-white/[0.08] border-white/20' : 'hover:bg-white/[0.04]'
                        }`}
                      style={localUseCase === uc.id ? { borderColor: `${uc.color}40` } : {}}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl mb-3"
                        style={{ backgroundColor: `${uc.color}15`, border: `1px solid ${uc.color}30` }}
                      >
                        <uc.icon className="h-6 w-6" style={{ color: uc.color }} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{uc.label}</h3>
                      <p className="text-sm text-[#6b7280] mt-1">{uc.desc}</p>
                      {localUseCase === uc.id && (
                        <motion.div
                          layoutId="uc-check"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium"
                          style={{ color: uc.color }}
                        >
                          Selected <ChevronRight className="h-3 w-3" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-[#ff9500] font-medium mb-4">
                    <TrendingUp className="h-3 w-3" /> Step 3
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                    Performance Priority
                  </h2>
                  <p className="mt-2 text-[#b4bcd0]">Balance cost-efficiency with raw performance.</p>
                </div>

                <div className="glass rounded-2xl p-8">
                  <div className="flex justify-between text-sm font-medium mb-6">
                    <span className="text-[#00ff9f]">Balanced</span>
                    <span className="text-[#ff006e]">Maximum Performance</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={localPerf}
                    onChange={(e) => setLocalPerf(Number(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-[#00ff9f]/30 to-[#ff006e]/30 accent-[#ff9500]"
                  />
                  <div className="mt-6 text-center">
                    <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                      {localPerf}%
                    </div>
                    <div className="text-sm text-[#b4bcd0] mt-1">
                      {localPerf < 30
                        ? 'Cost-efficient: Best value per dollar'
                        : localPerf < 70
                          ? 'Balanced: Good performance at reasonable cost'
                          : 'Performance-focused: Maximum power within budget'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {[
                      { label: 'Value', val: 20, color: '#00ff9f' },
                      { label: 'Balanced', val: 50, color: '#ff9500' },
                      { label: 'Performance', val: 85, color: '#ff006e' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setLocalPerf(p.val)}
                        className={`glass rounded-xl p-3 text-center transition-all hover:scale-[1.03] ${Math.abs(localPerf - p.val) < 15 ? 'bg-white/[0.06]' : ''
                          }`}
                      >
                        <div className="text-sm font-semibold" style={{ color: p.color }}>{p.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-[#ff9500] font-medium mb-4">
                    <Zap className="h-3 w-3" /> Review
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                    Your Build Profile
                  </h2>
                  <p className="mt-2 text-[#b4bcd0]">Here is a summary of your preferences. Ready to build?</p>
                </div>

                <div className="glass rounded-2xl p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="glass rounded-xl p-5 text-center">
                      <DollarSign className="h-6 w-6 text-[#00ff9f] mx-auto mb-2" />
                      <div className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Budget</div>
                      <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                        {formatINR(localBudget)}
                      </div>
                    </div>
                    <div className="glass rounded-xl p-5 text-center">
                      <Target className="h-6 w-6 text-[#a855f7] mx-auto mb-2" />
                      <div className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Use Case</div>
                      <div className="text-2xl font-bold text-white capitalize" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                        {localUseCase}
                      </div>
                    </div>
                    <div className="glass rounded-xl p-5 text-center">
                      <TrendingUp className="h-6 w-6 text-[#ff9500] mx-auto mb-2" />
                      <div className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Performance</div>
                      <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                        {localPerf}%
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-[#b4bcd0]">
                    The configurator will use these preferences to suggest optimal components for your build.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${step > 0 ? 'text-[#b4bcd0] glass hover:bg-white/[0.06]' : 'invisible'
                }`}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <button
              onClick={() => router.push('/build')}
              className="text-sm text-[#6b7280] hover:text-white transition-colors"
            >
              Skip to Manual Build
            </button>

            {step < 3 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[#050810] bg-gradient-to-r from-[#ff9500] to-[#ff6b00] rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] hover:scale-105 active:scale-95"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[#050810] bg-gradient-to-r from-[#00ff9f] to-[#00e676] rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,255,159,0.4)] hover:scale-105 active:scale-95"
              >
                Start Building <Zap className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

