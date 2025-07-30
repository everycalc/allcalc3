import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CalculatorCardProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  isPremium?: boolean;
  pinId?: string;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ name, icon, onClick, isPremium, pinId }) => {
  const { cardStyle, pinnedCalculators, pinCalculator, unpinCalculator } = useTheme();

  const isPinned = pinnedCalculators.includes(name);

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main onClick from firing
    if (isPinned) {
      unpinCalculator(name);
    } else {
      pinCalculator(name);
    }
  };

  const baseClasses = "flex flex-col items-center justify-start text-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-primary focus:ring-[var(--color-primary)] transition-all duration-200 h-full";
  const simpleStyle = "p-2 rounded-lg";
  const cardedStyle = "p-4 rounded-xl bg-theme-secondary shadow-lg hover:shadow-xl hover:-translate-y-1";

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
      className={`${baseClasses} ${cardStyle === 'card' ? cardedStyle : simpleStyle} relative`}
      aria-label={`Open ${name}`}
    >
      {isPremium && <span className="expert-badge">Expert</span>}
      <button 
        onClick={handlePinToggle} 
        className={`pin-button ${isPinned ? 'pinned' : ''}`}
        aria-label={isPinned ? `Unpin ${name}` : `Pin ${name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
        </svg>
      </button>

      <div className={`mb-3 transition-transform duration-200 ease-in-out ${cardStyle === 'simple' ? 'group-hover:scale-110' : ''}`}>
        {icon}
      </div>
      <p className="w-full text-sm font-medium text-theme-primary leading-tight truncate">{name}</p>
    </div>
  );
};

export default CalculatorCard;