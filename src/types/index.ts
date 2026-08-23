export type WheelType = 'european' | 'american';
export type AppState = 'launch' | 'active' | 'history' | 'summary';
export type FilterPeriod = 'alltime' | 'last7d' | 'thismonth' | 'custom';

export interface Spin {
  number: number;
  timestamp: number;
}

export interface Table {
  id: string;
  name: string;
  wheelType: WheelType;
  initialBankroll: number;
  currentBankroll: number;
  spins: Spin[];
  createdAt: number;
}

export interface Session {
  id: string;
  date: number;
  tables: Table[];
  totalSpins: number;
  netProfit: number;
  completedAt: number;
}

export interface Metrics {
  colors: {
    red: number;
    black: number;
    green: number;
  };
  ranges: {
    low: number;
    high: number;
  };
}
