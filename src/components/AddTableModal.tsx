import React, { useState } from 'react';
import { WheelType } from '../types/index';

interface AddTableModalProps {
  onAdd: (name: string, wheelType: WheelType, bankroll: number) => void;
  onClose: () => void;
}

function AddTableModal({ onAdd, onClose }: AddTableModalProps) {
  const [tableName, setTableName] = useState('Table B');
  const [wheelType, setWheelType] = useState<WheelType>('european');
  const [bankroll, setBankroll] = useState('200.00');

  const handleAdd = () => {
    const amount = parseFloat(bankroll) || 200;
    onAdd(tableName, wheelType, amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#020617] border border-[#1e293b] rounded-lg p-4 max-w-sm w-full mx-4 space-y-4">
        <h2 className="text-[11px] font-black text-[#38bdf8] tracking-wider">
          ADD NEW TABLE
        </h2>

        {/* Table Name */}
        <div>
          <label className="block text-[9px] font-black text-[#94a3b8] mb-2 tracking-wide">
            TABLE NAME
          </label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] rounded px-3 py-2 text-[11px] font-semibold text-[#f8fafc] focus:outline-none focus:border-[#38bdf8] transition-colors"
          />
        </div>

        {/* Wheel Type */}
        <div>
          <label className="block text-[9px] font-black text-[#94a3b8] mb-2 tracking-wide">
            WHEEL TYPE
          </label>
          <div className="flex gap-2">
            {(['european', 'american'] as WheelType[]).map((type) => (
              <button
                key={type}
                onClick={() => setWheelType(type)}
                className={`flex-1 py-2 px-2 rounded text-[9px] font-bold transition-colors ${
                  wheelType === type
                    ? 'bg-[#38bdf8] text-[#0b0f17]'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
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

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-[#1e293b] text-[#cbd5e1] py-2 rounded font-bold text-[9px] hover:bg-[#334155] transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#10b981] text-[#020617] py-2 rounded font-bold text-[9px] hover:bg-[#059669] transition-colors glow-green"
          >
            ADD TABLE
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTableModal;
