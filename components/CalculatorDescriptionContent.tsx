import React from 'react';
import { calculatorDescriptions } from '../data/calculatorDescriptions';

interface CalculatorDescriptionContentProps {
  calculatorName: string;
}

const CalculatorDescriptionContent: React.FC<CalculatorDescriptionContentProps> = ({ calculatorName }) => {
  const content = calculatorDescriptions[calculatorName];

  if (!content) {
    return null; // Don't render if no description is available
  }

  return (
    <div className="bg-surface-container rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-primary mb-2">About the {calculatorName}</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed">{content.description}</p>
      </div>
    </div>
  );
};

export default CalculatorDescriptionContent;
