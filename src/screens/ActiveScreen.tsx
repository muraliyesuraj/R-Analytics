import React, { useState } from 'react';
import { Table, WheelType } from '../types/index';
import { BarChart3, LogOut } from 'lucide-react';
import WheelGrid from '../components/WheelGrid';
import Analytics from '../components/Analytics';
import AddTableModal from '../components/AddTableModal';
import { calculateMetrics } from '../utils/wheelUtils';

interface ActiveScreenProps {
  tables: Table[];
  currentTableId: string;
  onSelectTable: (id: string) => void;
  onAddSpin: (tableId: string, number: number) => void;
  onUpdateBankroll: (tableId: string, amount: number) => void;
  onAddTable: (name: string, wheelType: WheelType, bankroll: number) => void;
  onCompleteSession: () => void;
  onGoToHistory: () => void;
}

function ActiveScreen({
  tables,
  currentTableId,
  onSelectTable,
  onAddSpin,
  onUpdateBankroll,
  onAddTable,
  onCompleteSession,
  onGoToHistory,
}: ActiveScreenProps) {
  const [showAddTable, setShowAddTable] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [selectedNumbersForChip, setSelectedNumbersForChip] = useState<number[]>([]);
  const [chipAmount, setChipAmount] = useState<number>(5);

  const currentTable = tables.find((t) => t.id === currentTableId);
  if (!currentTable) return null;

  const metrics = calculateMetrics(currentTable.spins);
  const totalCombinedProfit = tables.reduce(
    (sum, t) => sum + (t.currentBankroll - t.initialBankroll),
    0
  );
  const totalSpins = tables.reduce((sum, t) => sum + t.spins.length, 0);

  const handleSelectNumber = (number: number) => {
    if (selectedNumbersForChip.includes(number)) {
      setSelectedNumbersForChip(selectedNumbersForChip.filter((n) => n !== number));
    } else {
      setSelectedNumbersForChip([...selectedNumbersForChip, number]);
    }
  };

  const handleSubmitSpin = () => {
    if (selectedNumbersForChip.length === 0) {
      alert('Select a number first');
      return;
    }
    const spinNumber = selectedNumbersForChip[0];
    onAddSpin(currentTableId, spinNumber);
    // Update bankroll based on chip bets (simplified - just track the spin)
    setSelectedNumbersForChip([]);
  };

  return (
    <div className="space-y-3 pb-6 select-none">
      {/* Header */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[11px] font-black text-[#38bdf8] tracking-wider">
              {currentTable.name}
            </p>
            <p className="text-[8px] text-[#64748b] mt-1">
              BANKROLL:{' '}
              <span className="text-[#10b981] font-bold">
                ${currentTable.currentBankroll.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onGoToHistory}
              className="p-2 hover:bg-[#1e293b] rounded transition-colors"
              title="View History"
            >
              <BarChart3 className="w-4 h-4 text-[#94a3b8]" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('End session?')) {
                  onCompleteSession();
                }
              }}
              className="p-2 hover:bg-[#1e293b] rounded transition-colors"
              title="End Session"
            >
              <LogOut className="w-4 h-4 text-[#94a3b8]" />
            </button>
          </div>
        </div>

        {/* Table Switcher */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tables.map((t) => {
            const profit = t.currentBankroll - t.initialBankroll;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTable(t.id)}
                className={`px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap transition-colors ${
                  t.id === currentTableId
                    ? 'bg-[#38bdf8] text-[#0b0f17]'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
                }`}
              >
                {t.name} {profit >= 0 ? '+' : ''}{profit.toFixed(0)}
              </button>
            );
          })}
          <button
            onClick={() => setShowAddTable(true)}
            className="px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap bg-[#1e293b] text-[#38bdf8] hover:bg-[#334155] flex items-center gap-1"
          >
            + Add
          </button>
        </div>

        {/* Combined Stats */}
        <div className="text-[8px] text-[#94a3b8] mt-2 pt-2 border-t border-[#1e293b]">
          <span>Combined: </span>
          <span className={totalCombinedProfit >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>
            {totalCombinedProfit >= 0 ? '+' : ''}${totalCombinedProfit.toFixed(2)}
          </span>
          <span className="mx-2">•</span>
          <span className="text-[#38bdf8]">{totalSpins} Spins</span>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddTable && (
        <AddTableModal
          onAdd={(name, wheelType, bankroll) => {
            onAddTable(name, wheelType, bankroll);
            setShowAddTable(false);
          }}
          onClose={() => setShowAddTable(false)}
        />
      )}

      {/* Active Chip Selector Dock */}
      <div className="bg-[#020617] border border-[#38bdf8] rounded-lg p-3 mx-1">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[8px] font-black text-[#38bdf8]">ACTIVE CHIP</span>
          <span className="text-[8px] font-bold text-[#f59e0b]">SELECTED: ${chipAmount}</span>
        </div>
        <div className="flex justify-around items-center gap-1">
          {[1, 2, 5, 10, 25].map((amount) => (
            <button
              key={amount}
              onClick={() => setChipAmount(amount)}
              className={`w-9 h-9 rounded-full font-bold text-[10px] flex items-center justify-center transition-all cursor-pointer ${
                chipAmount === amount
                  ? 'ring-2 ring-[#f59e0b] scale-110 shadow-lg'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor:
                  amount === 1
                    ? '#1e293b'
                    : amount === 2
                      ? '#0284c7'
                      : amount === 5
                        ? '#dc2626'
                        : amount === 10
                          ? '#059669'
                          : '#0f172a',
                color: 'white',
                border: chipAmount === amount ? '2px solid #f59e0b' : '1px solid #475569',
              }}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Main Wheel Grid Board */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-2">
        <p className="text-[8px] font-black text-[#94a3b8] mb-2 tracking-wide px-1">
          LOG SPIN RESULT
        </p>
        <WheelGrid
          selectedNumbers={selectedNumbersForChip}
          onSelectNumber={handleSelectNumber}
          recentSpins={currentTable.spins.slice(-10)}
          activeChipValue={chipAmount}
        />
      </div>

      {/* Submit Spin Button */}
      <div className="px-1">
        <button
          onClick={handleSubmitSpin}
          className="w-full bg-[#10b981] text-[#020617] py-2.5 rounded-lg text-[10px] font-black hover:bg-[#059669] transition-colors glow-green disabled:opacity-50 cursor-pointer"
          disabled={selectedNumbersForChip.length === 0}
        >
          SUBMIT SPIN RESULT
        </button>
      </div>

      {/* Analytics Accordion */}
      <div>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="w-full mx-auto px-3 py-2 bg-[#1e293b] text-[#38bdf8] font-bold rounded text-[9px] hover:bg-[#334155] transition-colors mb-3 cursor-pointer"
        >
          {showAnalytics ? '▼' : '▶'} ANALYTICS
        </button>
        {showAnalytics && <Analytics metrics={metrics} totalSpins={currentTable.spins.length} />}
      </div>

      {/* Recent Spins Horizontal History */}
      {currentTable.spins.length > 0 && (
        <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 mx-1">
          <p className="text-[8px] font-black text-[#94a3b8] mb-2 tracking-wide">
            RECENT SPINS
          </p>
          <div className="flex gap-2 flex-wrap">
            {currentTable.spins.slice().reverse().slice(0, 20).map((spin, idx) => {
              const bgColor =
                spin.number === 0
                  ? 'bg-[#059669]'
                  : spin.number % 2 === 0
                    ? 'bg-[#1e293b]'
                    : 'bg-[#dc2626]';
              return (
                <div
                  key={idx}
                  className={`${bgColor} w-6 h-6 rounded text-white text-[9px] font-bold flex items-center justify-center border border-[#334155]`}
                >
                  {spin.number}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveScreen;