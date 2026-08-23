import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { WheelType } from '../types/index';

interface LaunchScreenProps {
  onStart: (tables: Array<{ name: string; wheelType: WheelType; bankroll: number }>) => void;
}

function LaunchScreen({ onStart }: LaunchScreenProps) {
  const [wheelType, setWheelType] = useState<WheelType>('european');
  const [sessionName, setSessionName] = useState('Bellagio Table #4');
  const [bankroll, setBankroll] = useState('200.00');

  const handleStart = () => {
    const amount = parseFloat(bankroll) || 200;
    onStart([
      {
        name: sessionName,
        wheelType,
        bankroll: amount,
      },
    ]);
  };

  return (
    <div className="rounded-xl border border-[#334155] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="text-center bg-[#020617] border-b border-[#1e293b] px-4 py-6">
        <div className="flex items-center justify-center mb-3">
          <div className="w-10 h-10 rounded-full bg-[#020617] border-2 border-[#38bdf8] flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#38bdf8]" />
          </div>
        </div>
        <h1 className="text-base font-black text-[#f8fafc] tracking-wider">
          PRIVATE ROULETTE CONSOLE
        </h1>
        <p className="text-[10px] font-semibold text-[#64748b] mt-1">
          OFFLINE MATHEMATICAL SESSION LOGBOOK
        </p>
      </div>

      {/* Compliance Shield */}
      <div className="bg-[#0f172a] border-l-4 border-[#f59e0b] mx-4 my-4 p-3 rounded">
        <div className="text-[9px] font-black text-[#f59e0b] mb-1">
          MANDATORY DISCLAIMER
        </div>
        <div className="text-[9px] text-[#94a3b8] leading-tight">
          This application is a mathematical tracking utility and private session logbook. It does not accept wagers, process real-money payouts, or predict independent wheel physics.
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-[#020617] border border-[#1e293b] mx-4 mb-4 rounded-lg p-4 space-y-4">
        {/* Wheel Type Selector */}
        <div>
          <label className="block text-[9px] font-black text-[#94a3b8] mb-3 tracking-wide">
            SELECT WHEEL GEOMETRY
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setWheelType('european')}
              className={`py-2 px-3 rounded-lg text-center transition-colors ${
                wheelType === 'european'
                  ? 'bg-[#064e3b] border-2 border-[#10b981]'
                  : 'bg-[#0f172a] border border-[#334155]'
              }`}
            >
              <div className="text-[11px] font-black text-[#10b981]">
                EUROPEAN
              </div>
              <div className="text-[8px] text-[#34d399]">
                Single 0 (2.7% Edge)
              </div>
            </button>
            <button
              onClick={() => setWheelType('american')}
              className={`py-2 px-3 rounded-lg text-center transition-colors ${
                wheelType === 'american'
                  ? 'bg-[#064e3b] border-2 border-[#10b981]'
                  : 'bg-[#0f172a] border border-[#334155] opacity-60'
              }`}
            >
              <div className="text-[11px] font-black text-[#f8fafc]">
                AMERICAN
              </div>
              <div className="text-[8px] text-[#94a3b8]">
                Double 00 (5.26% Edge)
              </div>
            </button>
          </div>
        </div>

        {/* Session Name */}
        <div>
          <label className="block text-[9px] font-black text-[#94a3b8] mb-2 tracking-wide">
            SESSION NAME / LOCATION
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] rounded px-3 py-2 text-[11px] font-semibold text-[#f8fafc] focus:outline-none focus:border-[#38bdf8] transition-colors"
          />
        </div>

        {/* Bankroll */}
        <div>
          <label className="block text-[9px] font-black text-[#94a3b8] mb-2 tracking-wide">
            STARTING BANKROLL ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-[#10b981] font-black text-xs">
              $
            </span>
            <input
              type="text"
              value={bankroll}
              onChange={(e) => setBankroll(e.target.value.replace(/[^0-9.]/g, ''))}
              className="w-full bg-[#0f172a] border border-[#334155] rounded px-3 py-2 pl-6 text-[12px] font-black text-[#10b981] focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full mx-4 mb-4 bg-[#10b981] text-[#020617] py-3 rounded-lg font-black text-[11px] tracking-wide hover:bg-[#059669] transition-colors glow-green"
      >
        START LOGBOOK SESSION
      </button>

      {/* Footer Links */}
      <div className="flex justify-between text-[8px] text-[#64748b] px-4 pb-4">
        <button className="hover:text-[#f8fafc] transition-colors">
          LOAD PREVIOUS SESSION
        </button>
        <button className="hover:text-[#f8fafc] transition-colors">
          IMPORT JSON DATA
        </button>
      </div>
    </div>
  );
}

export default LaunchScreen;
