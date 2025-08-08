import React, { useState } from 'react';
import { calculatorDescriptions } from '../data/calculatorDescriptions';

interface CalculatorFaqsProps {
  calculatorName: string;
}

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-outline-variant">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-3 px-1"
      >
        <h3 className="font-semibold text-on-surface">{q}</h3>
        <svg
          className={`w-5 h-5 text-on-surface-variant transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-3 px-1 text-on-surface-variant text-sm">
          <p>{a}</p>
        </div>
      )}
    </div>
  );
};

const CalculatorFaqs: React.FC<CalculatorFaqsProps> = ({ calculatorName }) => {
  const content = calculatorDescriptions[calculatorName];

  if (!content || !content.faqs || content.faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface-container rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-primary mb-2">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {content.faqs.map((faq, index) => (
            <FAQItem key={index} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorFaqs;
