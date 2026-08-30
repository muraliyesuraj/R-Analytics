import React, { useState, useEffect } from 'react';
import { Spin } from '../types/index';
import { getNumberColor } from '../utils/wheelUtils';

interface WheelGridProps {
  selectedNumbers: number[];
  onSelectNumber: (number: number) => void;
  recentSpins: Spin[];
  activeChipValue: number;
  currentBankroll: number;
  bets?: Record<string, number>;
  onBetsChange?: (bets: Record<string, number>) => void;
}

const VERTICAL_ROWS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, 18],
  [19, 20, 21],
  [22, 23, 24],
  [25, 26, 27],
  [28, 29, 30],
  [31, 32, 33],
  [34, 35, 36],
];

const PlacedChip = ({ amount }: { amount: number }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f59e0b] border border-dashed border-white shadow-[0_0_8px_rgba(0,0,0,0.9)] flex items-center justify-center z-40 pointer-events-none">
    <span className="text-[6px] font-black text-[#020617]">${amount}</span>
  </div>
);

function WheelGrid({
  selectedNumbers,
  onSelectNumber,
  recentSpins,
  activeChipValue,
  currentBankroll,
  bets: externalBets = {},
  onBetsChange,
}: WheelGridProps) {
  const [bets, setBets] = useState<Record<string, number>>(externalBets);
  const [history, setHistory] = useState<Array<Record<string, number>>>([]);

  useEffect(() => {
    setBets(externalBets);
  }, [externalBets]);

  const totalBetsOnBoard = Object.values(bets).reduce((sum, val) => sum + val, 0);
  const remainingBankroll = currentBankroll - totalBetsOnBoard;

  const updateBetsState = (newBets: Record<string, number>) => {
    setBets(newBets);
    if (onBetsChange) {
      onBetsChange(newBets);
    }
  };

  const handlePlaceBet = (betId: string, e?: React.MouseEvent, numValue?: number) => {
    if (e) e.preventDefault();

    if (remainingBankroll < activeChipValue) {
      alert(`Insufficient Bankroll! Remaining balance: $${remainingBankroll}`);
      return;
    }

    setHistory((prev) => [...prev, bets]);
    const updated = {
      ...bets,
      [betId]: (bets[betId] || 0) + activeChipValue,
    };
    updateBetsState(updated);

    if (numValue !== undefined) {
      onSelectNumber(numValue);
    }
  };

  const handleRemoveBet = (betId: string, e: React.MouseEvent) => {
    e.preventDefault();

    setHistory((prev) => [...prev, bets]);
    const currentBet = bets[betId] || 0;
    if (currentBet <= activeChipValue) {
      const copy = { ...bets };
      delete copy[betId];
      updateBetsState(copy);
    } else {
      updateBetsState({
        ...bets,
        [betId]: currentBet - activeChipValue,
      });
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousBets = history[history.length - 1];
    updateBetsState(previousBets);
    setHistory((prev) => prev.slice(0, -1));
  };

  const clearAllBets = () => {
    if (Object.keys(bets).length === 0) return;
    setHistory((prev) => [...prev, bets]);
    updateBetsState({});
  };

  const handleDoubleBets = () => {
    if (Object.keys(bets).length === 0) return;

    if (remainingBankroll < totalBetsOnBoard) {
      alert(`Cannot double bets! Insufficient bankroll balance ($${remainingBankroll} available).`);
      return;
    }

    setHistory((prev) => [...prev, bets]);
    const doubled: Record<string, number> = {};
    Object.entries(bets).forEach(([key, val]) => {
      doubled[key] = val * 2;
    });
    updateBetsState(doubled);
  };

  return (
    <div className="space-y-2 select-none">
      <div className="flex justify-between items-center bg-[#0b0f17] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs font-bold">
        <span className="text-[#94a3b8]">
          Active Bets: <span className="text-[#f59e0b]">${totalBetsOnBoard}</span>
        </span>
        <span className="text-[#94a3b8]">
          Available:{' '}
          <span className={remainingBankroll > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}>
            ${remainingBankroll}
          </span>
        </span>
      </div>

      <div className="bg-[#076324] border-2 border-[#f59e0b] rounded-xl p-2 shadow-2xl relative">
        {/* ZERO BANNER WITH CORRECTLY ALIGNED OVERLAY BET DOTS */}
        <div className="relative mb-1">
          <button
            onClick={(e) => handlePlaceBet('num-0', e, 0)}
            onContextMenu={(e) => handleRemoveBet('num-0', e)}
            className={`w-full py-2 rounded-t-lg font-black text-sm cursor-pointer transition-all relative flex items-center justify-center ${
              bets['num-0']
                ? 'bg-[#059669] border-2 border-[#f59e0b]'
                : 'bg-[#059669] text-white border border-[#10b981]/40 hover:bg-[#047857]'
            }`}
          >
            <span className="text-white">0</span>
            {bets['num-0'] && <PlacedChip amount={bets['num-0']} />}
          </button>

          {/* ABSOLUTE OVERLAY GRID MATCHING BOARD CONTAINER COLUMNS */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-4 gap-1">
            <div className="col-span-3 relative h-full">
              {/* FIRST FOUR / BASKET (0, 1, 2, 3) - Left Corner */}
              <button
                onClick={(e) => handlePlaceBet('first-four-0-1-2-3', e)}
                onContextMenu={(e) => handleRemoveBet('first-four-0-1-2-3', e)}
                className="pointer-events-auto absolute -bottom-2 -left-2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                title="First Four / Basket (0, 1, 2, 3)"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_4px_#f59e0b] group-hover:scale-150 transition-all border border-black/60" />
                {bets['first-four-0-1-2-3'] && <PlacedChip amount={bets['first-four-0-1-2-3']} />}
              </button>

              {/* SPLIT 0-1 (Center of Col 1) */}
              <button
                onClick={(e) => handlePlaceBet('split-h-0-1', e)}
                onContextMenu={(e) => handleRemoveBet('split-h-0-1', e)}
                className="pointer-events-auto absolute -bottom-2 left-[16.66%] -translate-x-1/2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                title="Split 0-1"
              >
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/80 group-hover:bg-[#f59e0b] group-hover:scale-125 transition-all border border-black/40" />
                {bets['split-h-0-1'] && <PlacedChip amount={bets['split-h-0-1']} />}
              </button>

              {/* TRIO 0-1-2 (Line between Col 1 and Col 2) */}
              <button
                onClick={(e) => handlePlaceBet('trio-0-1-2', e)}
                onContextMenu={(e) => handleRemoveBet('trio-0-1-2', e)}
                className="pointer-events-auto absolute -bottom-2 left-[33.33%] -translate-x-1/2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                title="Trio (0, 1, 2)"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_4px_#38bdf8] group-hover:scale-150 transition-all border border-black/60" />
                {bets['trio-0-1-2'] && <PlacedChip amount={bets['trio-0-1-2']} />}
              </button>

              {/* SPLIT 0-2 (Center of Col 2) */}
              <button
                onClick={(e) => handlePlaceBet('split-v-0-2', e)}
                onContextMenu={(e) => handleRemoveBet('split-v-0-2', e)}
                className="pointer-events-auto absolute -bottom-2 left-[50%] -translate-x-1/2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                title="Split 0-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/80 group-hover:bg-[#f59e0b] group-hover:scale-125 transition-all border border-black/40" />
                {bets['split-v-0-2'] && <PlacedChip amount={bets['split-v-0-2']} />}
              </button>

              {/* TRIO 0-2-3 (Line between Col 2 and Col 3) */}
              <button
                onClick={(e) => handlePlaceBet('trio-0-2-3', e)}
                onContextMenu={(e) => handleRemoveBet('trio-0-2-3', e)}
                className="pointer-events-auto absolute -bottom-2 left-[66.66%] -translate-x-1/2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                title="Trio (0, 2, 3)"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_4px_#38bdf8] group-hover:scale-150 transition-all border border-black/60" />
                {bets['trio-0-2-3'] && <PlacedChip amount={bets['trio-0-2-3']} />}
              </button>

              {/* SPLIT 0-3 (Center of Col 3) */}
              <button
                onClick={(e) => handlePlaceBet('split-h-0-3', e)}
                onContextMenu={(e) => handleRemoveBet('split-h-0-3', e)}
                className="pointer-events-auto absolute -bottom-2 left-[83.33%] -translate-x-1/2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                title="Split 0-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/80 group-hover:bg-[#f59e0b] group-hover:scale-125 transition-all border border-black/40" />
                {bets['split-h-0-3'] && <PlacedChip amount={bets['split-h-0-3']} />}
              </button>
            </div>
          </div>
        </div>

        {/* BOARD GRID */}
        <div className="grid grid-cols-4 gap-1 mb-1">
          <div className="col-span-3 border border-[#10b981]/40 rounded-b-md bg-[#047857]/20 relative">
            {VERTICAL_ROWS.map((row, rowIdx) => {
              const streetId = `street-${row[0]}-${row[2]}`;
              const lineId = rowIdx < 11 ? `line-${row[0]}-${row[0] + 5}` : null;

              return (
                <div key={rowIdx} className="grid grid-cols-3 gap-0 relative">
                  {/* STREET BET (3 Numbers / Single Line) */}
                  <button
                    onClick={(e) => handlePlaceBet(streetId, e)}
                    onContextMenu={(e) => handleRemoveBet(streetId, e)}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                    title={`Street Bet (Line ${row[0]}-${row[2]})`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_4px_#f59e0b] group-hover:scale-125 transition-all border border-black/60" />
                    {bets[streetId] && <PlacedChip amount={bets[streetId]} />}
                  </button>

                  {/* SIX LINE / DOUBLE STREET BET (Between 2 Lines, e.g., 1-2-3 & 4-5-6) */}
                  {lineId && (
                    <button
                      onClick={(e) => handlePlaceBet(lineId, e)}
                      onContextMenu={(e) => handleRemoveBet(lineId, e)}
                      className="absolute -left-2 -bottom-2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                      title={`Double Street / Six Line Bet (${row[0]}-${row[0] + 5})`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_4px_#38bdf8] group-hover:scale-150 transition-all border border-black/60" />
                      {bets[lineId] && <PlacedChip amount={bets[lineId]} />}
                    </button>
                  )}

                  {row.map((num, colIdx) => {
                    const betId = `num-${num}`;
                    const betAmount = bets[betId];
                    const bgColor = getNumberColor(num);

                    const horizSplitId = `split-h-${num}-${num + 1}`;
                    const vertSplitId = `split-v-${num}-${num + 3}`;
                    const cornerId = `corner-${num}-${num + 1}-${num + 3}-${num + 4}`;

                    return (
                      <div key={num} className="relative h-9 w-full border-[0.5px] border-[#10b981]/30">
                        <button
                          onClick={(e) => handlePlaceBet(betId, e, num)}
                          onContextMenu={(e) => handleRemoveBet(betId, e)}
                          className="h-full w-full font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative"
                          style={{
                            backgroundColor: bgColor,
                            boxShadow: betAmount ? 'inset 0 0 0 2px #f59e0b' : 'none',
                          }}
                        >
                          <span className="text-white font-bold">{num}</span>
                          {betAmount && <PlacedChip amount={betAmount} />}
                        </button>

                        {colIdx < 2 && (
                          <button
                            onClick={(e) => handlePlaceBet(horizSplitId, e)}
                            onContextMenu={(e) => handleRemoveBet(horizSplitId, e)}
                            className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-6 z-20 cursor-pointer flex items-center justify-center group"
                            title={`Split ${num}-${num + 1}`}
                          >
                            <div className="w-2 h-2 rounded-full bg-[#f59e0b]/60 group-hover:bg-[#f59e0b] group-hover:scale-125 transition-all border border-black/40" />
                            {bets[horizSplitId] && <PlacedChip amount={bets[horizSplitId]} />}
                          </button>
                        )}

                        {rowIdx < 11 && (
                          <button
                            onClick={(e) => handlePlaceBet(vertSplitId, e)}
                            onContextMenu={(e) => handleRemoveBet(vertSplitId, e)}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-6 z-20 cursor-pointer flex items-center justify-center group"
                            title={`Split ${num}-${num + 3}`}
                          >
                            <div className="w-2 h-2 rounded-full bg-[#f59e0b]/60 group-hover:bg-[#f59e0b] group-hover:scale-125 transition-all border border-black/40" />
                            {bets[vertSplitId] && <PlacedChip amount={bets[vertSplitId]} />}
                          </button>
                        )}

                        {colIdx < 2 && rowIdx < 11 && (
                          <button
                            onClick={(e) => handlePlaceBet(cornerId, e)}
                            onContextMenu={(e) => handleRemoveBet(cornerId, e)}
                            className="absolute -bottom-2 -right-2 w-4 h-4 z-30 cursor-pointer flex items-center justify-center group"
                            title={`Corner ${num}, ${num + 1}, ${num + 3}, ${num + 4}`}
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_4px_#f59e0b] group-hover:scale-150 transition-all border border-black/40" />
                            {bets[cornerId] && <PlacedChip amount={bets[cornerId]} />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* DOZENS SIDEBAR */}
          <div className="col-span-1 grid grid-rows-3 gap-1">
            {[
              { id: 'dozen-1', label: '1st 12' },
              { id: 'dozen-2', label: '2nd 12' },
              { id: 'dozen-3', label: '3rd 12' },
            ].map((dozen) => {
              const betAmount = bets[dozen.id];
              return (
                <button
                  key={dozen.id}
                  onClick={(e) => handlePlaceBet(dozen.id, e)}
                  onContextMenu={(e) => handleRemoveBet(dozen.id, e)}
                  className="bg-[#047857]/90 text-[#10b981] border border-[#10b981]/40 text-[9px] font-black rounded-md flex items-center justify-center relative cursor-pointer hover:bg-[#047857]"
                >
                  <span className="writing-mode-vertical uppercase tracking-wider">{dozen.label}</span>
                  {betAmount && <PlacedChip amount={betAmount} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMN BETS (2:1) */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          <div className="col-span-3 grid grid-cols-3 gap-0 border border-transparent">
            {[1, 2, 3].map((colNum) => {
              const betId = `col-${colNum}`;
              const betAmount = bets[betId];

              return (
                <button
                  key={colNum}
                  onClick={(e) => handlePlaceBet(betId, e)}
                  onContextMenu={(e) => handleRemoveBet(betId, e)}
                  className="bg-[#047857] text-[#cbd5e1] text-[9px] font-black py-2 text-center border border-[#10b981]/30 hover:bg-[#059669] relative flex items-center justify-center cursor-pointer"
                >
                  <span>2:1</span>
                  {betAmount && <PlacedChip amount={betAmount} />}
                </button>
              );
            })}
          </div>
          <div className="col-span-1" />
        </div>

        {/* OUTSIDE BETS */}
        <div className="space-y-1 mb-2">
          <div className="grid grid-cols-2 gap-1">
            {['1-18', '19-36'].map((label) => {
              const betId = `outside-${label.toLowerCase()}`;
              const betAmount = bets[betId];

              return (
                <button
                  key={label}
                  onClick={(e) => handlePlaceBet(betId, e)}
                  onContextMenu={(e) => handleRemoveBet(betId, e)}
                  className="bg-[#065f46] text-[#cbd5e1] border border-[#10b981]/30 hover:bg-[#047857] text-[10px] font-black py-2 rounded-md relative flex items-center justify-center cursor-pointer"
                >
                  <span>{label}</span>
                  {betAmount && <PlacedChip amount={betAmount} />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-1">
            {['EVEN', 'ODD'].map((label) => {
              const betId = `outside-${label.toLowerCase()}`;
              const betAmount = bets[betId];

              return (
                <button
                  key={label}
                  onClick={(e) => handlePlaceBet(betId, e)}
                  onContextMenu={(e) => handleRemoveBet(betId, e)}
                  className="bg-[#065f46] text-[#cbd5e1] border border-[#10b981]/30 hover:bg-[#047857] text-[10px] font-black py-2 rounded-md relative flex items-center justify-center cursor-pointer"
                >
                  <span>{label}</span>
                  {betAmount && <PlacedChip amount={betAmount} />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={(e) => handlePlaceBet('outside-red', e)}
              onContextMenu={(e) => handleRemoveBet('outside-red', e)}
              className="bg-[#dc2626] text-white border border-[#ef4444] text-[10px] font-black py-2 rounded-md relative flex items-center justify-center cursor-pointer"
            >
              <span>RED</span>
              {bets['outside-red'] && <PlacedChip amount={bets['outside-red']} />}
            </button>

            <button
              onClick={(e) => handlePlaceBet('outside-black', e)}
              onContextMenu={(e) => handleRemoveBet('outside-black', e)}
              className="bg-[#0f172a] text-[#cbd5e1] border border-[#334155] text-[10px] font-black py-2 rounded-md relative flex items-center justify-center cursor-pointer"
            >
              <span>BLACK</span>
              {bets['outside-black'] && <PlacedChip amount={bets['outside-black']} />}
            </button>
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-[#10b981]/30">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="py-1.5 bg-[#1e293b] text-[#cbd5e1] border border-[#334155] rounded-md text-[9px] font-extrabold uppercase hover:bg-[#334155] disabled:opacity-30 cursor-pointer transition-opacity"
          >
            ↩ Undo
          </button>

          <button
            onClick={clearAllBets}
            disabled={Object.keys(bets).length === 0}
            className="py-1.5 bg-[#dc2626]/20 text-[#ef4444] border border-[#ef4444]/40 rounded-md text-[9px] font-extrabold uppercase hover:bg-[#dc2626]/30 disabled:opacity-30 cursor-pointer transition-opacity"
          >
            🗑️ Clear
          </button>

          <button
            onClick={handleDoubleBets}
            disabled={Object.keys(bets).length === 0}
            className="py-1.5 bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 rounded-md text-[9px] font-extrabold uppercase hover:bg-[#f59e0b]/30 disabled:opacity-30 cursor-pointer transition-opacity"
          >
            2x Double
          </button>
        </div>
      </div>
    </div>
  );
}

export default WheelGrid;