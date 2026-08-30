import React, { useState } from 'react';
import { Table, WheelType } from '../types/index';
import { BarChart3, LogOut, CheckSquare, Coffee, Heart } from 'lucide-react';
import WheelGrid from '../components/WheelGrid';
import Analytics from '../components/Analytics';
import AddTableModal from '../components/AddTableModal';
import { ConcludeTableModal } from '../components/ConcludeTableModal';
import { StrategyTips } from '../components/StrategyTips';
import { calculateMetrics, getNumberColor } from '../utils/wheelUtils';

interface ActiveScreenProps {
  tables: Table[];
  currentTableId: string;
  onSelectTable: (id: string) => void;
  onLogSpinWithPayout: (tableId: string, winningNumber: number, bets: Record<string, number>) => void;
  onAddTable: (name: string, wheelType: WheelType, bankroll: number) => void;
  onConcludeTable: (tableId: string) => void;
  onCompleteSession: () => void;
  onGoToHistory: () => void;
  buyMeACoffeeUrl?: string;
  paypalUrl?: string;
}

function ActiveScreen({
  tables,
  currentTableId,
  onSelectTable,
  onLogSpinWithPayout,
  onAddTable,
  onConcludeTable,
  onCompleteSession,
  onGoToHistory,
  buyMeACoffeeUrl = 'https://www.buymeacoffee.com/yourusername',
  paypalUrl = 'https://www.paypal.me/yourusername',
}: ActiveScreenProps) {
  const [showAddTable, setShowAddTable] = useState(false);
  const [showConcludeModal, setShowConcludeModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [chipAmount, setChipAmount] = useState<number>(5);

  // Key active bets by table ID so each table retains its own distinct bets
  const [activeBetsByTable, setActiveBetsByTable] = useState<Record<string, Record<string, number>>>({});
  const [winningNumber, setWinningNumber] = useState<number | null>(null);

  const currentTable = tables.find((t) => t.id === currentTableId);
  if (!currentTable) return null;

  // Retrieve current table's active bets
  const activeBets = activeBetsByTable[currentTableId] || {};
  const metrics = calculateMetrics(currentTable.spins);

  const handleBetsChange = (updatedBets: Record<string, number>) => {
    setActiveBetsByTable((prev) => ({
      ...prev,
      [currentTableId]: updatedBets,
    }));
  };

  const handleSubmitSpin = () => {
    if (winningNumber === null) return;

    onLogSpinWithPayout(currentTableId, winningNumber, activeBets);

    // Clear active bets only for the current table after outcome submission
    setActiveBetsByTable((prev) => ({
      ...prev,
      [currentTableId]: {},
    }));
    setWinningNumber(null);
  };

  return (
    <div className="space-y-3 pb-6 select-none">
      {/* Top Header Card */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <p className="text-[11px] font-black text-[#38bdf8]">{currentTable.name}</p>
            <p className="text-[8px] text-[#64748b] mt-1">
              BANKROLL:{' '}
              <span className="text-[#10b981] font-bold">
                ${currentTable.currentBankroll.toFixed(2)}
              </span>
            </p>
          </div>

          {/* Action & Tip Buttons */}
          <div className="flex gap-1.5 items-center flex-wrap justify-end">
            <a
              href={buyMeACoffeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 rounded text-[9px] font-bold hover:bg-[#f59e0b]/20 flex items-center gap-1 transition-colors"
              title="Buy Me a Coffee"
            >
              <Coffee className="w-3 h-3 text-[#f59e0b]" /> Coffee
            </a>

            <a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 rounded text-[9px] font-bold hover:bg-[#38bdf8]/20 flex items-center gap-1 transition-colors"
              title="Tip via PayPal"
            >
              <Heart className="w-3 h-3 text-[#38bdf8]" /> Tip
            </a>

            <button
              onClick={() => setShowConcludeModal(true)}
              className="px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 rounded text-[9px] font-bold hover:bg-[#ef4444]/20 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CheckSquare className="w-3 h-3" /> Conclude
            </button>

            <button onClick={onGoToHistory} className="p-1.5 hover:bg-[#1e293b] rounded cursor-pointer">
              <BarChart3 className="w-4 h-4 text-[#94a3b8]" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('End session?')) onCompleteSession();
              }}
              className="p-1.5 hover:bg-[#1e293b] rounded cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#94a3b8]" />
            </button>
          </div>
        </div>

        {/* Separated Active Tables Selector */}
        <div className="mt-2 pt-2 border-t border-[#1e293b]">
          <p className="text-[8px] font-bold text-[#64748b] mb-1.5 tracking-wider uppercase">Active Tables</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tables.map((t) => {
              const profit = t.currentBankroll - t.initialBankroll;
              const isActive = t.id === currentTableId;

              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTable(t.id)}
                  className={`px-2.5 py-1.5 rounded-md text-[9px] font-bold whitespace-nowrap cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-[#38bdf8] text-[#020617] border-[#0284c7] shadow-[0_0_10px_rgba(56,189,248,0.3)] font-black'
                      : 'bg-[#0f172a] text-[#94a3b8] border-[#334155] hover:bg-[#1e293b] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#020617]" />}
                    {t.name}
                    <span
                      className={`text-[8px] px-1 rounded ${
                        profit >= 0
                          ? isActive ? 'bg-[#020617]/20 text-[#020617]' : 'text-[#10b981] bg-[#10b981]/10'
                          : isActive ? 'bg-[#020617]/20 text-[#020617]' : 'text-[#ef4444] bg-[#ef4444]/10'
                      }`}
                    >
                      {profit >= 0 ? '+' : ''}{profit.toFixed(0)}
                    </span>
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setShowAddTable(true)}
              className="px-2.5 py-1.5 rounded-md text-[9px] font-bold bg-[#0f172a] text-[#38bdf8] border border-dashed border-[#38bdf8]/50 hover:bg-[#38bdf8]/10 cursor-pointer"
            >
              + Add Table
            </button>
          </div>
        </div>

        {/* Recent Winning Numbers Bar */}
        <div className="mt-3 pt-2 border-t border-[#1e293b]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[8px] font-extrabold text-[#94a3b8] uppercase tracking-wider">
              Recent Outcomes ({currentTable.spins.length})
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto py-1 items-center min-h-[32px]">
            {currentTable.spins.length === 0 ? (
              <span className="text-[8px] text-[#475569] italic">No spins logged yet</span>
            ) : (
              [...currentTable.spins].reverse().map((spin, idx) => {
                const color = getNumberColor(spin.number);
                const isLatest = idx === 0;

                return (
                  <div
                    key={spin.id || idx}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 border transition-all ${
                      isLatest ? 'ring-2 ring-[#f59e0b] scale-105 border-white' : 'border-black/40 opacity-85'
                    }`}
                    style={{ backgroundColor: color, color: 'white' }}
                  >
                    {spin.number}
                  </div>
                );
              })
            )}
          </div>
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

      {showConcludeModal && (
        <ConcludeTableModal
          table={currentTable}
          onConclude={(id) => {
            onConcludeTable(id);
            setShowConcludeModal(false);
          }}
          onClose={() => setShowConcludeModal(false)}
        />
      )}

      {/* Chip Selector Dock */}
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
              className={`w-9 h-9 rounded-full font-bold text-[10px] flex items-center justify-center cursor-pointer transition-all ${
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

      {/* Interactive Grid - Bets Only */}
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-2">
        <p className="text-[8px] font-black text-[#94a3b8] mb-2 px-1 tracking-wide">PLACE BETS</p>
        <WheelGrid
          key={currentTableId}
          selectedNumbers={[]}
          onSelectNumber={() => {}}
          recentSpins={currentTable.spins.slice(-10)}
          activeChipValue={chipAmount}
          currentBankroll={currentTable.currentBankroll}
          bets={activeBets}
          onBetsChange={handleBetsChange}
        />
      </div>

      {/* Log Outcome Bar */}
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
            className="flex-1 bg-[#0f172a] border border-[#334155] rounded px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-[#10b981]"
          />

          <button
            onClick={handleSubmitSpin}
            disabled={winningNumber === null}
            className="bg-[#10b981] text-[#020617] px-4 py-2 rounded font-black text-xs hover:bg-[#059669] disabled:opacity-40 cursor-pointer transition-all"
          >
            LOG OUTCOME
          </button>
        </div>
      </div>

      {/* Strategy Tips Section */}
      <StrategyTips spins={currentTable.spins} />

      {/* Collapsible Analytics Section */}
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