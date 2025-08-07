import React, { useState, useEffect, useMemo } from 'react';
import { useFuel } from '../contexts/FuelContext';

interface ScratchCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const possiblePrizes = [
    { value: 1, symbol: '⛽' },
    { value: 2, symbol: '⛽⛽' },
    { value: 5, symbol: '💰' },
    { value: 10, symbol: '💎' },
];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const ScratchCardModal: React.FC<ScratchCardModalProps> = ({ isOpen, onClose }) => {
  const { addFuel } = useFuel();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wonPrize, setWonPrize] = useState<{ value: number; symbol: string } | null>(null);
  const [grid, setGrid] = useState<(typeof possiblePrizes[0])[]>([]);
  const [revealed, setRevealed] = useState(Array(9).fill(false));

  const setupGrid = () => {
    // Determine a guaranteed win
    const winningPrize = possiblePrizes[Math.floor(Math.random() * possiblePrizes.length)];
    let tempGrid = [winningPrize, winningPrize, winningPrize];

    // Fill the rest of the grid ensuring no other prize appears 3 times
    let otherPrizes = possiblePrizes.filter(p => p.value !== winningPrize.value);
    if(otherPrizes.length === 0) otherPrizes = [possiblePrizes[0]]; // fallback

    for (let i = 0; i < 6; i++) {
        tempGrid.push(otherPrizes[i % otherPrizes.length]);
    }
    
    setGrid(shuffleArray(tempGrid));
    setRevealed(Array(9).fill(false));
    setIsComplete(false);
    setWonPrize(null);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const lastPlayDate = localStorage.getItem('lastScratchDate');
      if (lastPlayDate === getTodayDateString()) {
        setHasPlayed(true);
      } else {
        setHasPlayed(false);
        setupGrid();
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  
  const handleScratch = (index: number) => {
    if (hasPlayed || isComplete || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    // Check for win
    const revealedPrizes = grid.filter((_, i) => newRevealed[i]);
    const counts: { [key: number]: number } = {};
    
    for (const prize of revealedPrizes) {
        counts[prize.value] = (counts[prize.value] || 0) + 1;
        if (counts[prize.value] === 3) {
            const winningPrize = possiblePrizes.find(p => p.value === prize.value);
            if (winningPrize) {
                setIsComplete(true);
                setWonPrize(winningPrize);
                addFuel(winningPrize.value);
                localStorage.setItem('lastScratchDate', getTodayDateString());
                setHasPlayed(true);
            }
            break;
        }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Daily Scratch Card</h2>
        
        {hasPlayed && !isComplete ? (
            <p className="text-theme-primary font-semibold">You've already played today. Come back tomorrow for another chance!</p>
        ) : (
            <p className="text-theme-secondary">Match 3 symbols to win a Fuel prize!</p>
        )}
        
        <div className="grid grid-cols-3 gap-2 aspect-square">
            {grid.map((prize, index) => (
                <div key={index} className="relative w-full h-full rounded-lg bg-theme-primary flex items-center justify-center" onClick={() => handleScratch(index)}>
                    <div className={`absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-lg transition-opacity duration-500 ${revealed[index] ? 'opacity-0' : 'opacity-100'} cursor-pointer`}></div>
                    <span className="text-4xl transition-transform duration-500" style={{ transform: revealed[index] ? 'scale(1)' : 'scale(0)' }}>
                        {prize.symbol}
                    </span>
                </div>
            ))}
        </div>

        <div className="h-12 flex items-center justify-center">
            {isComplete && wonPrize && (
                 <div className="animate-fade-in-up">
                    <p className="text-xl font-bold text-green-400">You won +{wonPrize.value} Fuel!</p>
                </div>
            )}
        </div>
        
        <button onClick={onClose} className="w-full bg-theme-tertiary text-theme-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors">
            Close
        </button>
      </div>
    </div>
  );
};

export default ScratchCardModal;
