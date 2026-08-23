import React, { useState } from 'react';
import { Table } from '../types/index';

interface SummaryScreenProps {
  tables: Table[];
  onNewSession: () => void;
}

function SummaryScreen({ tables, onNewSession }: SummaryScreenProps) {
  const [selectedTip, setSelectedTip] = useState<string>('1.99');
  const [customTip, setCustomTip] = useState('');
  const [tipNote, setTipNote] = useState('');
  const [tipped, setTipped] = useState(false);

  const totalProfit = tables.reduce((sum, t) => sum + (t.currentBankroll - t.initialBankroll), 0);
  const totalSpins = tables.reduce((sum, t) => sum + t.spins.length, 0);

  const handleTip = () => {
    const amount = customTip ? parseFloat(customTip) : parseFloat(selectedTip);
    if (isNaN(amount) || amount < 1.99) {
      alert('Minimum tip is $1.99');
      return;
    }
    setTipped(true);
    setTimeout(() => setTipped(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#334155] shadow-2xl overflow-hidden max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-[#020617] border-b border-[#1e293b] px-4 py-3 sticky top-0">
        <p className="text-[11px] font-black text-[#38bdf8] tracking-wider">
          SESSION SUMMARY
        </p>
        <p className="text-[8px] text-[#64748b] mt-1">
          FINAL PERFORMANCE & SUPPORT
        </p>
      </div>

      {/* Result Banner */}
      <div className="bg-gradient-to-r from-[#020617] to-[#0f172a] border-b border-[#1e293b] mx-4 my-4 p-3 rounded-lg border-l-4 border-l-[#10b981] flex justify-between items-center">
        <div>
          <p className="text-[7px] font-black text-[#94a3b8] mb-1">
            TODAY'S NET PROFIT
          </p>
          <p className={`text-base font-black ${totalProfit >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[7px] font-black text-[#94a3b8] mb-1">
            TOTAL SPINS
          </p>
          <p className="text-[10px] font-black text-[#38bdf8]">
            {totalSpins} Spins
          </p>
        </div>
      </div>

      {/* Tables Breakdown */}
      <div className="px-4 pb-4 space-y-2">
        {tables.map((table) => {
          const profit = table.currentBankroll - table.initialBankroll;
          return (
            <div
              key={table.id}
              className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-[8px] font-black text-[#f8fafc]">
                  {table.name}
                </p>
                <p className="text-[7px] text-[#64748b]">
                  Bankroll: ${table.initialBankroll.toFixed(2)}
                </p>
              </div>
              <p className={`text-[9px] font-black ${profit >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Buy Me a Coffee Card */}
      <div className="mx-4 mb-4 bg-[rgba(245,158,11,0.05)] border border-[#f59e0b] rounded-lg p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <div>
            <p className="text-[8.5px] font-black text-[#fbbf24] leading-tight">
              BUY ME A COFFEE
            </p>
            <p className="text-[7px] text-[#cbd5e1]">
              Enjoying the tool? Support future updates!
            </p>
          </div>
        </div>

        {/* Preset Tips */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { amount: '1.99', label: 'Espresso' },
            { amount: '4.99', label: 'Double Shot' },
            { amount: '9.99', label: 'Large Roast' },
          ].map((tip) => (
            <button
              key={tip.amount}
              onClick={() => {
                setSelectedTip(tip.amount);
                setCustomTip('');
              }}
              className={`py-2 px-2 rounded-lg border text-center transition-colors ${
                selectedTip === tip.amount && !customTip
                  ? 'bg-[#f59e0b] border-[#f59e0b] text-[#020617]'
                  : 'bg-[#020617] border-[#334155] text-[#f8fafc]'
              }`}
            >
              <div className="text-[7.5px] font-black">
                ${tip.amount}
              </div>
              <div className="text-[6px] text-[#94a3b8]">
                {tip.label}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Tip */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Custom ($1.99+)"
            value={customTip}
            onChange={(e) => {
              setCustomTip(e.target.value);
              if (e.target.value) setSelectedTip('');
            }}
            className="flex-1 bg-[#020617] border border-[#334155] text-[#f8fafc] px-2 py-2 rounded text-[7.5px] focus:outline-none focus:border-[#f59e0b]"
          />
          <button
            onClick={handleTip}
            className="bg-[#f59e0b] text-[#020617] px-3 py-2 rounded font-black text-[8px] hover:bg-[#fbbf24] transition-colors glow-amber disabled:opacity-50"
          >
            {tipped ? 'SENT!' : 'TIP NOW'}
          </button>
        </div>

        {/* Tip Note */}
        <input
          type="text"
          placeholder="Optional tip note..."
          value={tipNote}
          onChange={(e) => setTipNote(e.target.value)}
          className="w-full bg-[#020617] border border-[#334155] text-[#f8fafc] px-2 py-1 rounded text-[7px] focus:outline-none focus:border-[#f59e0b]"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        <button className="bg-[#1e293b] text-[#cbd5e1] border border-[#334155] py-3 rounded text-[8px] font-black hover:bg-[#334155] transition-colors">
          SAVE & CLOSE
        </button>
        <button
          onClick={onNewSession}
          className="bg-[#10b981] text-[#020617] py-3 rounded text-[8px] font-black hover:bg-[#059669] transition-colors glow-green"
        >
          NEW SESSION
        </button>
      </div>
    </div>
  );
}

export default SummaryScreen;
