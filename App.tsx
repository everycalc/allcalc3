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
import { AdProvider, useAd } from './contexts/AdContext';
import { FuelProvider } from './contexts/FuelContext';
import { DailyRewardsProvider } from './contexts/DailyRewardsContext';
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
import FeedbackModal from './components/FeedbackModal';
import SavedDatesPage from './components/SavedDatesPage';
import DailyRewardsPage from './components/DailyRewardsPage';
import ThemeModal from './components/ThemeModal';
import SharePromptModal from './components/SharePromptModal';
import OutOfFuelToast from './components/OutOfFuelToast';

import PolicyPage from './components/PolicyPage';
import { PrivacyPolicyContent, TermsOfServiceContent, AboutUsContent, DisclaimerContent } from './data/policyContent';
import CookieConsentBanner from './components/CookieConsentBanner';
import OnboardingGuide from './components/OnboardingGuide';


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

const policyPages: { [key: string]: { title: string; content: React.ReactNode } } = {
  'privacy': { title: 'Privacy Policy', content: <PrivacyPolicyContent /> },
  'terms': { title: 'Terms of Service', content: <TermsOfServiceContent /> },
  'about': { title: 'About Us', content: <AboutUsContent /> },
  'disclaimer': { title: 'Disclaimer', content: <DisclaimerContent /> },
};

