
import React, { useState, useMemo, useEffect, useRef } from 'react';
import CalculatorCard from './CalculatorCard';
import { useTheme } from '../contexts/ThemeContext';
import AdsensePlaceholder from './AdsensePlaceholder';
import RecentHistory from './RecentHistory';
import { HistoryEntry } from '../contexts/HistoryContext';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


interface HomePageProps {
  onSelectCalculator: (name: string, isPremium?: boolean) => void;
  onToggleSidebar: () => void;
  onToggleHistoryPanel: () => void;
  onRestoreFromHistory: (entry: HistoryEntry) => void;
}

// Icons
const AreaIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const VolumeIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0-10 10c0 4.42 3.58 8 8 8s8-3.58 8-8"></path><path d="M2 12h20"></path></svg>;
const BmiIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10m0-4V4m-6 16V4m6 1h-4.5a2.5 2.5 0 0 0 0 5H18m-6 1h-2a2 2 0 0 0 0 4h2m0 1h-4.5a2.5 2.5 0 0 0 0 5H18"></path></svg>;
const StandardIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><line x1="16" y1="10" x2="12" y2="10"></line><line x1="12" y1="14" x2="8" y2="14"></line><line x1="12" y1="18" x2="8" y2="18"></line><line x1="8" y1="10" x2="8" y2="10"></line></svg>;
const ScientificIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.37 2.63L14 7l-1.4-1.4a2.83 2.83 0 0 0-4 0L3 11.2V14l6.6-6.6a2.83 2.83 0 0 1 4 0L17 10l5-5-2.63-2.37z"></path><path d="M21 12v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4"></path><path d="M16 12h2"></path><path d="M12 16h2"></path></svg>;
const LoanIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const UnitIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path></svg>;
const AgeIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>;
const ProfitMarginIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8.11 2.79"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>;
const DiscountIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line><line x1="15" y1="8" x2="9" y2="14"></line><circle cx="12" cy="11" r="1"></circle><circle cx="12" cy="11" r="1"></circle></svg>;
const BreakEvenIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8.3a4 4 0 0 1-5.7 5.7l-4.3 4.3"></path><path d="M3 12.7L18 3"></path></svg>;
const ROASIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path><path d="M9 7h6"></path><path d="M9 11h6"></path><path d="M9 15h2"></path></svg>;
const CLVCACIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const InventoryIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"></path><polygon points="21 10 12 10 12 22 21 22"></polygon><line x1="7" y1="15" x2="9" y2="15"></line></svg>;
const ECommerceIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const SIPFDRIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path><path d="M16 8l-4 4-4-4"></path><path d="M12 16V8"></path></svg>;
const HomeLoanIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const RentBuyIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>;
const PercentageIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>;
const ScienceIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const CurrencyIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>;
const FuelIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3"></path><path d="M14 11h6.5a1.5 1.5 0 0 1 0 3H14v-3z"></path></svg>;
const RecipeIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const ProductCostIcon = () => <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8.2c2.5-2 6.3-2.4 8.8-1.2 2.5 1.2 3.2 4.2 1.2 6.5-2 2.3-5.5 2.8-8 1.5"></path><path d="M4.2 14c-1.2 2.5.8 5.5 3.3 6.5s5.5.8 6.5-1.8"></path><path d="M12 17.8c-2.5 2-6.3 2.4-8.8 1.2-2.5-1.2-3.2-4.2-1.2-6.5 2-2.3 5.5-2.8 8-1.5"></path><path d="M19.8 10c1.2-2.5-.8-5.5-3.3-6.5s-5.5-.8-6.5 1.8"></path><circle cx="12" cy="12" r="1.5"></circle></svg>;

