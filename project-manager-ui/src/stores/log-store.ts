import { create } from 'zustand';

type LogRecord = {
  id: number;
  message: string;
  type: 'default' | 'command';
};

interface LogStoreConfig {
  maxLogs: number;
}

type LogStore = {
  logs: LogRecord[];
  config: LogStoreConfig;
  nextId: number;

  addLog: (log: Omit<LogRecord, 'id'>) => void;
  clearLogs: () => void;
  setMaxLogs: (max: number) => void;
};

const DEFAULT_MAX_LOGS = 1000;

export const useLogStore = create<LogStore>((set, get) => ({
  logs: [],
  config: {
    maxLogs: DEFAULT_MAX_LOGS,
  },
  nextId: 1,

  addLog: (log) => {
    const { logs, config, nextId } = get();

    const nextLog: LogRecord = {
      id: nextId,
      ...log,
    };

    const nextLogs = [...logs, nextLog];

    // Drop oldest records if limit exceeded
    const trimmedLogs =
      nextLogs.length > config.maxLogs
        ? nextLogs.slice(nextLogs.length - config.maxLogs)
        : nextLogs;

    set({ logs: trimmedLogs, nextId: nextId + 1 });
  },

  clearLogs: () => {
    set({ logs: [] });
  },

  setMaxLogs: (max) => {
    const safeMax = Math.max(1, max);
    const { logs } = get();

    set({
      config: { maxLogs: safeMax },
      logs: logs.length > safeMax ? logs.slice(logs.length - safeMax) : logs,
    });
  },
}));
