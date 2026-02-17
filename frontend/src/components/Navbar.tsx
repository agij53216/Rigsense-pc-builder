'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Menu, X, Zap, LayoutGrid, GitCompare, BookOpen, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Zap },
  { href: '/build', label: 'Build', icon: Wrench },
  { href: '/presets', label: 'Presets', icon: LayoutGrid },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/learn', label: 'Learn', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff9500] to-[#a855f7]">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wider" style={{ fontFamily: 'Press Start 2P, sans-serif' }}>
                <span className="text-[#ff9500]">Rig</span>
                <span className="text-white">Sense</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive ? 'text-[#ff9500]' : 'text-[#b4bcd0] hover:text-white'
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-lg bg-white/5 border border-[#ff9500]/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/wizard"
                className="relative px-5 py-2 text-sm font-semibold text-[#050810] bg-gradient-to-r from-[#ff9500] to-[#ff6b00] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(255,149,0,0.4)] hover:scale-105 active:scale-95"
              >
                Start Building
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-[#b4bcd0] hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 pt-16 md:hidden"
          >
            <div className="absolute inset-0 bg-[#050810]/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <div className="relative flex flex-col gap-2 p-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-white/5 text-[#ff9500] border border-[#ff9500]/20'
                        : 'text-[#b4bcd0] hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link
                  href="/wizard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 mt-2 px-5 py-3 text-sm font-semibold text-[#050810] bg-gradient-to-r from-[#ff9500] to-[#ff6b00] rounded-xl"
                >
                  Start Building
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

