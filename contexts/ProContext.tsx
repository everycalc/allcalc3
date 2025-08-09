import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface ProContextType {
  isPro: boolean;
  activateProMode: () => void;
}

export const ProContext = createContext<ProContextType>({
  isPro: false,
  activateProMode: () => {},
});

export const usePro = () => useContext(ProContext);

export const ProProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Check localStorage on initial load
    const proStatus = localStorage.getItem('isProUser');
    if (proStatus === 'true') {
      setIsPro(true);
    }
  }, []);

  const activateProMode = () => {
    setIsPro(true);
    localStorage.setItem('isProUser', 'true');
  };

  return (
    <ProContext.Provider value={{ isPro, activateProMode }}>
      {children}
    </ProContext.Provider>
  );
};
