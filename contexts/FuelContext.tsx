import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

const INITIAL_FUEL = 5;

interface FuelContextType {
  fuel: number;
  consumeFuel: (amount: number) => boolean; // Returns true if successful
  addFuel: (amount: number) => void;
  setFuel: (amount: number) => void; // For "continue anyway"
}

export const FuelContext = createContext<FuelContextType>({
  fuel: INITIAL_FUEL,
  consumeFuel: () => false,
  addFuel: () => {},
  setFuel: () => {},
});

export const useFuel = () => useContext(FuelContext);

export const FuelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fuel, setFuelState] = useState<number>(INITIAL_FUEL);

  useEffect(() => {
    try {
      const storedFuel = localStorage.getItem('calculationFuel');
      if (storedFuel !== null) {
        setFuelState(parseInt(storedFuel, 10));
      } else {
        localStorage.setItem('calculationFuel', String(INITIAL_FUEL));
        setFuelState(INITIAL_FUEL);
      }
    } catch (error) {
      console.error("Failed to load fuel from localStorage", error);
      setFuelState(INITIAL_FUEL);
    }
  }, []);

  const saveFuel = (newFuel: number) => {
    try {
      const clampedFuel = Math.max(0, newFuel);
      localStorage.setItem('calculationFuel', String(clampedFuel));
      setFuelState(clampedFuel);
    } catch (error) {
      console.error("Failed to save fuel to localStorage", error);
    }
  };

  const consumeFuel = (amount: number): boolean => {
    if (fuel >= amount) {
      saveFuel(fuel - amount);
      return true;
    }
    return false;
  };

  const addFuel = (amount: number) => {
    saveFuel(fuel + amount);
  };
  
  const setFuel = (amount: number) => {
    saveFuel(amount);
  };

  return (
    <FuelContext.Provider value={{ fuel, consumeFuel, addFuel, setFuel }}>
      {children}
    </FuelContext.Provider>
  );
};
