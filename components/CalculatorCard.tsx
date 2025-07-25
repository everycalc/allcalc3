
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CalculatorCardProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
  isPremium?: boolean;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ name, icon, onClick, isPremium }) => {
  const { cardStyle, pinnedCalculators, togglePin } = useTheme();
  const isPinned = pinnedCalculators.includes(name);

  const baseClasses = "flex flex-col items-center justify-start text-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-primary focus:ring-[var(--color-primary)] transition-all duration-200";
  const simpleStyle = "p-2 rounded-lg";
  const cardedStyle = "p-4 rounded-xl bg-theme-secondary shadow-lg hover:shadow-xl hover:-translate-y-1";

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(name);
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${cardStyle === 'card' ? cardedStyle : simpleStyle} relative`}
      aria-label={`Open ${name}`}
    >
      {isPremium && <span className="premium-badge">Premium</span>}
      <button
        onClick={handlePinClick}
        className={`absolute top-1 left-1 p-1.5 rounded-full text-theme-secondary bg-theme-primary/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 hover:bg-theme-secondary hover:text-primary z-10 ${isPinned ? '!opacity-100 !text-primary' : ''}`}
        aria-label={isPinned ? `Unpin ${name}` : `Pin ${name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
        </svg>
      </button>

      <div className={`mb-3 transition-transform duration-200 ease-in-out ${cardStyle === 'simple' ? 'group-hover:scale-110' : ''}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-theme-primary leading-tight">{name}</p>
    </button>
  );
};

export default CalculatorCard;
