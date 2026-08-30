import React from 'react';
import { Spin } from '../types/index';
import { calculateMetrics } from '../utils/wheelUtils';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

interface StrategyTipsProps {
  spins: Spin[];
}

export function StrategyTips({ spins }: StrategyTipsProps) {
  if (spins.length < 5) {
    return (
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-1 flex items-center gap-2 text-[10px] text-[#64748b]">
        <Lightbulb className="w-4 h-4 text-[#f59e0b] shrink-0" />
        <span>Log at least 5 spins to receive real-time strategy tips and trend alerts.</span>
      </div>
    );
  }

  const metrics = calculateMetrics(spins);
  const total = spins.length;
  const recent5 = spins.slice(-5);

  const tips: { type: 'trend' | 'alert' | 'info'; title: string; desc: string }[] = [];

  // Streak detection
  const redStreak = recent5.every((s) => [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(s.number));
  const blackStreak = recent5.every((s) => s.number !== 0 && ![1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(s.number));

  if (redStreak) {
    tips.push({
      type: 'trend',
      title: 'HOT RED STREAK',
      desc: 'Last 5 consecutive spins were Red. Consider riding the trend or waiting for stabilization.',
    });
  } else if (blackStreak) {
    tips.push({
      type: 'trend',
      title: 'HOT BLACK STREAK',
      desc: 'Last 5 consecutive spins were Black.',
    });
  }

  // Imbalance Detection
  const redPct = (metrics.redCount / total) * 100;
  if (redPct > 65) {
    tips.push({
      type: 'alert',
      title: 'COLOR IMBALANCE',
      desc: `Red is dominating at ${redPct.toFixed(0)}% over ${total} spins.`,
    });
  }

  const lowPct = (metrics.lowCount / total) * 100;
  if (lowPct > 65) {
    tips.push({
      type: 'info',
      title: 'LOW RANGE BIAS',
      desc: `Low numbers (1-18) account for ${lowPct.toFixed(0)}% of spins.`,
    });
  }

  if (tips.length === 0) {
    tips.push({
      type: 'info',
      title: 'BALANCED TABLE',
      desc: 'Outcomes are currently displaying standard statistical distribution.',
    });
  }

  return (
    <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-1 space-y-2">
      <div className="flex items-center gap-1.5 border-b border-[#1e293b] pb-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" />
        <span className="text-[9px] font-black text-[#f59e0b] tracking-wider uppercase">Strategy Tips & Insights</span>
      </div>

      <div className="space-y-2">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-[#0f172a] border border-[#334155]/50 rounded p-2 text-[9px] space-y-0.5">
            <div className="flex items-center gap-1 font-bold text-[#38bdf8]">
              {tip.type === 'trend' && <TrendingUp className="w-3 h-3 text-[#10b981]" />}
              {tip.type === 'alert' && <AlertCircle className="w-3 h-3 text-[#ef4444]" />}
              <span>{tip.title}</span>
            </div>
            <p className="text-[#94a3b8]">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}