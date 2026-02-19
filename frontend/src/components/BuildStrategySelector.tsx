import { DollarSign, Zap, Shield, Sparkles } from 'lucide-react';
import { useBuild } from '@/store/buildContext';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/utils';

const strategyConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
    value: {
        label: 'Best Value',
        icon: DollarSign,
        color: '#00ff9f',
        bgColor: 'bg-[#00ff9f]/10'
    },
    performance: {
        label: 'Max Performance',
        icon: Zap,
        color: '#ff006e',
        bgColor: 'bg-[#ff006e]/10'
    },
    future_proof: {
        label: 'Future Proof',
        icon: Shield,
        color: '#a855f7',
        bgColor: 'bg-[#a855f7]/10'
    }
};

export default function BuildStrategySelector() {
    const { alternatives, setComponents, build } = useBuild();

    // Convert alternatives object to array for mapping
    const strategies = Object.entries(alternatives)
        .filter(([key, data]) => data && ['value', 'performance', 'future_proof'].includes(key));

    if (strategies.length === 0) return null;

    return (
        <div className="glass rounded-xl p-4 border border-white/10 mb-4">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-[#ff9500]" />
                <h3 className="text-sm font-bold text-white">Select Build Strategy</h3>
            </div>

            <div className="space-y-2">
                {strategies.map(([key, data]) => {
                    const config = strategyConfig[key] || {
                        label: key,
                        icon: Sparkles,
                        color: '#b4bcd0',
                        bgColor: 'bg-white/5'
                    };
                    const Icon = config.icon;

                    if (!data) return null;

                    return (
                        <button
                            key={key}
                            onClick={() => setComponents(data.build)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg border transition-all hover:scale-[1.02]",
                                `border-[${config.color}]/20 hover:border-[${config.color}]/40`,
                                "bg-black/20 hover:bg-black/40"
                            )}
                            style={{ borderColor: `${config.color}30` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("p-1.5 rounded-md", config.bgColor)}>
                                    <Icon className="h-4 w-4" style={{ color: config.color }} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-bold text-white">{config.label}</div>
                                    <div className="text-[10px] text-[#b4bcd0]">{data.score ? `Score: ${data.score}` : 'AI Generated'}</div>
                                </div>
                            </div>
                            <div className="text-xs font-mono font-bold text-white">
                                {formatINR(data.totalPrice || 0)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
