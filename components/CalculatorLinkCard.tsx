import React, { useMemo } from 'react';
import { calculatorsData } from '../data/calculators';

interface CalculatorLinkCardProps {
  name: string;
  onSelect: (name: string) => void;
}

const CalculatorLinkCard: React.FC<CalculatorLinkCardProps> = ({ name, onSelect }) => {
  const calculator = useMemo(() => {
    return calculatorsData.flatMap(cat => cat.items).find(item => item.name === name);
  }, [name]);

  if (!calculator) {
    return (
        <div className="calculator-link-card opacity-50 cursor-not-allowed">
            <p className="font-semibold text-on-surface-variant">Calculator "{name}" not found.</p>
        </div>
    );
  }

  return (
    <button onClick={() => onSelect(name)} className="calculator-link-card w-full">
        <div className="mr-4 flex-shrink-0">
            {calculator.icon}
        </div>
        <div className="text-left">
            <p className="text-xs text-primary font-bold">TRY THE TOOL</p>
            <p className="font-semibold text-on-surface">{calculator.name}</p>
        </div>
         <div className="ml-auto text-on-surface-variant">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </button>
  );
};

export default CalculatorLinkCard;