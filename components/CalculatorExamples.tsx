import React from 'react';
import { calculatorDescriptions } from '../data/calculatorDescriptions';
import { useTheme } from '../contexts/ThemeContext';

interface CalculatorExamplesProps {
  calculatorName: string;
}

const CalculatorExamples: React.FC<CalculatorExamplesProps> = ({ calculatorName }) => {
  const content = calculatorDescriptions[calculatorName];
  const { formatCurrency } = useTheme();

  if (!content || !content.examples || content.examples.length === 0) {
    return null;
  }

  const formatValue = (key: string, value: any): string => {
      if (typeof value === 'number' && (key.toLowerCase().includes('price') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('value') || key.toLowerCase().includes('principal') || key.toLowerCase().includes('investment'))) {
          return formatCurrency(value);
      }
      if (typeof value === 'number' && (key.toLowerCase().includes('percent') || key.toLowerCase().includes('rate'))) {
          return `${value}%`;
      }
      return String(value);
  };

  return (
    <div className="bg-surface-container rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-primary mb-4">Examples</h2>
        <div className="space-y-4">
          {content.examples.map((example, index) => (
            <div key={index} className="bg-surface-container-low p-4 rounded-lg">
              <h4 className="font-semibold text-on-surface mb-2">{example.title}</h4>
              <div className="text-sm text-on-surface-variant mb-3">
                <p>{example.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3 p-3 bg-surface-container rounded-md">
                  {Object.entries(example.inputs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-semibold text-on-surface">{formatValue(key, value)}</span>
                      </div>
                  ))}
              </div>
              <div className="bg-surface-container-high p-3 rounded-md text-center">
                  <p className="text-sm font-semibold text-on-surface-variant">Result:</p>
                  <p className="font-bold text-primary">{example.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorExamples;