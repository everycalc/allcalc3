import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface HistoryEntry {
  id: string;
  calculator: string;
  calculation: string;
  timestamp: Date;
  inputs: any; // Used to restore calculator state
}

interface HistoryContextType {
  history: HistoryEntry[];
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const HistoryContext = createContext<HistoryContextType>({
  history: [],
  addHistory: () => {},
  clearHistory: () => {},
});

interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('calculatorHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp) // Revive date object
        }));
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calculatorHistory', JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const addHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setHistory(prevHistory => [newEntry, ...prevHistory]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};