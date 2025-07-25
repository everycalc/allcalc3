import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import StandardCalculator from './components/StandardCalculator';
import ScientificCalculator from './components/ScientificCalculator';
import LoanCalculator from './components/LoanCalculator';
import UnitConverter from './components/UnitConverter';
import AreaCalculator from './components/AreaCalculator';
import VolumeCalculator from './components/VolumeCalculator';
import BMICalculator from './components/BMICalculator';
import CalculatorPageWrapper from './components/CalculatorPageWrapper';
import { HistoryProvider, HistoryEntry } from './contexts/HistoryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DateTrackerProvider } from './contexts/DateTrackerContext';
import { AdProvider } from './contexts/AdContext';
import HistoryPanel from './components/HistoryPanel';
import Sidebar from './components/Sidebar';
import AgeCalculator from './components/AgeCalculator';
import ProfitMarginCalculator from './components/ProfitMarginCalculator';
import DiscountCalculator from './components/DiscountCalculator';
import BreakEvenCalculator from './components/BreakEvenCalculator';
import BreakEvenROASCalculator from './components/BreakEvenROASCalculator';
import CLVCACCalculator from './components/CLVCACCalculator';
import InventoryManagementCalculator from './components/InventoryManagementCalculator';
import ECommerceProfitCalculator from './components/ECommerceProfitCalculator';
import OfflineNotice from './components/OfflineNotice';

// New Finance Calculators
import AOVCalculator from './components/AOVCalculator';
import SIPCalculator from './components/SIPCalculator';
import FDRDCalculator from './components/FDRDCalculator';
import MutualFundReturnsCalculator from './components/MutualFundReturnsCalculator';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';
import CreditCardInterestCalculator from './components/CreditCardInterestCalculator';
import HomeLoanEMICalculator from './components/HomeLoanEMICalculator';
import GSTTaxCalculator from './components/GSTTaxCalculator';

// New Real Estate Calculators
import AreaCostEstimator from './components/AreaCostEstimator';
import RentVsBuyCalculator from './components/RentVsBuyCalculator';
import CarpetAreaCalculator from './components/CarpetAreaCalculator';

// New Math Calculators
import PercentageCalculator from './components/PercentageCalculator';
import AverageCalculator from './components/AverageCalculator';
import MedianModeCalculator from './components/MedianModeCalculator';
import LogTrigCalculator from './components/LogTrigCalculator';

// New Science Calculators
import ForceAccelerationCalculator from './components/ForceAccelerationCalculator';
import VelocityDistanceCalculator from './components/VelocityDistanceCalculator';

// New Converter
import CurrencyConverter from './components/CurrencyConverter';

// New Everyday Use Calculators
import FuelCostCalculator from './components/FuelCostCalculator';
import TripExpenseSplitter from './components/TripExpenseSplitter';
import ProductCostCalculator from './components/ProductCostCalculator';
import RecipeCostCalculator from './components/RecipeCostCalculator';
import OnboardingGuide from './components/OnboardingGuide';
import FeedbackModal from './components/FeedbackModal';
import SavedDatesPage from './components/SavedDatesPage';
import ThemeModal from './components/ThemeModal';


interface CalculatorProps {
  initialState?: any;
  isPremium?: boolean;
}

// Mapping calculator names to their respective components
const calculators: { [key: string]: React.FC<CalculatorProps> } = {
  // Business & E-commerce
  'E-commerce Profit Calculator': ECommerceProfitCalculator,
  'Product Cost Calculator': ProductCostCalculator,
  'Recipe Cost Calculator': RecipeCostCalculator,
  'CLV & CAC Calculator': CLVCACCalculator,
  'Inventory Management Calculator': InventoryManagementCalculator,
  'Break-Even ROAS Calculator': BreakEvenROASCalculator,
  'Break-Even Point Calculator': BreakEvenCalculator,
  'Profit Margin Calculator': ProfitMarginCalculator,
  'Discount Calculator': DiscountCalculator,
  'AOV Calculator': AOVCalculator,
  
  // Finance & Investment
  'SIP Calculator': SIPCalculator,
  'FD/RD Calculator': FDRDCalculator,
  'Mutual Fund Returns Calculator': MutualFundReturnsCalculator,
  'Compound Interest Calculator': CompoundInterestCalculator,
  'Credit Card Interest Calculator': CreditCardInterestCalculator,
  'Home Loan EMI & Affordability': HomeLoanEMICalculator,
  'GST/Tax Calculator': GSTTaxCalculator,
  'Loan Calculator': LoanCalculator,

  // Real Estate & Construction
  'Area Cost Estimator': AreaCostEstimator,
  'Rent vs Buy Calculator': RentVsBuyCalculator,
  'Carpet Area vs Built-up Area': CarpetAreaCalculator,
  
  // Math & Education
  'Percentage Calculator': PercentageCalculator,
  'Average Calculator': AverageCalculator,
  'Median & Mode Calculator': MedianModeCalculator,
  'Logarithm & Trigonometry': LogTrigCalculator,
  'Standard Calculator': StandardCalculator,
  'Scientific Calculator': ScientificCalculator,

  // Science
  'Force & Acceleration': ForceAccelerationCalculator,
  'Velocity & Distance': VelocityDistanceCalculator,

  // Geometry
  'All Shapes Area Calculator': AreaCalculator,
  'All Shapes Volume Calculator': VolumeCalculator,
  
  // Health
  'BMI Calculator': BMICalculator,
  'Age Calculator': AgeCalculator,
  
  // Converters
  'Unit Converter': UnitConverter,
  'Currency Converter': CurrencyConverter,
  
  // Everyday Use
  'Fuel Cost Calculator': FuelCostCalculator,
  'Trip Expense Splitter': TripExpenseSplitter,
};

