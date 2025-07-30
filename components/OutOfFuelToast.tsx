import React from 'react';

interface OutOfFuelToastProps {
  isOpen: boolean;
  onClose: () => void;
}

const OutOfFuelToast: React.FC<OutOfFuelToastProps> = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-50 animate-fade-in-up">
      <div
        className="bg-theme-secondary rounded-xl shadow-2xl p-4 flex items-center justify-between space-x-4"
        role="alert"
      >
        <div className="flex-shrink-0 text-2xl">⛽</div>
        <div className="flex-grow">
          <p className="font-semibold text-theme-primary">You've run out of Calculation Fuel!</p>
          <p className="text-sm text-theme-secondary">Ads will now be shown periodically. Use the "Refuel" button in the sidebar to earn more fuel.</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-black/10 text-theme-secondary flex-shrink-0" 
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OutOfFuelToast;