const calculatorsData = [
  {
    category: 'Business & E-commerce',
    items: [
      { name: 'E-commerce Profit Calculator', icon: <ECommerceIcon />, isPremium: true },
      { name: 'Product Cost Calculator', icon: <ProductCostIcon />, isPremium: true },
      { name: 'Recipe Cost Calculator', icon: <RecipeIcon /> },
      { name: 'CLV & CAC Calculator', icon: <CLVCACIcon />, isPremium: true },
      { name: 'Inventory Management Calculator', icon: <InventoryIcon />, isPremium: true },
      { name: 'Break-Even ROAS Calculator', icon: <ROASIcon />, isPremium: true },
      { name: 'Break-Even Point Calculator', icon: <BreakEvenIcon /> },
      { name: 'Profit Margin Calculator', icon: <ProfitMarginIcon /> },
      { name: 'Discount Calculator', icon: <DiscountIcon /> },
      { name: 'AOV Calculator', icon: <LoanIcon /> }, 
    ]
  },
  {
    category: 'Finance & Investment',
    items: [
      { name: 'SIP Calculator', icon: <SIPFDRIcon /> },
      { name: 'FD/RD Calculator', icon: <SIPFDRIcon /> },
      { name: 'Mutual Fund Returns Calculator', icon: <ProfitMarginIcon /> },
      { name: 'Compound Interest Calculator', icon: <ROASIcon /> },
      { name: 'Credit Card Interest Calculator', icon: <DiscountIcon /> },
      { name: 'Home Loan EMI & Affordability', icon: <HomeLoanIcon /> },
      { name: 'GST/Tax Calculator', icon: <PercentageIcon /> },
      { name: 'Loan Calculator', icon: <LoanIcon /> },
    ]
  },
  {
    category: 'Real Estate & Construction',
    items: [
      { name: 'Area Cost Estimator', icon: <HomeLoanIcon /> },
      { name: 'Rent vs Buy Calculator', icon: <RentBuyIcon /> },
      { name: 'Carpet Area vs Built-up Area', icon: <AreaIcon /> },
    ]
  },
  {
    category: 'Math & Education',
    items: [
      { name: 'Percentage Calculator', icon: <PercentageIcon /> },
      { name: 'Average Calculator', icon: <StandardIcon /> },
      { name: 'Median & Mode Calculator', icon: <ScientificIcon /> },
      { name: 'Logarithm & Trigonometry', icon: <BmiIcon /> },
      { name: 'Standard Calculator', icon: <StandardIcon /> },
      { name: 'Scientific Calculator', icon: <ScientificIcon /> },
    ]
  },
  {
    category: 'Science',
    items: [
      { name: 'Force & Acceleration', icon: <ScienceIcon /> },
      { name: 'Velocity & Distance', icon: <ScienceIcon /> },
    ]
  },
  {
    category: 'Geometry',
    items: [
      { name: 'All Shapes Area Calculator', icon: <AreaIcon /> },
      { name: 'All Shapes Volume Calculator', icon: <VolumeIcon /> },
    ]
  },
  {
    category: 'Health',
    items: [
      { name: 'BMI Calculator', icon: <BmiIcon /> },
      { name: 'Age Calculator', icon: <AgeIcon /> },
    ]
  },
  {
    category: 'Converters',
    items: [
      { name: 'Unit Converter', icon: <UnitIcon /> },
      { name: 'Currency Converter', icon: <CurrencyIcon /> },
    ]
  },
  {
    category: 'Everyday Use',
    items: [
      { name: 'Fuel Cost Calculator', icon: <FuelIcon /> },
      { name: 'Trip Expense Splitter', icon: <CLVCACIcon /> },
    ]
  },
];


const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ onSelectCalculator, onToggleSidebar, onToggleHistoryPanel, onRestoreFromHistory }) => {
    const { homeLayout, pinnedCalculators } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const filterRef = useRef<HTMLDivElement>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const [orderedSections, setOrderedSections] = useState(calculatorsData.map(c => c.category));
    
    useEffect(() => {
        try {
            const savedOrder = localStorage.getItem('calculatorSectionOrder');
            if (savedOrder) {
                setOrderedSections(JSON.parse(savedOrder));
            }
        } catch (error) {
            console.error("Failed to load section order:", error);
        }
    }, []);
    
    useEffect(() => {
        try {
            localStorage.setItem('calculatorSectionOrder', JSON.stringify(orderedSections));
        } catch (error) {
            console.error("Failed to save section order:", error);
        }
    }, [orderedSections]);
    
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
        
        return sections.sort((a, b) => orderedSections.indexOf(a.category) - orderedSections.indexOf(b.category));

    }, [searchQuery, filter, orderedSections, pinnedCalculators]);
    
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setOrderedSections((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    
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

    return (
        <div className="flex flex-col min-h-screen">
             <header 
                className={`sticky top-0 z-20 flex items-center justify-between p-4 shadow-md bg-primary text-on-primary transition-colors`}
            >
                <button onClick={onToggleSidebar} id="onboarding-sidebar-toggle" className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Open sidebar menu">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold">All Calculation</h1>
                <button onClick={() => setIsSearchVisible(p => !p)} id="onboarding-search-toggle" className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Search calculators">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </header>

            <main className="flex-grow p-4">

                {isSearchVisible && (
                     <div className="bg-theme-secondary/80 backdrop-blur-sm p-4 rounded-xl shadow sticky top-20 z-10 mb-6 animate-fade-in-down">
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
               
                {pinnedItems.length > 0 && (
                    <section className="mb-8" aria-labelledby="pinned-calculators">
                        <h2 id="pinned-calculators" className="text-2xl font-semibold mb-4 text-theme-primary flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                               <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                            </svg>
                            Pinned
                        </h2>
                        {renderCalculators({ items: pinnedItems })}
                    </section>
                )}

                <RecentHistory onToggleHistoryPanel={onToggleHistoryPanel} onRestore={onRestoreFromHistory} />
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={orderedSections} strategy={verticalListSortingStrategy}>
                        {filteredAndSortedSections.map((category, index) => (
                             <SortableItem key={category.category} id={category.category}>
                                <section className="mb-8" aria-labelledby={category.category.replace(/\s+/g, '-')}>
                                    <h2 id={category.category.replace(/\s+/g, '-')} className={`text-2xl font-semibold mb-4 text-theme-primary`}>{category.category}</h2>
                                    {renderCalculators(category)}
                                </section>
                                {(index + 1) % 3 === 0 && <AdsensePlaceholder />}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </main>
        </div>
    );
};

export default HomePage;