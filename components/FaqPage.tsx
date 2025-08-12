import React, { useState, useMemo } from 'react';
import { calculatorDescriptions } from '../data/calculatorDescriptions';
import { calculatorsData } from '../data/calculators';
import AdsensePlaceholder from './AdsensePlaceholder';
import CalculatorLinkCard from './CalculatorLinkCard';

interface FaqItem {
  q: string;
  a: string;
  calculatorName: string;
}

const FAQItem: React.FC<{ faq: FaqItem; onSelectCalculator: (name: string) => void; showAd?: boolean }> = ({ faq, onSelectCalculator, showAd }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-outline-variant">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
        aria-expanded={isOpen}
      >
        <div className="flex-grow">
            <p className="text-xs font-bold uppercase text-primary tracking-wider mb-1">{faq.calculatorName}</p>
            <h3 className="font-semibold text-on-surface">{faq.q}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-on-surface-variant transform transition-transform flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-on-surface-variant text-sm animate-fade-in space-y-4">
          <p>{faq.a}</p>
          <CalculatorLinkCard name={faq.calculatorName} onSelect={onSelectCalculator} />
          {showAd && (
            <div className="mt-4">
              <AdsensePlaceholder />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FaqPage: React.FC<{ onBack: () => void; onSelectCalculator: (name: string) => void; }> = ({ onBack, onSelectCalculator }) => {
  
  const allFaqs = useMemo(() => {
    const allCalculators = calculatorsData.flatMap(cat => cat.items);
    const importantCalculatorNames = new Set(allCalculators.filter(c => c.isPremium).map(c => c.name));

    const allRawFaqs: FaqItem[] = allCalculators.flatMap(item => 
        (calculatorDescriptions[item.name]?.faqs || []).map(faq => ({ ...faq, calculatorName: item.name }))
    );

    const importantFaqs = allRawFaqs.filter(faq => importantCalculatorNames.has(faq.calculatorName));
    const regularFaqs = allRawFaqs.filter(faq => !importantCalculatorNames.has(faq.calculatorName));

    // Shuffle both lists independently using Fisher-Yates algorithm
    for (let i = importantFaqs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [importantFaqs[i], importantFaqs[j]] = [importantFaqs[j], importantFaqs[i]];
    }
    for (let i = regularFaqs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [regularFaqs[i], regularFaqs[j]] = [regularFaqs[j], regularFaqs[i]];
    }
    
    return [...importantFaqs, ...regularFaqs];
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="page-header p-4 flex items-center shadow-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Go back to home page">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold ml-4">Frequently Asked Questions</h1>
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <div className="bg-surface-container rounded-xl shadow-lg p-6">
            <div className="space-y-2">
            {allFaqs.map((faq, index) => (
                <FAQItem 
                    key={`${faq.calculatorName}-${index}`} 
                    faq={faq} 
                    onSelectCalculator={onSelectCalculator} 
                    showAd={(index > 0 && (index + 1) % 5 === 0)} // Show ad inside every 5th item when expanded
                />
            ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;