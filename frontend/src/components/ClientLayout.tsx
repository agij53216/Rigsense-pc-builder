'use client';

import { BuildProvider } from '@/store/buildContext';
import Navbar from '@/components/Navbar';
import { type ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <BuildProvider>
      <div className="min-h-screen bg-[#0a0e17] grid-bg">
        <div className="gradient-radial-top fixed inset-0 pointer-events-none" />
        <Navbar />
        <main className="pt-16 relative z-10">
          {children}
        </main>
      </div>
    </BuildProvider>
  );
}

