import React, { useState } from 'react';
import { Session, FilterPeriod } from '../types/index';

interface HistoryScreenProps {
  sessions: Session[];
  onBack: () => void;
}

function HistoryScreen({ sessions, onBack }: HistoryScreenProps) {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('alltime');

  const filteredSessions = sessions.filter((session) => {
    const daysDiff = (Date.now() - session.date) / (1000 * 60 * 60 * 24);
    if (filterPeriod === 'last7d') return daysDiff <= 7;
    if (filterPeriod === 'thismonth') return daysDiff <= 30;
    return true;
  });

  const totalProfit = filteredSessions.reduce((sum, s) => sum + s.netProfit, 0);
  const winSessions = filteredSessions.filter((s) => s.netProfit > 0).length;
  const winRate =
    filteredSessions.length === 0
      ? 0
      : ((winSessions / filteredSessions.length) * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-[#334155] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#020617] border-b border-[#1e293b] px-4 py-3 flex justify-between items-start">
        <div>
          <p className="text-[11px] font-black text-[#38bdf8] tracking-wider">
            PERFORMANCE HISTORY
          </p>
          <p className="text-[8px] text-[#64748b] mt-1">
            PAST DAYS & SESSION LOGS
          </p>
        </div>
        <button
          onClick={onBack}
          className="bg-[#1e293b] text-[#cbd5e1] border border-[#334155] px-2 py-1 rounded text-[8px] font-black hover:bg-[#334155] transition-colors"
        >
          ← BACK
        </button>
      </div>

      {/* Lifetime Metrics */}
      <div className="bg-gradient-to-r from-[#020617] to-[#0f172a] border-b border-[#1e293b] mx-4 my-4 p-3 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-[7px] font-black text-[#94a3b8] mb-1">
            ALL-TIME NET PROFIT
          </p>
          <p className={`text-base font-black ${totalProfit >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[7px] font-black text-[#94a3b8] mb-1">
            WIN RATE / SESSIONS
          </p>
          <p className="text-[10px] font-black text-[#38bdf8]">
            {winRate}% <span className="text-[#64748b] text-[8px]">({winSessions}/{filteredSessions.length})</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-4">
        {(['alltime', 'last7d', 'thismonth', 'custom'] as FilterPeriod[]).map(
          (period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`py-1 px-2 rounded text-[7px] font-black transition-colors ${
                filterPeriod === period
                  ? 'bg-[#0284c7] text-white'
                  : 'bg-[#0f172a] text-[#94a3b8] border border-[#1e293b]'
              }`}
            >
              {period === 'alltime'
                ? 'ALL TIME'
                : period === 'last7d'
                  ? 'LAST 7D'
                  : period === 'thismonth'
                    ? 'THIS MONTH'
                    : 'CUSTOM'}
            </button>
          )
        )}
      </div>

      {/* Sessions List */}
      <div className="px-4 pb-4 max-h-96 overflow-y-auto space-y-3">
        {filteredSessions.length === 0 ? (
          <p className="text-center text-[#64748b] text-[9px] py-4">No sessions found</p>
        ) : (
          filteredSessions.map((session) => {
            const date = new Date(session.date);
            const dateStr = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).toUpperCase();

            return (
              <div
                key={session.id}
                className="bg-[#020617] border border-[#1e293b] rounded-lg p-3"
              >
                <div className="flex justify-between items-start pb-2 border-b border-[#0f172a] mb-2">
                  <div>
                    <p className="text-[8px] font-black text-[#f8fafc]">
                      {dateStr}
                    </p>
                    <p className="text-[7px] text-[#64748b] mt-0.5">
                      {session.tables.length} Table{session.tables.length !== 1 ? 's' : ''} •{' '}
                      {Math.floor(session.totalSpins)} spins
                    </p>
                  </div>
                  <p
                    className={`text-base font-black ${
                      session.netProfit >= 0
                        ? 'text-[#10b981]'
                        : 'text-[#ef4444]'
                    }`}
                  >
                    {session.netProfit >= 0 ? '+' : ''}${session.netProfit.toFixed(2)}
                  </p>
                </div>

                {/* Table Breakdown */}
                <div className="text-[7px] text-[#cbd5e1] space-y-1">
                  {session.tables.map((table) => {
                    const tableProfit = table.currentBankroll - table.initialBankroll;
                    return (
                      <div key={table.id}>
                        • {table.name}:{' '}
                        <span
                          className={
                            tableProfit >= 0
                              ? 'text-[#10b981]'
                              : 'text-[#ef4444]'
                          }
                        >
                          <strong>
                            {tableProfit >= 0 ? '+' : ''}${tableProfit.toFixed(2)}
                          </strong>
                        </span>{' '}
                        ({table.spins.length} spins)
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        <button className="bg-[#1e293b] text-[#cbd5e1] border border-[#334155] py-2 rounded text-[8px] font-black hover:bg-[#334155] transition-colors">
          CLEAR HISTORY
        </button>
        <button
          onClick={onBack}
          className="bg-[#0284c7] text-white py-2 rounded text-[8px] font-black hover:bg-[#0369a1] transition-colors"
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
}

export default HistoryScreen;
