import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CalculatorCardProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  pinId?: string;
  isPremium?: boolean;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ name, icon, onClick, pinId, isPremium }) => {
  const { pinnedCalculators, pinCalculator, unpinCalculator } = useTheme();

  const isPinned = pinnedCalculators.includes(name);

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main onClick from firing
    if (isPinned) {
      unpinCalculator(name);
    } else {
      pinCalculator(name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Trigger onClick on Enter or Space key press for accessibility
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      id={pinId}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="calculator-card group relative focus:outline-none focus:ring-2 focus:ring-offset-2"
      aria-label={`Open ${name}`}
    >
       {isPremium && (
          <div className="expert-badge" title="Expert Tool">
              Expert
          </div>
      )}
      <button 
        onClick={handlePinToggle} 
        className={`pin-button ${isPinned ? 'pinned' : ''}`}
        aria-label={isPinned ? `Unpin ${name}` : `Pin ${name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
        </svg>
      </button>

      <div className="mb-3 transition-transform duration-200 ease-in-out">
        {icon}
      </div>
      <p className="w-full text-sm font-medium text-on-surface-variant leading-tight">{name}</p>
    </div>
  );
};

export default CalculatorCard;