import React from 'react';
import { getPercentage } from '../utils/wheelUtils';

interface AnalyticsProps {
  metrics: {
    redCount: number;
    blackCount: number;
    greenCount: number;
    oddCount: number;
    evenCount: number;
    lowCount: number;
    highCount: number;
  };
  totalSpins: number;
}

function Analytics({ metrics, totalSpins }: AnalyticsProps) {
  if (!metrics || totalSpins === 0) {
    return (
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-1 text-center text-[10px] text-[#64748b]">
        No spins logged yet. Log an outcome to view live analytics.
      </div>
    );
  }

  const renderBar = (count: number, label: string, barColor: string) => {
    const percentageVal = totalSpins > 0 ? (count / totalSpins) * 100 : 0;
    const percentageText = getPercentage(count, totalSpins);

    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[9px]">
          <span className="text-[#cbd5e1] font-bold">
            {label} ({count})
          </span>
          <span className="text-[#94a3b8] font-black">{percentageText}</span>
        </div>
        <div className="w-full bg-[#0f172a] rounded h-2.5 overflow-hidden border border-[#334155]/40">
          <div
            className="h-full transition-all duration-300 rounded"
            style={{
              width: `${Math.min(percentageVal, 100)}%`,
              backgroundColor: barColor,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-1 space-y-4">
      {/* COLOR DISTRIBUTION */}
      <div>
        <p className="text-[9px] font-black text-[#38bdf8] mb-2 tracking-wider">
          COLOR DISTRIBUTION ({totalSpins} SPINS)
        </p>
        <div className="space-y-2">
          {renderBar(metrics.redCount || 0, 'Red', '#dc2626')}
          {renderBar(metrics.blackCount || 0, 'Black', '#3b82f6')}
          {renderBar(metrics.greenCount || 0, 'Green', '#10b981')}
        </div>
      </div>

      {/* RANGE DISTRIBUTION */}
      <div>
        <p className="text-[9px] font-black text-[#38bdf8] mb-2 tracking-wider">
          RANGE DISTRIBUTION
        </p>
        <div className="space-y-2">
          {renderBar(metrics.lowCount || 0, 'Low 1-18', '#f59e0b')}
          {renderBar(metrics.highCount || 0, 'High 19-36', '#8b5cf6')}
        </div>
      </div>

      {/* PARITY DISTRIBUTION */}
      <div>
        <p className="text-[9px] font-black text-[#38bdf8] mb-2 tracking-wider">
          ODD / EVEN DISTRIBUTION
        </p>
        <div className="space-y-2">
          {renderBar(metrics.evenCount || 0, 'Even', '#06b6d4')}
          {renderBar(metrics.oddCount || 0, 'Odd', '#ec4899')}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
