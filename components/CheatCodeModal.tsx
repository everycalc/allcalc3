import React, { useState, useEffect, useContext } from 'react';
import { usePro } from '../contexts/ProContext';

interface CheatCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHEAT_CODES = {
  'DISABLEADS2024': { message: 'Success! Ads have been disabled for this device.' },
};

const CheatCodeModal: React.FC<CheatCodeModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { activateProMode } = usePro();

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

    if (cheat) {
      activateProMode();
      setIsError(false);
      setMessage(cheat.message);
      setCode('');
    } else {
      setIsError(true);
      setMessage('Invalid code. Please try again.');
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
        className="modal-content relative w-full max-w-sm rounded-xl shadow-2xl p-6 transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-on-surface">Enter Code</h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant">
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
            className="input-base w-full p-3"
            placeholder="Enter special code"
          />
          {message && <p className={`text-sm text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
          <button 
            type="submit" 
            className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg"
          >
            Activate
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheatCodeModal;
