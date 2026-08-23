import React, { useEffect, useState } from 'react';
import { AppState, Session, Table, WheelType } from './types/index';
import LaunchScreen from './screens/LaunchScreen';
import ActiveScreen from './screens/ActiveScreen';
import HistoryScreen from './screens/HistoryScreen';
import SummaryScreen from './screens/SummaryScreen';
import { calculatePayout } from './utils/payoutUtils';

function App() {
  const [appState, setAppState] = useState<AppState>('launch');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentTables, setCurrentTables] = useState<Table[]>([]);
  const [currentTableId, setCurrentTableId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('roulette_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  const startSession = (tables: Array<{ name: string; wheelType: WheelType; bankroll: number }>) => {
    const sessionId = `session_${Date.now()}`;
    const newTables: Table[] = tables.map((t, idx) => ({
      id: `table_${sessionId}_${idx}`,
      name: t.name,
      wheelType: t.wheelType,
      initialBankroll: t.bankroll,
      currentBankroll: t.bankroll,
      spins: [],
      createdAt: Date.now(),
    }));

    setCurrentTables(newTables);
    setCurrentSessionId(sessionId);
    setCurrentTableId(newTables[0].id);
    setAppState('active');
  };

  // Atomic log spin and bankroll payout calculator
  const handleLogSpinWithPayout = (
    tableId: string,
    winningNumber: number,
    bets: Record<string, number>
  ) => {
    const netProfitOrLoss = calculatePayout(bets, winningNumber);

    setCurrentTables((prevTables) =>
      prevTables.map((t) => {
        if (t.id !== tableId) return t;

        const newSpin = {
          number: winningNumber,
          timestamp: Date.now(),
        };

        return {
          ...t,
          currentBankroll: t.currentBankroll + netProfitOrLoss,
          spins: [...t.spins, newSpin],
        };
      })
    );
  };

  const addTable = (name: string, wheelType: WheelType, bankroll: number) => {
    const newTable: Table = {
      id: `table_${Date.now()}_${Math.random()}`,
      name,
      wheelType,
      initialBankroll: bankroll,
      currentBankroll: bankroll,
      spins: [],
      createdAt: Date.now(),
    };
    setCurrentTables((prev) => [...prev, newTable]);
    setCurrentTableId(newTable.id);
  };

  const completeSession = () => {
    if (!currentSessionId || currentTables.length === 0) return;

    const totalSpins = currentTables.reduce((sum, t) => sum + t.spins.length, 0);
    const netProfit = currentTables.reduce(
      (sum, t) => sum + (t.currentBankroll - t.initialBankroll),
      0
    );

    const newSession: Session = {
      id: currentSessionId,
      date: Date.now(),
      tables: currentTables,
      totalSpins,
      netProfit,
      completedAt: Date.now(),
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('roulette_sessions', JSON.stringify(updatedSessions));

    setAppState('summary');
  };

  const startNewSession = () => {
    setCurrentTables([]);
    setCurrentTableId(null);
    setCurrentSessionId(null);
    setAppState('launch');
  };

  const goToHistory = () => {
    setAppState('history');
  };

  const goToLaunch = () => {
    setAppState('launch');
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-[#0b0f17] to-[#1a1f2e] p-4">
      <div className="w-full max-w-[412px]">
        {appState === 'launch' && <LaunchScreen onStart={startSession} />}
        {appState === 'active' && currentTableId && (
          <ActiveScreen
            tables={currentTables}
            currentTableId={currentTableId}
            onSelectTable={setCurrentTableId}
            onLogSpinWithPayout={handleLogSpinWithPayout}
            onAddTable={addTable}
            onCompleteSession={completeSession}
            onGoToHistory={goToHistory}
          />
        )}
        {appState === 'history' && (
          <HistoryScreen sessions={sessions} onBack={goToLaunch} />
        )}
        {appState === 'summary' && currentSessionId && (
          <SummaryScreen
            tables={currentTables}
            onNewSession={startNewSession}
          />
        )}
      </div>
    </div>
  );
}

export default App;