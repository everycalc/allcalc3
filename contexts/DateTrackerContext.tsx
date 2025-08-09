import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export type DateType = 'Birthday' | 'Anniversary';

export interface SavedDate {
  id: string;
  name: string;
  date: string; // Stored as YYYY-MM-DD
  type: DateType;
}

interface DateTrackerContextType {
  savedDates: SavedDate[];
  addDate: (entry: Omit<SavedDate, 'id'>) => void;
  removeDate: (id: string) => void;
}

export const DateTrackerContext = createContext<DateTrackerContextType>({
  savedDates: [],
  addDate: () => {},
  removeDate: () => {},
});

export const useDateTracker = () => useContext(DateTrackerContext);

interface DateTrackerProviderProps {
  children: ReactNode;
}

export const DateTrackerProvider: React.FC<DateTrackerProviderProps> = ({ children }) => {
  const [savedDates, setSavedDates] = useState<SavedDate[]>([]);

  useEffect(() => {
    try {
      const storedDates = localStorage.getItem('savedDates');
      if (storedDates) {
        setSavedDates(JSON.parse(storedDates));
      }
    } catch (error) {
      console.error("Failed to load saved dates from localStorage", error);
      setSavedDates([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedDates', JSON.stringify(savedDates));
    } catch (error) {
        console.error("Failed to save dates to localStorage", error);
    }
  }, [savedDates]);

  const addDate = (dateInfo: Omit<SavedDate, 'id'>) => {
    const newDate: SavedDate = {
      ...dateInfo,
      id: crypto.randomUUID(),
    };
    setSavedDates(prevDates => [newDate, ...prevDates].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const removeDate = (id: string) => {
    setSavedDates(prevDates => prevDates.filter(date => date.id !== id));
  };

  return (
    <DateTrackerContext.Provider value={{ savedDates, addDate, removeDate }}>
      {children}
    </DateTrackerContext.Provider>
  );
};