const App: React.FC = () => {
  const [currentCalculator, setCurrentCalculator] = useState<string | null>(null);
  const [isCurrentPremium, setIsCurrentPremium] = useState(false);
  const [calculatorState, setCalculatorState] = useState<any | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSavedDatesPage, setShowSavedDatesPage] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show onboarding guide on first visit
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Scroll restoration logic
    if (currentCalculator === null && !showSavedDatesPage) {
      // Small timeout to allow DOM to render before scrolling
      setTimeout(() => window.scrollTo(0, scrollPosition), 0);
    }
  }, [currentCalculator, showSavedDatesPage, scrollPosition]);

  const handleSelectCalculator = (name: string, isPremium: boolean = false) => {
    if (calculators[name]) {
      setScrollPosition(window.scrollY); // Save scroll position
      setCalculatorState(null); // Clear any previous state
      setCurrentCalculator(name);
      setIsCurrentPremium(isPremium);
      setShowSavedDatesPage(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentCalculator(null);
    setShowSavedDatesPage(false);
  };
  
  const handleRestoreFromHistory = (entry: HistoryEntry) => {
    if (calculators[entry.calculator] && entry.inputs) {
        setScrollPosition(window.scrollY);
        setCalculatorState(entry.inputs);
        setCurrentCalculator(entry.calculator);
        setShowSavedDatesPage(false);
        setIsHistoryOpen(false); // Close panel on selection
    }
  };

  const handleToggleHistory = () => {
    setIsHistoryOpen(prev => !prev);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  const handleShowSavedDatesPage = () => {
    setScrollPosition(window.scrollY);
    setIsSidebarOpen(false);
    setCurrentCalculator(null);
    setShowSavedDatesPage(true);
  };
  
  const handleFinishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const renderContent = () => {
    if (showSavedDatesPage) {
      return <SavedDatesPage onBack={handleBackToHome} />;
    }

    // If a calculator is selected, render it within the page wrapper
    if (currentCalculator) {
      const CalculatorComponent = calculators[currentCalculator];
      return (
        <CalculatorPageWrapper title={currentCalculator} onBack={handleBackToHome}>
          <CalculatorComponent initialState={calculatorState} isPremium={isCurrentPremium} />
        </CalculatorPageWrapper>
      );
    }

    // Otherwise, show the home page
    return <HomePage 
        onSelectCalculator={handleSelectCalculator} 
        onToggleSidebar={handleToggleSidebar} 
        onToggleHistoryPanel={handleToggleHistory}
        onRestoreFromHistory={handleRestoreFromHistory}
    />;
  }

  return (
    <ThemeProvider>
      <DateTrackerProvider>
        <AdProvider>
          <HistoryProvider>
            <div className="bg-theme-primary text-theme-primary">
              {!isOnline && <OfflineNotice />}
              <OnboardingGuide isOpen={showOnboarding} onClose={handleFinishOnboarding} />
              {renderContent()}
              <HistoryPanel 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
                onRestore={handleRestoreFromHistory}
              />
              <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onToggleHistory={handleToggleHistory}
                onShowSavedDatesPage={handleShowSavedDatesPage}
                onShowOnboarding={() => setShowOnboarding(true)}
                onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
                onOpenThemeModal={() => setIsThemeModalOpen(true)}
              />
              <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
              <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
            </div>
          </HistoryProvider>
        </AdProvider>
      </DateTrackerProvider>
    </ThemeProvider>
  );
};

export default App;