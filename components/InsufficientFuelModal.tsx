import React, { useEffect } from 'react';

interface InsufficientFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onContinue: () => void;
  onRefuel: () => void;
}

const InsufficientFuelModal: React.FC<InsufficientFuelModalProps> = ({ isOpen, onClose, onWatchAd, onContinue, onRefuel }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fuel-modal-title"
      >
        <h2 id="fuel-modal-title" className="text-2xl font-bold text-primary">Insufficient Fuel</h2>
        <p className="text-theme-secondary">This Expert Tool requires 2 Calculation Fuel, but you only have 1.</p>
        <div className="space-y-2 pt-2">
            <button onClick={onWatchAd} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors">
                Watch Ad to Use (5s)
            </button>
            <button onClick={onContinue} className="w-full bg-theme-tertiary text-theme-primary font-semibold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors">
                Continue Anyway & Enable Ads
            </button>
             <button onClick={onRefuel} className="w-full text-sm text-primary font-semibold py-2 px-4 rounded-md hover:bg-theme-tertiary transition-colors">
                Refuel
            </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientFuelModal;
