import React, { useEffect } from 'react';

interface PdfFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefuel: () => void;
  cost: number;
}

const PdfFuelModal: React.FC<PdfFuelModalProps> = ({ isOpen, onClose, onRefuel, cost }) => {
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
        aria-labelledby="pdf-fuel-modal-title"
      >
        <div className="text-5xl">📄</div>
        <h2 id="pdf-fuel-modal-title" className="text-2xl font-bold text-primary">PDF Download</h2>
        <p className="text-theme-secondary">
          This feature requires <strong className="text-theme-primary">{cost} Calculation Fuel</strong> to download your AI-powered PDF report.
        </p>
        <div className="space-y-2 pt-2">
            <button onClick={onRefuel} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors">
                Refuel
            </button>
            <button onClick={onClose} className="w-full text-sm text-theme-secondary font-semibold py-2 px-4 rounded-md hover:bg-theme-tertiary transition-colors">
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default PdfFuelModal;