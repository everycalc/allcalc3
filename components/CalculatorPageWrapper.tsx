
import React, { useState, useEffect } from 'react';
import AdsensePlaceholder from './AdsensePlaceholder';
import CalculatorHistoryView from './CalculatorHistoryView';
import TimedShareToast from './TimedShareToast';
import ShareButton from './ShareButton'; // Share logic is in ShareButton

interface CalculatorPageWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const CalculatorPageWrapper: React.FC<CalculatorPageWrapperProps> = ({ title, onBack, children }) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!sessionStorage.getItem('hasSeenTimedShare')) {
            setShowShareToast(true);
            sessionStorage.setItem('hasSeenTimedShare', 'true');
        }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen bg-theme-primary">
      <header className="bg-theme-secondary/80 backdrop-blur-sm p-4 flex items-center shadow-md sticky top-0 z-10 text-theme-primary">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Go back to home page">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold ml-4">{title}</h1>
      </header>
      
      <main className="flex-grow p-4">
        <div className="max-w-xl mx-auto">
            <div className="bg-theme-secondary rounded-xl shadow-lg">
                <div className="flex border-b border-theme">
                    <TabButton label={title} name="calculator" />
                    <TabButton label="History" name="history" />
                </div>
                <div className="p-4 md:p-6">
                    {activeTab === 'calculator' && children}
                    {activeTab === 'history' && <CalculatorHistoryView calculatorName={title} />}
                </div>
            </div>
            <div className="mt-8">
              <AdsensePlaceholder />
            </div>
        </div>
      </main>
      <TimedShareToast 
        isOpen={showShareToast} 
        onClose={() => setShowShareToast(false)} 
        textToShare={`Check out this awesome calculator app! I'm using the ${title}. You can find it here: ${window.location.origin}`}
      />
    </div>
  );
};

export default CalculatorPageWrapper;
