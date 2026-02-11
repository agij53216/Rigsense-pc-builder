'use client';

import { motion } from 'framer-motion';

interface FPSEstimatorProps {
    score: number;
}

export default function FPSEstimator({ score }: FPSEstimatorProps) {
    // A rough estimation function mapping "Performance Score" (0-100) to FPS
    // We assume 100 score = ~144 FPS in competitive titles at 1440p
    const getFPS = (baseScore: number, complexity: number) => Math.round(baseScore * complexity);

    const games = [
        { name: 'Valorant', fps: getFPS(score, 3.5), color: '#ff4655' },
        { name: 'Fortnite', fps: getFPS(score, 2.2), color: '#a855f7' },
        { name: 'Cyberpunk 2077', fps: getFPS(score, 0.9), color: '#fcee0a', labelColor: '#000' },
        { name: 'Call of Duty', fps: getFPS(score, 1.8), color: '#00ff9f' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Estimated Performance (1080p)</h4>
            </div>

            <div className="space-y-3">
                {games.map((game, i) => (
                    <div key={game.name} className="relative">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#b4bcd0]">{game.name}</span>
                            <span className="font-mono font-bold text-white">{game.fps} FPS</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (game.fps / 300) * 100)}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: game.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-[#6b7280] italic">* Estimates based on component tier. Actual performance may vary.</p>
        </div>
    );
}

