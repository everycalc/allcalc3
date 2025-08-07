import React, { useState, useRef } from 'react';
import AdsensePlaceholder from './AdsensePlaceholder';
import CalculatorHistoryView from './CalculatorHistoryView';
import { useFuel } from '../contexts/FuelContext';
import CalculatorDescription from './CalculatorDescription';
import ExportControls from './ExportControls';
import RewardedAdModal from './RewardedAdModal';
import PdfFuelModal from './PdfFuelModal';
import { calculatorsData } from '../data/calculators';

interface RelatedCalculatorsProps {
    currentCalculatorName: string;
    onSelectCalculator: (name: string, isPremium?: boolean) => void;
}

const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({ currentCalculatorName, onSelectCalculator }) => {
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

    // Ensure there are at least 4 related calculators by adding random ones
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedCalcs.slice(0, 4).map(calc => calc && (
                    <button 
                        key={calc.name} 
                        onClick={() => onSelectCalculator(calc.name, calc.isPremium)}
                        className="p-4 rounded-xl bg-theme-secondary shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform text-center"
                    >
                        <div className="mx-auto w-8 h-8 mb-2">{calc.icon}</div>
                        <p className="text-sm font-medium text-theme-primary">{calc.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}


interface CalculatorPageWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  isPremium: boolean;
  isEmbed: boolean;
  onOpenEmbedModal: () => void;
  onSelectCalculator: (name: string, isPremium?: boolean) => void;
}

const CalculatorPageWrapper: React.FC<CalculatorPageWrapperProps> = ({ title, onBack, children, isPremium, isEmbed, onOpenEmbedModal, onSelectCalculator }) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const { fuel, addFuel } = useFuel();
  const fuelCost = isPremium ? 2 : 1;
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State for export modals
  const [showPdfFuelModal, setShowPdfFuelModal] = useState<number | null>(null);
  const [showImageFuelModal, setShowImageFuelModal] = useState<number | null>(null);
  const [showRefuelModal, setShowRefuelModal] = useState(false);
  const [onRefuelSuccess, setOnRefuelSuccess] = useState<(() => void) | null>(null);

  const TabButton: React.FC<{label: string, name: 'calculator' | 'history'}> = ({label, name}) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`w-1/2 py-3 text-center font-semibold border-b-2 transition-colors ${
        activeTab === name
          ? 'border-primary text-primary'
          : 'border-transparent text-theme-secondary hover:text-primary'
      }`}
    >
      {label}
    </button>
  );
  
  if (isEmbed) {
    return (
        <div className="p-4 relative min-h-[600px] bg-theme-primary text-theme-primary">
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
  
  const handleRefuel = (onSuccess: () => void) => {
    setShowPdfFuelModal(null);
    setShowImageFuelModal(null);
    setOnRefuelSuccess(() => onSuccess);
    setShowRefuelModal(true);
  };
  
  const handleRefuelComplete = () => {
    // This logic is now handled centrally in the Sidebar component
    // Kept here for potential future direct refueling actions
    const reward = Math.floor(Math.random() * 5) + 6;
    addFuel(reward);
    alert(`You received ${reward} bonus fuel!`);
    setShowRefuelModal(false);
    if(onRefuelSuccess) {
      onRefuelSuccess();
      setOnRefuelSuccess(null);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-theme-primary">
      {showPdfFuelModal !== null && <PdfFuelModal isOpen={true} onClose={() => setShowPdfFuelModal(null)} cost={showPdfFuelModal} onRefuel={() => handleRefuel(() => {})} />}
      {showImageFuelModal !== null && <PdfFuelModal isOpen={true} onClose={() => setShowImageFuelModal(null)} cost={showImageFuelModal} onRefuel={() => handleRefuel(() => {})} />}
      {showRefuelModal && <RewardedAdModal onClose={() => setShowRefuelModal(false)} onComplete={handleRefuelComplete} />}

      <header className="bg-theme-secondary/80 backdrop-blur-sm p-4 flex items-center justify-between shadow-md sticky top-0 z-10 text-theme-primary">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Go back to home page">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            </button>
            <h1 className="text-xl font-bold ml-4">{title}</h1>
        </div>
        {fuel > 0 && (
          <div className="flex items-center space-x-2 text-sm bg-theme-primary/50 px-3 py-1 rounded-full">
              <span className="text-theme-secondary">Fuel:</span>
              <span className="font-bold text-primary">{fuel}</span>
              <div className="w-px h-4 bg-theme-tertiary"></div>
              <span className="font-bold text-red-500">-{fuelCost}</span>
          </div>
        )}
      </header>
      
      <main className="flex-grow p-4">
        <div className="max-w-xl mx-auto">
            <div ref={contentRef} className="bg-theme-secondary rounded-xl shadow-lg">
                <div className="flex border-b border-theme">
                    <TabButton label={title} name="calculator" />
                    <TabButton label="History" name="history" />
                </div>
                <div className="p-4 md:p-6">
                    {activeTab === 'calculator' && children}
                    {activeTab === 'history' && <CalculatorHistoryView calculatorName={title} />}
                </div>
            </div>
            
            {activeTab === 'calculator' && (
              <>
                <ExportControls 
                  contentRef={contentRef} 
                  calculatorName={title} 
                  onOpenEmbedModal={onOpenEmbedModal}
                  onShowPdfFuelModal={setShowPdfFuelModal}
                  onShowImageFuelModal={setShowImageFuelModal}
                />

                <div className="mt-8">
                  <CalculatorDescription calculatorName={title} />
                </div>

                <RelatedCalculators currentCalculatorName={title} onSelectCalculator={onSelectCalculator} />
              </>
            )}

            <div className="mt-8">
              <AdsensePlaceholder />
            </div>
        </div>
      </main>
    </div>
  );
};

export default CalculatorPageWrapper;