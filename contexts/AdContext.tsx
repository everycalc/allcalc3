import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useFuel } from './FuelContext';

const AD_FREQUENCY = 3; // Show ad every 3 calculations when fuel is 0

interface AdContextType {
  shouldShowAd: (isPremium?: boolean) => boolean; 
  showOutOfFuelToast: boolean;
  closeOutOfFuelToast: () => void;
}

export const AdContext = createContext<AdContextType>({
  shouldShowAd: () => false,
  showOutOfFuelToast: false,
  closeOutOfFuelToast: () => {},
});

export const useAd = () => useContext(AdContext);

export const AdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [calculationCount, setCalculationCount] = useState<number>(0);
  const [showOutOfFuelToast, setShowOutOfFuelToast] = useState(false);
  const { fuel } = useFuel(); // Get fuel state

  useEffect(() => {
    // Only load/manage the counter if the user is out of fuel
    if (fuel === 0) {
        try {
            const storedCount = sessionStorage.getItem('adCalculationCount');
            setCalculationCount(storedCount ? parseInt(storedCount, 10) : 0);
        } catch (e) {
            setCalculationCount(0);
        }
    } else {
        // If user has fuel, reset the counter
        setCalculationCount(0);
        sessionStorage.setItem('adCalculationCount', '0');
    }
  }, [fuel]); // Rerun this effect when fuel changes

  const closeOutOfFuelToast = () => {
    setShowOutOfFuelToast(false);
    sessionStorage.setItem('hasSeenOutOfFuelMessage', 'true');
  };

  const shouldShowAd = (isPremium: boolean = false) => {
    // If user has fuel, never show an interstitial ad for a calculation
    if (fuel > 0) {
      return false;
    }
    
    // First time hitting zero fuel in a session, show a toast instead of an ad.
    const hasSeenMessage = sessionStorage.getItem('hasSeenOutOfFuelMessage');
    if (!hasSeenMessage) {
        setShowOutOfFuelToast(true);
        // Don't show an ad immediately, show the toast first.
        return false; 
    }

    // If fuel is 0, use the counter logic
    // For expert tools (isPremium), show an ad every time when out of fuel.
    if (isPremium) {
        return true;
    }

    const newCount = calculationCount + 1;

    if (newCount >= AD_FREQUENCY) {
      setCalculationCount(0);
      sessionStorage.setItem('adCalculationCount', '0');
      return true; // Show ad after 3 calcs, and reset counter.
    }
    
    // Otherwise, just increment the counter and don't show an ad.
    setCalculationCount(newCount);
    sessionStorage.setItem('adCalculationCount', String(newCount));
    return false;
  };
  
  return (
    <AdContext.Provider value={{ shouldShowAd, showOutOfFuelToast, closeOutOfFuelToast }}>
      {children}
    </AdContext.Provider>
  );
};