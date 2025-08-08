import React, { useState, useMemo, useEffect } from 'react';
import { calculatorsData } from '../data/calculators';
import CalculatorCard from './CalculatorCard';
import VoiceInputButton from './VoiceInputButton';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (name: string, isPremium?: boolean) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectCalculator }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset search when opening
      setSearchQuery('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) {
        return [];
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return calculatorsData
        .flatMap(category => category.items)
        .filter(item => 
            item.name.toLowerCase().includes(lowerCaseQuery)
        );
  }, [searchQuery]);

  const handleSelect = (name: string, isPremium?: boolean) => {
    onSelectCalculator(name, isPremium);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-fade-in" onClick={onClose}>
      <div className="flex-shrink-0 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Search for a calculator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full p-4 pl-12 pr-12 text-lg focus:ring-2 transition"
            autoFocus
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface-variant" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
            <VoiceInputButton onTranscript={setSearchQuery} />
            <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high" aria-label="Close search">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>
      <div className="search-modal-container p-4" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-3xl mx-auto">
            {searchQuery.trim() && filteredCalculators.length === 0 ? (
                <div className="text-center text-on-surface-variant py-16">
                    <p className="font-semibold">No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try searching for something else.</p>
                </div>
            ) : (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredCalculators.map((item) => (
                        <CalculatorCard key={item.name} name={item.name} icon={item.icon} isPremium={item.isPremium} onClick={() => handleSelect(item.name, item.isPremium)} />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;