const AppContent: React.FC = () => {
  const [currentCalculator, setCurrentCalculator] = useState<string | null>(null);
  const [isCurrentPremium, setIsCurrentPremium] = useState(false);
  const [calculatorState, setCalculatorState] = useState<any | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSavedDatesPage, setShowSavedDatesPage] = useState(false);
  const [showDailyRewardsPage, setShowDailyRewardsPage] = useState(false);
  const [policyPage, setPolicyPage] = useState<string | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isExitIntentModalOpen, setIsExitIntentModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { showOutOfFuelToast, closeOutOfFuelToast } = useAd();


  useEffect(() => {
    // Onboarding guide
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
        const timer = setTimeout(() => {
            setShowOnboarding(true);
        }, 1500); // Show after a short delay
        return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // History management for back button
    const handlePopState = (event: PopStateEvent) => {
        if (event.state?.page === 'home' || !event.state) {
            setCurrentCalculator(null);
            setShowSavedDatesPage(false);
            setShowDailyRewardsPage(false);
            setPolicyPage(null);
        } else if (event.state?.page === 'calculator' && calculators[event.state.name]) {
            setCalculatorState(null); // Clear state when navigating via history
            setCurrentCalculator(event.state.name);
            setShowSavedDatesPage(false);
            setShowDailyRewardsPage(false);
            setPolicyPage(null);
        } else if (event.state?.page === 'savedDates') {
            setShowSavedDatesPage(true);
            setCurrentCalculator(null);
            setShowDailyRewardsPage(false);
            setPolicyPage(null);
        } else if (event.state?.page === 'dailyRewards') {
            setShowDailyRewardsPage(true);
            setCurrentCalculator(null);
            setShowSavedDatesPage(false);
            setPolicyPage(null);
        } else if (event.state?.page === 'policy' && policyPages[event.state.name]) {
            setShowSavedDatesPage(false);
            setShowDailyRewardsPage(false);
            setCurrentCalculator(null);
            setPolicyPage(event.state.name);
        }
    };
    window.addEventListener('popstate', handlePopState);
    if (!window.history.state) {
        window.history.replaceState({ page: 'home' }, '');
    }

    // Exit-intent modal - Desktop only
    const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !sessionStorage.getItem('hasSeenExitIntent')) {
            setIsExitIntentModalOpen(true);
            sessionStorage.setItem('hasSeenExitIntent', 'true');
        }
    };
    
    const isDesktop = !('ontouchstart' in window);
    let timer: number | undefined;

    if (isDesktop) {
        // Delay attaching the listener to avoid it firing on page load
        timer = window.setTimeout(() => {
            document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        }, 30000); // Attach after 30 seconds
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('popstate', handlePopState);
        if (timer) window.clearTimeout(timer);
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    // Scroll restoration logic
    if (currentCalculator === null && !showSavedDatesPage && !policyPage && !showDailyRewardsPage) {
      // Small timeout to allow DOM to render before scrolling
      setTimeout(() => window.scrollTo(0, scrollPosition), 0);
    }
  }, [currentCalculator, showSavedDatesPage, policyPage, showDailyRewardsPage, scrollPosition]);

  const handleSelectCalculator = (name: string, isPremium: boolean = false) => {
    if (calculators[name]) {
      setScrollPosition(window.scrollY); // Save scroll position
      setCalculatorState(null); // Clear any previous state
      setCurrentCalculator(name);
      setIsCurrentPremium(isPremium);
      setShowSavedDatesPage(false);
      setShowDailyRewardsPage(false);
      setPolicyPage(null);
      window.history.pushState({ page: 'calculator', name }, ``, `#${name.replace(/\s+/g, '-')}`);
    }
  };

  const handleBackToHome = () => {
    window.history.back();
  };
  
  const handleRestoreFromHistory = (entry: HistoryEntry) => {
    if (calculators[entry.calculator] && entry.inputs) {
        setScrollPosition(window.scrollY);
        setCalculatorState(entry.inputs);
        setCurrentCalculator(entry.calculator);
        setShowSavedDatesPage(false);
        setShowDailyRewardsPage(false);
        setPolicyPage(null);
        setIsHistoryOpen(false); // Close panel on selection
        window.history.pushState({ page: 'calculator', name: entry.calculator }, ``, `#${entry.calculator.replace(/\s+/g, '-')}`);
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
    setShowDailyRewardsPage(false);
    setPolicyPage(null);
    setShowSavedDatesPage(true);
    window.history.pushState({ page: 'savedDates' }, ``, `#saved-dates`);
  };

  const handleShowDailyRewardsPage = () => {
    setScrollPosition(window.scrollY);
    setIsSidebarOpen(false);
    setCurrentCalculator(null);
    setShowSavedDatesPage(false);
    setPolicyPage(null);
    setShowDailyRewardsPage(true);
    window.history.pushState({ page: 'dailyRewards' }, ``, `#daily-rewards`);
  };

  const handleShowPolicyPage = (page: string) => {
    if (policyPages[page]) {
      setScrollPosition(window.scrollY);
      setIsSidebarOpen(false);
      setCurrentCalculator(null);
      setShowSavedDatesPage(false);
      setShowDailyRewardsPage(false);
      setPolicyPage(page);
      window.history.pushState({ page: 'policy', name: page }, '', `#${page}`);
    }
  };
  
  const renderContent = () => {
    if (showSavedDatesPage) {
      return <SavedDatesPage onBack={handleBackToHome} />;
    }

    if (showDailyRewardsPage) {
      return <DailyRewardsPage onBack={handleBackToHome} />;
    }

    if (policyPage && policyPages[policyPage]) {
      const { title, content } = policyPages[policyPage];
      return <PolicyPage title={title} onBack={handleBackToHome}>{content}</PolicyPage>;
    }

    // If a calculator is selected, render it within the page wrapper
    if (currentCalculator) {
      const CalculatorComponent = calculators[currentCalculator];
      return (
        <CalculatorPageWrapper title={currentCalculator} onBack={handleBackToHome} isPremium={isCurrentPremium}>
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
        onShowPolicyPage={handleShowPolicyPage}
    />;
  }

  const handleOnboardingComplete = () => {
      setShowOnboarding(false);
      localStorage.setItem('hasSeenOnboarding', 'true');
  };

  return (
    <>
      <div className="bg-theme-primary text-theme-primary">
        <OnboardingGuide 
          isOpen={showOnboarding} 
          onClose={handleOnboardingComplete}
          onOpenHistory={() => {
              handleOnboardingComplete();
              setIsHistoryOpen(true);
          }}
          onOpenTheme={() => {
              handleOnboardingComplete();
              setIsThemeModalOpen(true);
          }}
        />
        {!isOnline && <OfflineNotice />}
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
          onShowDailyRewardsPage={handleShowDailyRewardsPage}
          onShowPolicyPage={handleShowPolicyPage}
          onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
        />
        <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
        <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
        <SharePromptModal isOpen={isExitIntentModalOpen} onClose={() => setIsExitIntentModalOpen(false)} />
        <CookieConsentBanner onShowPrivacyPolicy={() => handleShowPolicyPage('privacy')} />
        <OutOfFuelToast isOpen={showOutOfFuelToast} onClose={closeOutOfFuelToast} />
      </div>
    </>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DateTrackerProvider>
        <FuelProvider>
          <DailyRewardsProvider>
            <AdProvider>
              <HistoryProvider>
                  <AppContent />
              </HistoryProvider>
            </AdProvider>
          </DailyRewardsProvider>
        </FuelProvider>
      </DateTrackerProvider>
    </ThemeProvider>
  );
}

export default App;