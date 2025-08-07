import React from 'react';
import ShareButton from './ShareButton';
import { useTheme } from '../contexts/ThemeContext';

interface RewardCardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefuelAgain: () => void;
  rewardAmount: number;
  totalFuel: number;
}

const RewardCard: React.FC<RewardCardProps> = ({ isOpen, onClose, onRefuelAgain, rewardAmount, totalFuel }) => {
  if (!isOpen) return null;

  const shareText = `I just got ${rewardAmount} free Calculation Fuel on the All Calculation app! You can get some too. Check it out: ${window.location.origin}`;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 text-center space-y-4 transform transition-transform animate-pulse-zoom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-card-title"
      >
        <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full hover:bg-black/10 text-theme-secondary" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-6xl">⛽️</div>
        <h2 id="reward-card-title" className="text-3xl font-bold text-primary">+{rewardAmount} Fuel!</h2>
        <p className="text-theme-secondary">
          Your new balance is <strong className="text-theme-primary">{totalFuel}</strong> Fuel.
        </p>
        <div className="space-y-2 pt-2">
            <button onClick={onRefuelAgain} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors">
                Refuel Again
            </button>
            <ShareButton textToShare={shareText} />
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
