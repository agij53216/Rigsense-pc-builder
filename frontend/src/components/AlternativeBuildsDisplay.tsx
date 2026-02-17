'use client';

import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';
import { type AlternativeBuilds } from '@/lib/api';
import { useBuild } from '@/store/buildContext';

interface AlternativeBuildsProps {
    alternatives: AlternativeBuilds;
}

export default function AlternativeBuildsDisplay({ alternatives }: AlternativeBuildsProps) {
    const { loadPreset } = useBuild();

    if (!alternatives.cheaper && !alternatives.performance) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 print:hidden">
            {alternatives.cheaper && (
                <div className="glass rounded-xl p-4 border border-[#00ff9f]/20 hover:border-[#00ff9f]/40 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-[#00ff9f] font-bold text-sm">
                            <TrendingDown className="h-4 w-4" /> Save Money
                        </div>
                        <div className="text-sm font-mono font-bold text-white">-${alternatives.cheaper.savings}</div>
                    </div>
                    <p className="text-xs text-[#b4bcd0] mb-3 leading-relaxed">
                        {alternatives.cheaper.difference}
                    </p>
                    <button
                        onClick={() => loadPreset(alternatives.cheaper!.build as any)}
                        className="w-full py-2 rounded-lg bg-[#00ff9f]/10 text-[#00ff9f] text-xs font-bold hover:bg-[#00ff9f]/20 transition-colors flex items-center justify-center gap-1"
                    >
                        Switch to Build <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            )}

            {alternatives.performance && (
                <div className="glass rounded-xl p-4 border border-[#ff006e]/20 hover:border-[#ff006e]/40 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-[#ff006e] font-bold text-sm">
                            <TrendingUp className="h-4 w-4" /> Boost Performance
                        </div>
                        <div className="text-sm font-mono font-bold text-white">+${alternatives.performance.cost}</div>
                    </div>
                    <p className="text-xs text-[#b4bcd0] mb-3 leading-relaxed">
                        {alternatives.performance.difference}
                    </p>
                    <button
                        onClick={() => loadPreset(alternatives.performance!.build as any)}
                        className="w-full py-2 rounded-lg bg-[#ff006e]/10 text-[#ff006e] text-xs font-bold hover:bg-[#ff006e]/20 transition-colors flex items-center justify-center gap-1"
                    >
                        Switch to Build <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            )}
        </div>
    );
}

