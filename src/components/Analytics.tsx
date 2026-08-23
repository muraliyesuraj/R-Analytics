import React from 'react';
import { Metrics } from '../types/index';

interface AnalyticsProps {
  metrics: Metrics;
  totalSpins: number;
}

function Analytics({ metrics, totalSpins }: AnalyticsProps) {
  if (!metrics || totalSpins === 0) {
    return (
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-3 text-center text-[9px] text-[#64748b]">
        No spins logged yet
      </div>
    );
  }

  // Fallback values to guarantee safety against undefined metrics properties
  const redCount = metrics.colors?.red || 0;
  const blackCount = metrics.colors?.black || 0;
  const greenCount = metrics.colors?.green || 0;
  
  const lowCount = metrics.ranges?.low || 0;
  const highCount = metrics.ranges?.high || 0;

  const getPercentBar = (value: number, total: number) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-[#0f172a] rounded h-3 overflow-hidden">
          <div
            className="bg-[#38bdf8] h-full rounded transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-right text-[8px] font-bold text-[#94a3b8] w-12">
          {percentage.toFixed(1)}%
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-3 space-y-4">
      {/* Colors */}
      <div>
        <p className="text-[8px] font-black text-[#94a3b8] mb-2 tracking-wide">
          COLOR DISTRIBUTION
        </p>
        <div className="space-y-2">
          <div>
            <label className="text-[7px] text-[#cbd5e1] font-bold block mb-1">
              Red ({redCount})
            </label>
            {getPercentBar(redCount, totalSpins)}
          </div>
          <div>
            <label className="text-[7px] text-[#cbd5e1] font-bold block mb-1">
              Black ({blackCount})
            </label>
            {getPercentBar(blackCount, totalSpins)}
          </div>
          <div>
            <label className="text-[7px] text-[#cbd5e1] font-bold block mb-1">
              Green ({greenCount})
            </label>
            {getPercentBar(greenCount, totalSpins)}
          </div>
        </div>
      </div>

      {/* Ranges */}
      <div>
        <p className="text-[8px] font-black text-[#94a3b8] mb-2 tracking-wide">
          RANGE DISTRIBUTION
        </p>
        <div className="space-y-2">
          <div>
            <label className="text-[7px] text-[#cbd5e1] font-bold block mb-1">
              Low 1-18 ({lowCount})
            </label>
            {getPercentBar(lowCount, totalSpins)}
          </div>
          <div>
            <label className="text-[7px] text-[#cbd5e1] font-bold block mb-1">
              High 19-36 ({highCount})
            </label>
            {getPercentBar(highCount, totalSpins)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;