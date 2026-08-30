import React from 'react';
import { Spin } from '../types/index';

interface StrategyTipsProps {
  spins: Spin[];
}

export function StrategyTips({ spins }: StrategyTipsProps) {
  return (
    <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-1 space-y-2">
      <p className="text-[9px] font-black text-[#38bdf8]">💡 STRATEGY TIPS</p>
      <ul className="text-[8px] text-[#cbd5e1] space-y-1">
        <li>• Right-click bets to remove chips</li>
        <li>• Use Undo to revert last action</li>
        <li>• Double bets button multiplies all active bets</li>
      </ul>
    </div>
  );
}
