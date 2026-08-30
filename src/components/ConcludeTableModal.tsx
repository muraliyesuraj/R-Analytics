import React from 'react';
import { Table } from '../types/index';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ConcludeTableModalProps {
  table: Table;
  onConclude: (tableId: string) => void;
  onClose: () => void;
}

export function ConcludeTableModal({ table, onConclude, onClose }: ConcludeTableModalProps) {
  const profitLoss = table.currentBankroll - table.initialBankroll;
  const isProfit = profitLoss >= 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0b0f17] border border-[#1e293b] rounded-xl p-5 w-full max-w-sm space-y-4 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#64748b] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${isProfit ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
            {isProfit ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Conclude Table</h3>
            <p className="text-[10px] text-[#64748b]">{table.name} • {table.spins.length} Spins Logged</p>
          </div>
        </div>

        <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#64748b]">Initial Bankroll</span>
            <span className="font-bold text-white">${table.initialBankroll.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">Final Bankroll</span>
            <span className="font-bold text-white">${table.currentBankroll.toFixed(2)}</span>
          </div>
          <div className="border-t border-[#1e293b] pt-2 flex justify-between font-black">
            <span className="text-[#94a3b8]">Net Result</span>
            <span className={isProfit ? 'text-[#10b981]' : 'text-[#ef4444]'}>
              {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-[#1e293b] text-[#cbd5e1] rounded-lg text-xs font-bold hover:bg-[#334155]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConclude(table.id)}
            className="flex-1 py-2 bg-[#10b981] text-[#020617] rounded-lg text-xs font-black hover:bg-[#059669]"
          >
            Confirm & Close
          </button>
        </div>
      </div>
    </div>
  );
}