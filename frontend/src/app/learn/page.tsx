'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Target, DollarSign, AlertTriangle, Zap, RefreshCw, Scale,
  Cpu, MonitorSpeaker, CircuitBoard, MemoryStick, HardDrive, Plug, Box, Fan,
  ChevronDown, ChevronUp, ExternalLink, CheckCircle2, XCircle, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { quickTips, budgetAllocations, componentGuides, buildExamples, faqs } from '@/data/learnContent';

const iconMap: Record<string, any> = {
  Cpu, MonitorSpeaker, CircuitBoard, MemoryStick, HardDrive, Plug, Box, Fan
};

export default function LearnPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [budgetTab, setBudgetTab] = useState<'gaming' | 'content' | 'workstation'>('gaming');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#ff9500]" />
              <span className="font-bold text-white" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                PC Building Guide
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              {['Quick Tips', 'Budget Guide', 'Components', 'Build Process', 'Examples', 'FAQ'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="text-[#b4bcd0] hover:text-[#ff9500] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Build Your Perfect PC
            </h1>
            <p className="text-xl text-[#b4bcd0] mb-8 max-w-3xl mx-auto">
              Learn everything you need to avoid costly mistakes and get the best performance for your budget
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('quick-tips')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff9500] to-[#ff6b00] text-[#050810] font-bold hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition-all"
              >
                Start Learning
              </button>
              <button
                onClick={() => scrollToSection('budget-guide')}
                className="px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all"
              >
                Budget Calculator
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section id="quick-tips" className="py-20 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              6 Rules That Will Save You Money & Regret
            </h2>
            <p className="text-[#b4bcd0]">Click any card to learn more</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 cursor-pointer hover:bg-white/[0.06] transition-all"
                onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{tip.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                    <p className="text-sm text-[#b4bcd0]">{tip.shortDesc}</p>
                  </div>
                  {expandedTip === tip.id ? (
                    <ChevronUp className="h-5 w-5 text-[#ff9500]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#6b7280]" />
                  )}
                </div>

                {expandedTip === tip.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 pt-4 border-t border-white/10"
                  >
                    {tip.fullDesc.map((desc, i) => (
                      <p key={i} className="text-sm text-[#b4bcd0] leading-relaxed">
                        {desc}
                      </p>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Allocation Guide */}
      <section id="budget-guide" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              How to Split Your Budget
            </h2>
            <p className="text-[#b4bcd0]">Recommended percentage for each component based on your use case</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {(['gaming', 'content', 'workstation'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setBudgetTab(tab)}
                className={cn(
                  'px-6 py-3 rounded-xl font-semibold transition-all',
                  budgetTab === tab
                    ? 'bg-[#ff9500] text-[#050810]'
                    : 'glass text-[#b4bcd0] hover:text-white'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Budget Bars */}
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="space-y-4">
              {budgetAllocations.map((allocation) => {
                const percentage = allocation[budgetTab];
                return (
                  <div key={allocation.component} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{allocation.component}</span>
                      <span className="text-sm font-mono text-[#ff9500]">{percentage}%</span>
                    </div>
                    <div className="relative h-8 rounded-lg bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded-lg relative"
                        style={{
                          background: `linear-gradient(90deg, ${allocation.color}40, ${allocation.color})`
                        }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity">
                      {allocation.why} • {allocation.examples.mid}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Component Guides */}
      <section id="components" className="py-20 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Component Deep Dives
            </h2>
            <p className="text-[#b4bcd0]">Click any component to learn what matters and what doesn't</p>
          </div>

          <div className="space-y-4">
            {componentGuides.map((guide) => {
              const Icon = iconMap[guide.icon];
              const isExpanded = expandedComponent === guide.id;

              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedComponent(isExpanded ? null : guide.id)}
                    className="w-full flex items-center gap-4 p-6 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${guide.color}20`, border: `1px solid ${guide.color}40` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: guide.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{guide.name}</h3>
                      <p className="text-sm text-[#b4bcd0]">{guide.whatItDoes}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-[#ff9500]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#6b7280]" />
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 space-y-4"
                    >
                      <div className="space-y-2">
                        {guide.keyPoints.map((point, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#00ff9f] mt-0.5 shrink-0" />
                            <p className="text-sm text-[#b4bcd0]">{point}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 rounded-lg bg-[#ff006e]/10 border border-[#ff006e]/20">
                        <p className="text-xs text-[#ff006e] font-medium">
                          ⚠️ Common Mistake: {guide.commonMistake}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Build Examples */}
      <section id="examples" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Example Builds by Budget
            </h2>
            <p className="text-[#b4bcd0]">Complete parts lists for different price points</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buildExamples.map((build, index) => (
              <motion.div
                key={build.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{build.name}</h3>
                  <p className="text-sm text-[#b4bcd0] mb-2">{build.performance}</p>
                  <div className="text-2xl font-bold text-[#ff9500]" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                    ${build.budget}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {build.parts.map((part) => (
                    <div key={part.component} className="flex items-center justify-between text-sm">
                      <span className="text-[#6b7280]">{part.component}:</span>
                      <span className="text-white">{part.name}</span>
                      <span className="text-[#b4bcd0] font-mono">${part.price}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs text-[#6b7280]">
                    Target: <span className="text-[#ff9500]">{build.resolution}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Quick Answers to Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div key={index} className="glass rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-lg font-semibold text-white pr-4">{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-[#ff9500] shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#6b7280] shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-[#b4bcd0] leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
              Ready to Build?
            </h2>
            <p className="text-[#b4bcd0] mb-8">
              You've learned the essentials. Now put it into practice.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a
                href="/build"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff9500] to-[#ff6b00] text-[#050810] font-bold hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] transition-all inline-flex items-center gap-2"
              >
                Start Building <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/presets"
                className="px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all"
              >
                View Build Examples
              </a>
            </div>

            <div className="p-4 rounded-lg bg-[#00ff9f]/10 border border-[#00ff9f]/20">
              <p className="text-sm text-[#00ff9f]">
                💡 Building a PC is like adult LEGO - harder to break than you think. Take your time, follow instructions, and enjoy the process. You've got this! 🚀
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

