import React, { useState, useMemo, useEffect, useRef } from 'react';
import CalculatorCard from './CalculatorCard';
import { useTheme } from '../contexts/ThemeContext';
import AdsensePlaceholder from './AdsensePlaceholder';
import RecentHistory from './RecentHistory';
import { HistoryEntry } from '../contexts/HistoryContext';
import { calculatorsData } from '../data/calculators';
import Logo from './Logo';
import CalculatorCarousel from './CalculatorCarousel';
import PinningGuide from './PinningGuide';


interface HomePageProps {
  onSelectCalculator: (name: string, isPremium?: boolean) => void;
  onToggleSidebar: () => void;
  onToggleHistoryPanel: () => void;
  onRestoreFromHistory: (entry: HistoryEntry) => void;
  onShowPolicyPage: (page: string) => void;
}

const suggestedCalculatorNames = [
    'SIP Calculator',
    'BMI Calculator',
    'Age Calculator',
    'Loan Calculator',
    'Discount Calculator',
    'Fuel Cost Calculator',
    'E-commerce Profit Calculator',
];

const Footer: React.FC<{ onShowPolicyPage: (page: string) => void }> = ({ onShowPolicyPage }) => {
  return (
    <footer className="w-full mt-12 py-6 border-t border-theme text-center text-sm text-theme-secondary">
      <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2">
        <button onClick={() => onShowPolicyPage('about')} className="hover:text-primary hover:underline">About Us</button>
        <span className="opacity-50 hidden sm:inline">|</span>
        <button onClick={() => onShowPolicyPage('privacy')} className="hover:text-primary hover:underline">Privacy Policy</button>
        <span className="opacity-50 hidden sm:inline">|</span>
        <button onClick={() => onShowPolicyPage('terms')} className="hover:text-primary hover:underline">Terms of Service</button>
         <span className="opacity-50 hidden sm:inline">|</span>
        <button onClick={() => onShowPolicyPage('disclaimer')} className="hover:text-primary hover:underline">Disclaimer</button>
      </div>
      <p className="mt-4 opacity-75">&copy; {new Date().getFullYear()} All Calculation. All rights reserved.</p>
    </footer>
  );
};


