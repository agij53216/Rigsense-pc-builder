'use client';

import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface UpgradeSuggestionsProps {
    suggestion: string;
}

export default function UpgradeSuggestions({ suggestion }: UpgradeSuggestionsProps) {
    if (!suggestion || suggestion.includes('Complete your build')) return null;

    const isPositive = !suggestion.includes('bottleneck');

    return (
        <div className={`p-4 rounded-xl border ${isPositive ? 'bg-[#ff9500]/10 border-[#ff9500]/30' : 'bg-[#ff9500]/10 border-[#ff9500]/30'}`}>
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                {isPositive ? (
                    <Sparkles className="h-4 w-4 text-[#ff9500]" />
                ) : (
                    <AlertCircle className="h-4 w-4 text-[#ff9500]" />
                )}
                <span className={isPositive ? 'text-[#ff9500]' : 'text-[#ff9500]'}>
                    {isPositive ? 'Upgrade Suggestion' : 'Bottleneck Detected'}
                </span>
            </div>
            <p className="text-sm text-[#b4bcd0] leading-relaxed">
                {suggestion}
            </p>
        </div>
    );
}

