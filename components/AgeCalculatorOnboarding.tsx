import React, { useEffect } from 'react';

interface AgeCalculatorOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDateManager: () => void;
}

const AgeCalculatorOnboarding: React.FC<AgeCalculatorOnboardingProps> = ({ isOpen, onClose, onOpenDateManager }) => {
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

  const handleManageDatesClick = () => {
    onOpenDateManager();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 text-center space-y-4 transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="text-5xl">🎂</div>
        <h2 id="onboarding-title" className="text-2xl font-bold text-primary">Save Birthdays!</h2>
        <p className="text-theme-secondary">
          Tired of typing dates? Save birthdays and anniversaries to calculate ages and track events with a single click.
        </p>
        <div className="space-y-2 pt-2">
            <button onClick={handleManageDatesClick} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors">
                Manage Saved Dates
            </button>
            <button onClick={onClose} className="w-full text-sm text-theme-secondary font-semibold py-2 px-4 rounded-md hover:bg-theme-tertiary transition-colors">
                Maybe Later
            </button>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculatorOnboarding;
