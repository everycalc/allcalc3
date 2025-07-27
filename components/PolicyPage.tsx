import React from 'react';
import AdsensePlaceholder from './AdsensePlaceholder';

interface PolicyPageProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ title, onBack, children }) => {
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
      
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-theme-secondary rounded-xl shadow-lg p-6">
            {children}
        </div>
        <div className="max-w-4xl mx-auto mt-8">
            <AdsensePlaceholder />
        </div>
      </main>
    </div>
  );
};

export default PolicyPage;
