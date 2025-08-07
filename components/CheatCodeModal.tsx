import React, { useState, useEffect } from 'react';
import { useFuel } from '../contexts/FuelContext';

interface CheatCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHEAT_CODES = {
  'NH629291': { fuel: 500, maxUses: 20, type: 'Admin' },
  'INF4957101': { fuel: 100, maxUses: 3, type: 'Influencer' },
};

const CheatCodeModal: React.FC<CheatCodeModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { addFuel } = useFuel();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    // Delay reset for closing animation
    setTimeout(() => {
      setCode('');
      setMessage('');
      setIsError(false);
    }, 300);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.trim().toUpperCase();
    const cheat = CHEAT_CODES[enteredCode as keyof typeof CHEAT_CODES];

    if (!cheat) {
      setIsError(true);
      setMessage('Invalid cheat code.');
      return;
    }

    const usageKey = `cheatCode_${enteredCode}_uses`;
    try {
      const currentUses = parseInt(localStorage.getItem(usageKey) || '0', 10);

      if (currentUses >= cheat.maxUses) {
        setIsError(true);
        setMessage(`This code has already been used the maximum of ${cheat.maxUses} times.`);
        return;
      }

      addFuel(cheat.fuel);
      localStorage.setItem(usageKey, String(currentUses + 1));
      setIsError(false);
      setMessage(`Success! ${cheat.fuel} fuel added. You have ${cheat.maxUses - (currentUses + 1)} uses left.`);
      setCode('');

    } catch (error) {
        console.error("Error accessing localStorage for cheat codes", error);
        setIsError(true);
        setMessage("Could not process cheat code due to a storage error.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-theme-primary">Enter Cheat Code</h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-black/10 text-theme-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            value={code} 
            onChange={e => setCode(e.target.value)} 
            className="w-full bg-theme-primary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          {message && <p className={`text-sm text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          <button 
            type="submit" 
            className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg"
          >
            Activate
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheatCodeModal;