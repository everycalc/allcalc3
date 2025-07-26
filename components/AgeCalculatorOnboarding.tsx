import React from 'react';

interface AgeCalculatorOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDateManager: () => void;
}

const AgeCalculatorOnboarding: React.FC<AgeCalculatorOnboardingProps> = ({ isOpen, onClose, onOpenDateManager }) => {
  if (!isOpen) return null;

  const handleManageDates = () => {
    onOpenDateManager();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">🎂</div>
        <h2 className="text-2xl font-bold text-theme-primary mb-2">Never Forget a Birthday!</h2>
        <p className="text-theme-secondary mb-6">You can save important birthdays and anniversaries. They'll appear in the dropdown here for quick age calculations.</p>
        <div className="space-y-2">
            <button onClick={handleManageDates} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors">
                Save a Date Now
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
