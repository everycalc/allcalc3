
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

const AD_FREQUENCY = 3; // Show ad every 3 calculations

interface AdContextType {
  shouldShowAd: (isPremium?: boolean) => boolean; 
}

export const AdContext = createContext<AdContextType>({
  shouldShowAd: () => false,
});

export const useAd = () => useContext(AdContext);

export const AdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [calculationCount, setCalculationCount] = useState<number>(0);

  useEffect(() => {
    try {
        const storedCount = sessionStorage.getItem('adCalculationCount');
        setCalculationCount(storedCount ? parseInt(storedCount, 10) : 0);
    } catch (e) {
        setCalculationCount(0);
    }
  }, []);

  const shouldShowAd = (isPremium: boolean = false) => {
    if (isPremium) {
      setCalculationCount(0);
      sessionStorage.setItem('adCalculationCount', '0');
      return true; // Show ad for premium, and reset counter.
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
    <AdContext.Provider value={{ shouldShowAd }}>
      {children}
    </AdContext.Provider>
  );
};