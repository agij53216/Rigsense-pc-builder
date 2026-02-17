'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Zap, Shield, BarChart3, ArrowRight, ChevronRight, Sparkles, Monitor, DollarSign, CheckCircle2 } from 'lucide-react';
import { presetBuilds } from '@/data/mockComponents';
import { formatINR } from '@/store/buildContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

import { TIER_COLORS } from '@/lib/constants';

const features = [
  { icon: Shield, title: 'Compatibility Engine', desc: 'Real-time socket, RAM, and wattage checks prevent costly mistakes.', color: '#ff9500' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'AI-scored benchmarks for gaming, productivity, and rendering.', color: '#a855f7' },
  { icon: DollarSign, title: 'Budget Optimizer', desc: 'Maximize performance within your budget with smart suggestions.', color: '#00ff9f' },
  { icon: Sparkles, title: 'Build Wizard', desc: 'Step-by-step guided builder from use case to complete rig.', color: '#ff9500' },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-radial-center pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-[#ff9500] font-medium">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered PC Building Platform
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              <span className="text-white">Build Your</span>
              <br />
              <span className="bg-gradient-to-r from-[#ff9500] via-[#a855f7] to-[#ff006e] bg-clip-text text-transparent">
                Dream Rig
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-2xl text-lg sm:text-xl text-[#b4bcd0] leading-relaxed">
              Real-time compatibility checking, performance analytics, and budget optimization.
              From first-time builders to enthusiasts.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/wizard"
                className="group flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-[#050810] bg-gradient-to-r from-[#ff9500] to-[#ff6b00] rounded-xl transition-all hover:shadow-[0_0_30px_rgba(255,149,0,0.5)] hover:scale-105 active:scale-95"
              >
                Start Building
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/presets"
                className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white glass rounded-xl hover:bg-white/[0.08] transition-colors"
              >
                Browse Presets
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: 'Components', value: '40+' },
              { label: 'Preset Builds', value: '6' },
              { label: 'Compatibility Checks', value: 'Real-time' },
              { label: 'Categories', value: '8' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#ff9500]" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>{stat.value}</div>
                <div className="text-sm text-[#6b7280] mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Intelligent Build Tools
            </h2>
            <p className="mt-4 text-[#b4bcd0] max-w-xl mx-auto">
              Everything you need to configure the perfect PC, backed by data-driven insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 border border-transparent hover:border-white/10"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                  style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon className="h-6 w-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[#b4bcd0] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preset Showcase */}
      <section className="py-24 relative">
        <div className="absolute inset-0 gradient-radial-center pointer-events-none opacity-50" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Curated Preset Builds
            </h2>
            <p className="mt-4 text-[#b4bcd0] max-w-xl mx-auto">
              Curated builds for every use case and budget. Customize any preset to make it yours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presetBuilds.slice(0, 3).map((preset, i) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/presets" className="block group">
                  <div className="glass rounded-2xl p-6 h-full hover:bg-white/[0.06] transition-all duration-300 border border-transparent hover:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: TIER_COLORS[preset.tier],
                          backgroundColor: `${TIER_COLORS[preset.tier]}15`,
                          border: `1px solid ${TIER_COLORS[preset.tier]}30`,
                        }}
                      >
                        {preset.tier}
                      </span>
                      <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                        {formatINR(preset.price)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{preset.name}</h3>
                    <p className="text-sm text-[#b4bcd0] mb-4">{preset.tagline}</p>

                    {preset.fps && preset.fps.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {preset.fps.slice(0, 2).map((f) => (
                          <div key={f.game} className="flex items-center justify-between text-sm">
                            <span className="text-[#6b7280]">{f.game} ({f.resolution})</span>
                            <span className="font-mono font-semibold text-[#ff9500]">{f.fps} FPS</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm font-medium text-[#ff9500] group-hover:gap-3 transition-all">
                      View Build <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/presets"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white glass rounded-xl hover:bg-white/[0.08] transition-colors"
            >
              View All Presets <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Your Path', desc: 'Start from scratch, pick a preset, or use the guided wizard.', icon: Monitor },
              { step: '02', title: 'Select Components', desc: 'Browse parts with real-time compatibility and performance scoring.', icon: Cpu },
              { step: '03', title: 'Review & Build', desc: 'Get a full summary with wattage, bottleneck, and budget analysis.', icon: CheckCircle2 },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl glass mb-6">
                  <item.icon className="h-7 w-7 text-[#ff9500]" />
                </div>
                <div className="text-xs font-bold text-[#a855f7] tracking-widest uppercase mb-2" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#b4bcd0] leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 sm:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff9500]/10 via-transparent to-[#a855f7]/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                Ready to Build?
              </h2>
              <p className="text-[#b4bcd0] mb-8 max-w-lg mx-auto">
                Start configuring your dream PC with intelligent tools that ensure every component works together perfectly.
              </p>
              <Link
                href="/wizard"
                className="group inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-r from-[#ff9500] to-[#ff6b00] rounded-xl transition-all hover:shadow-[0_0_40px_rgba(255,149,0,0.5)] hover:scale-105 active:scale-95"
              >
                Launch Build Wizard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[#ff9500]" />
            <span className="text-sm font-bold tracking-wider" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              <span className="text-[#ff9500]">Rig</span><span className="text-white">Sense</span>
            </span>
          </div>
          <p className="text-xs text-[#6b7280]">AI-Powered PC Building Platform. Component data is for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
}


