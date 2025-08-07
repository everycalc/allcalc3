import React, { useState, useEffect } from 'react';
import { useFuel } from '../contexts/FuelContext';

interface SpinTheWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const prizes = [
    { value: 1, label: '+1 Fuel', color: '#4ade80' },
    { value: 2, label: '+2 Fuel', color: '#22d3ee' },
    { value: 5, label: '+5 Fuel', color: '#facc15' },
    { value: 1, label: '+1 Fuel', color: '#4ade80' },
    { value: 2, label: '+2 Fuel', color: '#22d3ee' },
    { value: 10, label: '+10 Fuel!', color: '#f97316' },
];

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const SpinTheWheelModal: React.FC<SpinTheWheelModalProps> = ({ isOpen, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const { addFuel } = useFuel();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const lastSpinDate = localStorage.getItem('lastSpinDate');
      if (lastSpinDate === getTodayDateString()) {
        setHasSpunToday(true);
      } else {
        setHasSpunToday(false);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const resetWheel = () => {
      setIsSpinning(false);
      setResult(null);
      setRotation(0);
  }

  const handleClose = () => {
      resetWheel();
      onClose();
  }

  const handleSpin = () => {
    if (isSpinning || hasSpunToday) return;
    setIsSpinning(true);
    setResult(null);

    const resultIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[resultIndex];
    
    const segmentAngle = 360 / prizes.length;
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const targetRotation = 360 - (resultIndex * segmentAngle + randomOffset);
    const finalRotation = targetRotation + 360 * 10;
    
    setRotation(finalRotation);

    setTimeout(() => {
      addFuel(prize.value);
      setResult(prize.value);
      localStorage.setItem('lastSpinDate', getTodayDateString());
      setHasSpunToday(true);
    }, 6000); 
  };
  
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Spin the Wheel!</h2>
        <p className="text-theme-secondary">Spin once a day for a chance to win bonus Fuel!</p>
        
        <div className="relative w-64 h-64 mx-auto my-4">
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-10" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>
                <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 40L0.557723 10L29.4423 10L15 40Z" fill="var(--color-primary)"/>
                </svg>
            </div>
            <div 
                className={`w-full h-full rounded-full transition-transform duration-[6000ms] ${isSpinning ? 'wheel-spinning' : ''}`}
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                    {prizes.map((prize, i) => {
                        const [startX, startY] = getCoordinatesForPercent(i / prizes.length);
                        const [endX, endY] = getCoordinatesForPercent((i + 1) / prizes.length);
                        const largeArcFlag = 1 / prizes.length > 0.5 ? 1 : 0;
                        const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
                        const textAngle = (i + 0.5) * (360 / prizes.length);
                        return (
                            <g key={i}>
                                <path d={pathData} fill={prize.color}></path>
                                <text 
                                    x="0.6" y="0" 
                                    transform={`rotate(${textAngle})`} 
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    fontSize="0.15" fill="#fff" fontWeight="bold"
                                >{prize.label}</text>
                            </g>
                        )
                    })}
                </svg>
            </div>
        </div>

        {result !== null && (
            <div className="animate-fade-in-up h-8">
                <p className="text-xl font-bold text-green-400">You won +{result} Fuel!</p>
            </div>
        )}
        
        {result === null ? (
            <button onClick={handleSpin} disabled={isSpinning || hasSpunToday} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors disabled:bg-theme-tertiary disabled:cursor-not-allowed h-12">
                {isSpinning ? 'Spinning...' : hasSpunToday ? 'Already Spun Today' : 'Spin!'}
            </button>
        ) : (
            <button onClick={handleClose} className="w-full bg-theme-tertiary text-theme-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors h-12">
                Close
            </button>
        )}
      </div>
    </div>
  );
};

export default SpinTheWheelModal;