const HomePage: React.FC<HomePageProps> = ({ onSelectCalculator, onToggleSidebar, onToggleHistoryPanel, onRestoreFromHistory, onShowPolicyPage }) => {
    const { homeLayout, pinnedCalculators, sectionOrder } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isPinningGuideOpen, setIsPinningGuideOpen] = useState(false);
    const pinGuideTriggeredRef = useRef(false);
    
    // Onboarding flow: Show pinning guide after welcome guide is done and user scrolls.
    useEffect(() => {
        const handleScroll = () => {
            const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
            const hasSeenPinningGuide = sessionStorage.getItem('hasSeenPinningGuide');

            if (hasSeenOnboarding && !hasSeenPinningGuide && !pinGuideTriggeredRef.current && window.scrollY > 100) {
                setIsPinningGuideOpen(true);
                pinGuideTriggeredRef.current = true; // Ensure it only triggers once per session
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Improved search bar: close on scroll or outside click
    useEffect(() => {
        const handleScroll = () => {
            if (isSearchVisible) {
                setIsSearchVisible(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (isSearchVisible && searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchVisible(false);
            }
        };

        if (isSearchVisible) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchVisible]);


    // Close filter dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const allCalculatorsFlat = useMemo(() => calculatorsData.flatMap(cat => cat.items), []);
    
    const suggestedCalculators = useMemo(() => {
        return suggestedCalculatorNames
            .map(name => allCalculatorsFlat.find(calc => calc.name === name))
            .filter((item): item is NonNullable<typeof item> => !!item);
    }, [allCalculatorsFlat]);

    const pinnedItems = useMemo(() => {
        return pinnedCalculators
            .map(pinnedName => allCalculatorsFlat.find(calc => calc.name === pinnedName))
            .filter((item): item is NonNullable<typeof item> => !!item);
    }, [pinnedCalculators, allCalculatorsFlat]);


    const filteredAndSortedSections = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        
        let sections = calculatorsData
            .map(category => ({
                ...category,
                items: category.items.filter(item => 
                    item.name.toLowerCase().includes(lowerCaseQuery) && !pinnedCalculators.includes(item.name)
                )
            }))
            .filter(category => category.items.length > 0);

        if (filter !== 'All') {
            sections = sections.filter(c => c.category === filter);
        }
        
        // Use the order from context
        return sections.sort((a, b) => sectionOrder.indexOf(a.category) - sectionOrder.indexOf(b.category));

    }, [searchQuery, filter, sectionOrder, pinnedCalculators]);
    
    const renderCalculators = (category: any) => {
        const premiumBadge = <span className="ml-2 text-xs font-bold uppercase text-on-primary bg-primary px-1.5 py-0.5 rounded-full flex-shrink-0">Premium</span>;

        switch(homeLayout) {
            case 'detailedList':
                return (
                    <div className="space-y-1">
                        {category.items.map((item: any) => (
                            <button key={item.name} onClick={() => onSelectCalculator(item.name, item.isPremium)} className="w-full flex items-center p-3 rounded-lg hover:bg-theme-secondary transition-colors text-left">
                               <div className="mr-4 flex-shrink-0 w-8 h-8">{item.icon}</div>
                               <div className="flex items-center justify-between flex-grow min-w-0">
                                   <span className="font-medium text-theme-primary truncate">{item.name}</span>
                                   {item.isPremium && premiumBadge}
                               </div>
                            </button>
                        ))}
                    </div>
                );
            case 'compactList':
                return (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
                        {category.items.map((item: any) => (
                            <li key={item.name}>
                                <button onClick={() => onSelectCalculator(item.name, item.isPremium)} className="w-full text-left p-1.5 rounded-md hover:bg-theme-secondary transition-colors text-sm text-theme-primary flex items-center">
                                    <div className="flex items-center justify-between flex-grow min-w-0">
                                        <span className="truncate">{item.name}</span>
                                        {item.isPremium && premiumBadge}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                );
            case 'grid':
            default:
                return (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {category.items.map((item: any) => (
                            <CalculatorCard key={item.name} name={item.name} icon={item.icon} isPremium={item.isPremium} onClick={() => onSelectCalculator(item.name, item.isPremium)} />
                        ))}
                    </div>
                );
        }
    }
    
    const renderAllSections = () => {
        return filteredAndSortedSections.map((category, index) => (
            <React.Fragment key={category.category}>
                <section className="mb-8" aria-labelledby={category.category.replace(/\s+/g, '-')}>
                    <h2 id={category.category.replace(/\s+/g, '-')} className={`text-2xl font-semibold mb-4 text-theme-primary`}>{category.category}</h2>
                    {renderCalculators(category)}
                </section>
                {(index + 1) % 3 === 0 && <AdsensePlaceholder />}
            </React.Fragment>
        ));
    };
    
    // Select the second suggested calculator as the target for the pinning guide.
    const pinTargetName = suggestedCalculators.length > 1 ? suggestedCalculators[1].name : undefined;

    return (
        <div className="flex flex-col min-h-screen">
            <PinningGuide 
                isOpen={isPinningGuideOpen} 
                onClose={() => {
                    setIsPinningGuideOpen(false);
                    sessionStorage.setItem('hasSeenPinningGuide', 'true');
                }} 
            />
             <header 
                className={`sticky top-0 z-20 flex items-center justify-between p-4 shadow-md bg-primary text-on-primary transition-colors`}
            >
                <button onClick={onToggleSidebar} id="onboarding-sidebar-toggle" className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Open sidebar menu">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    <Logo />
                    <h1 className="text-xl font-bold">All Calculation</h1>
                </div>
                <button onClick={() => setIsSearchVisible(p => !p)} id="onboarding-search-toggle" className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Search calculators">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </header>

            <main className="flex-grow p-4">

                {isSearchVisible && (
                     <div ref={searchContainerRef} className="bg-theme-secondary/80 backdrop-blur-sm p-4 rounded-xl shadow sticky top-20 z-10 mb-6 animate-fade-in-down">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <input
                                type="text"
                                placeholder="Search for a calculator..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-theme-primary text-theme-primary rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                            />
                            <div className="flex items-center space-x-2">
                                <div className="relative" ref={filterRef}>
                                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-3 bg-theme-primary rounded-md hover:bg-theme-tertiary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-theme-secondary" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
                                    </button>
                                    {isFilterOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-theme-secondary rounded-md shadow-lg z-20 py-1">
                                            <button onClick={() => {setFilter('All'); setIsFilterOpen(false);}} className="block w-full text-left px-4 py-2 text-sm text-theme-primary hover:bg-theme-tertiary">All</button>
                                            {calculatorsData.map(c => <button key={c.category} onClick={() => {setFilter(c.category); setIsFilterOpen(false);}} className="block w-full text-left px-4 py-2 text-sm text-theme-primary hover:bg-theme-tertiary">{c.category}</button>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <section className="mb-8" aria-labelledby="suggested-calculators">
                    <h2 id="suggested-calculators" className="text-2xl font-semibold mb-4 text-theme-primary flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 112 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6H6a1 1 0 110-2h1V3a1 1 0 01-1-1zm11 1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0V6h1a1 1 0 100-2h-1V3zM4 12a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H5a1 1 0 01-1-1zm11 1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" clipRule="evenodd" /></svg>
                        Suggested For You
                    </h2>
                    <CalculatorCarousel items={suggestedCalculators} onSelectCalculator={onSelectCalculator} pinTargetName={pinTargetName} />
                </section>
               
                {pinnedItems.length > 0 && (
                    <section className="mb-8" aria-labelledby="pinned-calculators">
                        <h2 id="pinned-calculators" className="text-2xl font-semibold mb-4 text-theme-primary flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                               <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                            </svg>
                            Pinned
                        </h2>
                        <CalculatorCarousel items={pinnedItems} onSelectCalculator={onSelectCalculator} />
                    </section>
                )}

                <RecentHistory onToggleHistoryPanel={onToggleHistoryPanel} onRestore={onRestoreFromHistory} />
                
                <div>{renderAllSections()}</div>

                <Footer onShowPolicyPage={onShowPolicyPage} />
            </main>
        </div>
    );
};

export default HomePage;