import React, { useState, useRef, useEffect } from 'react';
import AdsensePlaceholder from './AdsensePlaceholder';
import CalculatorHistoryView from './CalculatorHistoryView';
import ExportControls from './ExportControls';
import { calculatorsData } from '../data/calculators';
import TabButton from './TabButton';
import CalculatorDescriptionContent from './CalculatorDescriptionContent';
import CalculatorFaqs from './CalculatorFaqs';
import RelatedBlogs from './RelatedBlogs';
import RelatedCalculatorLink from './RelatedCalculatorLink';
import CalculatorExamples from './CalculatorExamples';

interface RelatedCalculatorsProps {
    currentCalculatorName: string;
    onSelectCalculator: (name: string) => void;
}

const RelatedCalculatorsSection: React.FC<RelatedCalculatorsProps> = ({ currentCalculatorName, onSelectCalculator }) => {
    type CalculatorWithRelated = {
        name: string;
        icon: React.ReactNode;
        isPremium?: boolean;
        related?: string[];
    };

    const allCalculators = calculatorsData.flatMap(cat => cat.items) as CalculatorWithRelated[];
    const currentCalc = allCalculators.find(c => c.name === currentCalculatorName);
    
    let relatedCalcs = (currentCalc?.related ?? [])
        .map(name => allCalculators.find(c => c.name === name))
        .filter((c): c is CalculatorWithRelated => Boolean(c));

    if (relatedCalcs.length < 4) {
        const existingNames = new Set([currentCalculatorName, ...relatedCalcs.map(c => c.name)]);
        const potentialAdditions = allCalculators.filter(c => !existingNames.has(c.name));
        const shuffled = potentialAdditions.sort(() => 0.5 - Math.random());
        
        while (relatedCalcs.length < 4 && shuffled.length > 0) {
            relatedCalcs.push(shuffled.pop()!);
        }
    }
    
    if (relatedCalcs.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-primary mb-4">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedCalcs.slice(0, 4).map(calc => calc && (
                     <RelatedCalculatorLink
                        key={calc.name}
                        name={calc.name}
                        icon={calc.icon}
                        onClick={() => onSelectCalculator(calc.name)}
                    />
                ))}
            </div>
        </div>
    );
}


interface CalculatorPageWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  isEmbed: boolean;
  onOpenEmbedModal: () => void;
  onSelectCalculator: (name: string) => void;
  onSelectBlogPost: (slug: string) => void;
}

const CalculatorPageWrapper: React.FC<CalculatorPageWrapperProps> = ({ title, onBack, children, isEmbed, onOpenEmbedModal, onSelectCalculator, onSelectBlogPost }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab('calculator');
  }, [title]);

  if (isEmbed) {
    return (
        <div className="p-4 relative min-h-[600px]">
            {children}
            <a 
                href={window.location.origin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute bottom-2 right-2 text-xs text-gray-400 hover:text-primary z-10"
            >
                Powered by All Calculation
            </a>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="page-header p-4 flex items-center justify-between text-on-surface">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Go back to home page">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            </button>
            <h1 className="text-xl font-bold ml-4">{title}</h1>
        </div>
      </header>
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
            <div className="tabs-container">
              <TabButton label="Calculator" isActive={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} />
              <TabButton label="History" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
            </div>

            {activeTab === 'calculator' && (
              <div className="animate-fade-in">
                <div className="calculator-wrapper-card p-4 md:p-6">
                    <div ref={contentRef}>{children}</div>
                </div>
                <ExportControls 
                  contentRef={contentRef} 
                  calculatorName={title} 
                  onOpenEmbedModal={onOpenEmbedModal}
                />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="animate-fade-in">
                <CalculatorHistoryView calculatorName={title} />
              </div>
            )}

            <div className="mt-8 space-y-8">
                <CalculatorDescriptionContent calculatorName={title} />
                <AdsensePlaceholder />
                <CalculatorExamples calculatorName={title} />
                <CalculatorFaqs calculatorName={title} />
                <AdsensePlaceholder />
                <RelatedBlogs calculatorName={title} onSelectBlogPost={onSelectBlogPost} />
            </div>

            <RelatedCalculatorsSection currentCalculatorName={title} onSelectCalculator={onSelectCalculator} />

        </div>
      </main>
    </div>
  );
};

export default CalculatorPageWrapper;