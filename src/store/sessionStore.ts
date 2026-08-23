import { create } from 'zustand';
import { Session, Table } from '../types/index';

interface SessionStore {
  currentSession: Session | null;
  currentTableName: string | null;
  setCurrentSession: (session: Session | null) => void;
  setCurrentTableName: (name: string | null) => void;
  addTable: (name: string) => void;
  updateTable: (name: string, table: Partial<Table>) => void;
  getActiveTable: () => Table | null;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  currentTableName: null,

  setCurrentSession: (session) => set({ currentSession: session }),

  setCurrentTableName: (name) => set({ currentTableName: name }),

  addTable: (name) =>
    set((state) => {
      if (!state.currentSession) return state;

      const newTable: Table = {
        name,
        activeBets: [],
        spinHistory: [],
        personalActivity: [],
        isCompleted: false,
      };

      return {
        currentSession: {
          ...state.currentSession,
          tables: {
            ...state.currentSession.tables,
            [name]: newTable,
          },
        },
      };
    }),

  updateTable: (name, table) =>
    set((state) => {
      if (!state.currentSession || !state.currentSession.tables[name]) return state;

      return {
        currentSession: {
          ...state.currentSession,
          tables: {
            ...state.currentSession.tables,
            [name]: {
              ...state.currentSession.tables[name],
              ...table,
            },
          },
        },
      };
    }),

  getActiveTable: () => {
    const state = get();
    if (!state.currentSession || !state.currentTableName) return null;
    return state.currentSession.tables[state.currentTableName] || null;
  },
}));
