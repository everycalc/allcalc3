import React, { useState } from 'react';
import { calculatorDescriptions } from '../data/calculatorDescriptions';

interface CalculatorDescriptionProps {
  calculatorName: string;
}

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-theme">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-3 px-1"
      >
        <h3 className="font-semibold text-theme-primary">{q}</h3>
        <svg
          className={`w-5 h-5 text-theme-secondary transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-3 px-1 text-theme-secondary text-sm">
          <p>{a}</p>
        </div>
      )}
    </div>
  );
};

const CalculatorDescription: React.FC<CalculatorDescriptionProps> = ({ calculatorName }) => {
  const content = calculatorDescriptions[calculatorName];

  if (!content) {
    return null; // Don't render if no description is available
  }

  return (
    <div className="bg-theme-secondary rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-primary mb-2">About the {calculatorName}</h2>
        <p className="text-theme-secondary text-sm">{content.description}</p>
      </div>
      {content.faqs && content.faqs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-primary mb-2">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {content.faqs.map((faq, index) => (
              <FAQItem key={index} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorDescription;