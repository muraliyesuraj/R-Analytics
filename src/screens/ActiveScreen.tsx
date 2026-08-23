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
  onLogSpinWithPayout: (tableId: string, winningNumber: number, bets: Record<string, number>) => void;
  onAddTable: (name: string, wheelType: WheelType, bankroll: number) => void;
  onCompleteSession: () => void;
  onGoToHistory: () => void;
}

function ActiveScreen({
  tables,
  currentTableId,
  onSelectTable,
  onLogSpinWithPayout,
  onAddTable,
  onCompleteSession,
  onGoToHistory,
}: ActiveScreenProps) {
  const [showAddTable, setShowAddTable] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [chipAmount, setChipAmount] = useState<number>(5);
  const [activeBets, setActiveBets] = useState<Record<string, number>>({});
  const [winningNumber, setWinningNumber] = useState<number | null>(null);

  const currentTable = tables.find((t) => t.id === currentTableId);
  if (!currentTable) return null;

  const metrics = calculateMetrics(currentTable.spins);

  const handleSubmitSpin = () => {
    if (winningNumber === null) return;

    onLogSpinWithPayout(currentTableId, winningNumber, activeBets);

    setWinningNumber(null);
    setActiveBets({});
  };

  return (
    <div className="space-y-3 pb-6 select-none">
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[11px] font-black text-[#38bdf8]">{currentTable.name}</p>
            <p className="text-[8px] text-[#64748b] mt-1">
              BANKROLL:{' '}
              <span className="text-[#10b981] font-bold">
                ${currentTable.currentBankroll.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onGoToHistory} className="p-2 hover:bg-[#1e293b] rounded">
              <BarChart3 className="w-4 h-4 text-[#94a3b8]" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('End session?')) onCompleteSession();
              }}
              className="p-2 hover:bg-[#1e293b] rounded"
            >
              <LogOut className="w-4 h-4 text-[#94a3b8]" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tables.map((t) => {
            const profit = t.currentBankroll - t.initialBankroll;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTable(t.id)}
                className={`px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap ${
                  t.id === currentTableId
                    ? 'bg-[#38bdf8] text-[#0b0f17]'
                    : 'bg-[#1e293b] text-[#94a3b8]'
                }`}
              >
                {t.name} {profit >= 0 ? '+' : ''}{profit.toFixed(0)}
              </button>
            );
          })}
          <button
            onClick={() => setShowAddTable(true)}
            className="px-2 py-1 rounded text-[9px] font-bold bg-[#1e293b] text-[#38bdf8]"
          >
            + Add
          </button>
        </div>
      </div>

      {showAddTable && (
        <AddTableModal
          onAdd={(name, wheelType, bankroll) => {
            onAddTable(name, wheelType, bankroll);
            setShowAddTable(false);
          }}
          onClose={() => setShowAddTable(false)}
        />
      )}

      {/* Chip Dock */}
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
              className={`w-9 h-9 rounded-full font-bold text-[10px] flex items-center justify-center ${
                chipAmount === amount ? 'ring-2 ring-[#f59e0b] scale-110' : 'opacity-70'
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
              }}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-2">
        <WheelGrid
          selectedNumbers={[]}
          onSelectNumber={(num) => setWinningNumber(num)}
          recentSpins={currentTable.spins.slice(-10)}
          activeChipValue={chipAmount}
          onBetsChange={(updatedBets) => setActiveBets(updatedBets)}
        />
      </div>

      {/* Submit outcome */}
      <div className="bg-[#020617] border-2 border-[#10b981] rounded-lg p-3 mx-1 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="36"
            placeholder="Winning # (0-36)"
            value={winningNumber !== null ? winningNumber : ''}
            onChange={(e) =>
              setWinningNumber(e.target.value !== '' ? parseInt(e.target.value, 10) : null)
            }
            className="flex-1 bg-[#0f172a] border border-[#334155] rounded px-3 py-2 text-white font-bold text-xs"
          />

          <button
            onClick={handleSubmitSpin}
            disabled={winningNumber === null}
            className="bg-[#10b981] text-[#020617] px-4 py-2 rounded font-black text-xs hover:bg-[#059669] disabled:opacity-40 cursor-pointer"
          >
            LOG OUTCOME
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="w-full mx-auto px-3 py-2 bg-[#1e293b] text-[#38bdf8] font-bold rounded text-[9px] mb-3 cursor-pointer"
        >
          {showAnalytics ? '▼' : '▶'} ANALYTICS
        </button>
        {showAnalytics && <Analytics metrics={metrics} totalSpins={currentTable.spins.length} />}
      </div>
    </div>
  );
}

export default ActiveScreen;