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
import { FuelProvider } from './contexts/FuelContext';
import { AdProvider, useAd } from './contexts/AdContext';
import OutOfFuelToast from './components/OutOfFuelToast';
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
import ThemeModal from './components/ThemeModal';
import CheatCodeModal from './components/CheatCodeModal';

import PolicyPage from './components/PolicyPage';
import { PrivacyPolicyContent, TermsOfServiceContent, AboutUsContent, DisclaimerContent } from './data/policyContent';
import CookieConsentBanner from './components/CookieConsentBanner';
import OnboardingGuide from './components/OnboardingGuide';

import EmbedModal from './components/EmbedModal';
import { calculatorsData } from './data/calculators';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';

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
  const [calculatorState, setCalculatorState] = useState<any | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSavedDatesPage, setShowSavedDatesPage] = useState(false);
  const [policyPage, setPolicyPage] = useState<string | null>(null);
  const [blogState, setBlogState] = useState<{ page: 'list' | 'post', slug?: string } | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheatCodeModalOpen, setIsCheatCodeModalOpen] = useState(false);
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
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
  
    // URL parameter handling for embed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const embedCalculator = params.get('embed');

    if (embedCalculator && calculators[embedCalculator]) {
      handleSelectCalculator(embedCalculator);
      setIsEmbedMode(true);
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
            handleBackToHome();
        } else if (event.state?.page === 'calculator' && calculators[event.state.name]) {
            setCalculatorState(null);
            setCurrentCalculator(event.state.name);
            setShowSavedDatesPage(false);
            setPolicyPage(null);
            setBlogState(null);
        } else if (event.state?.page === 'savedDates') {
            handleShowSavedDatesPage();
        } else if (event.state?.page === 'policy' && policyPages[event.state.name]) {
            handleShowPolicyPage(event.state.name);
        } else if (event.state?.page === 'blogList') {
            handleShowBlogPage('list');
        } else if (event.state?.page === 'blogPost' && event.state.slug) {
            handleShowBlogPage('post', event.state.slug);
        }
    };
    window.addEventListener('popstate', handlePopState);
    if (!window.history.state) {
        window.history.replaceState({ page: 'home' }, '');
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    // Scroll restoration logic
    if (currentCalculator === null && !showSavedDatesPage && !policyPage && !blogState) {
      setTimeout(() => window.scrollTo(0, scrollPosition), 0);
    }
  }, [currentCalculator, showSavedDatesPage, policyPage, blogState, scrollPosition]);
  
  const clearAllPages = () => {
      setCurrentCalculator(null);
      setShowSavedDatesPage(false);
      setPolicyPage(null);
      setBlogState(null);
  }

  const handleSelectCalculator = (name: string) => {
    if (calculators[name]) {
      setScrollPosition(window.scrollY);
      setCalculatorState(null);
      clearAllPages();
      setCurrentCalculator(name);
      if(!isEmbedMode) {
          window.history.pushState({ page: 'calculator', name }, ``, `#${name.replace(/\s+/g, '-')}`);
      }
    }
  };

  const handleBackToHome = () => {
    clearAllPages();
    window.history.pushState({ page: 'home' }, '', window.location.pathname);
  };
  
  const handleRestoreFromHistory = (entry: HistoryEntry) => {
    if (calculators[entry.calculator] && entry.inputs) {
        setScrollPosition(window.scrollY);
        setCalculatorState(entry.inputs);
        clearAllPages();
        setCurrentCalculator(entry.calculator);
        setIsHistoryOpen(false); // Close panel on selection
        window.history.pushState({ page: 'calculator', name: entry.calculator }, ``, `#${entry.calculator.replace(/\s+/g, '-')}`);
    }
  };

  const handleToggleHistory = () => setIsHistoryOpen(prev => !prev);
  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  const handleShowSavedDatesPage = () => {
    setScrollPosition(window.scrollY);
    clearAllPages();
    setShowSavedDatesPage(true);
    setIsSidebarOpen(false);
    window.history.pushState({ page: 'savedDates' }, ``, `#saved-dates`);
  };

  const handleShowPolicyPage = (page: string) => {
    if (policyPages[page]) {
      setScrollPosition(window.scrollY);
      clearAllPages();
      setPolicyPage(page);
      setIsSidebarOpen(false);
      window.history.pushState({ page: 'policy', name: page }, '', `#${page}`);
    }
  };

  const handleShowBlogPage = (page: 'list' | 'post', slug?: string) => {
      setScrollPosition(window.scrollY);
      clearAllPages();
      if (page === 'list') {
          setBlogState({ page: 'list' });
          window.history.pushState({ page: 'blogList' }, '', '#blog');
      } else if (page === 'post' && slug) {
          setBlogState({ page: 'post', slug });
          window.history.pushState({ page: 'blogPost', slug }, '', `#blog/${slug}`);
      }
      setIsSidebarOpen(false);
  }
  
  const renderContent = () => {
    if (currentCalculator) {
      const CalculatorComponent = calculators[currentCalculator];
      const calculatorData = calculatorsData.flatMap(cat => cat.items).find(c => c.name === currentCalculator);
      return (
        <CalculatorPageWrapper 
          title={currentCalculator} 
          onBack={handleBackToHome}
          isEmbed={isEmbedMode}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          onSelectCalculator={handleSelectCalculator}
          onSelectBlogPost={(slug) => handleShowBlogPage('post', slug)}
        >
          <CalculatorComponent initialState={calculatorState} isPremium={calculatorData?.isPremium} />
        </CalculatorPageWrapper>
      );
    }
    
    if (showSavedDatesPage) return <SavedDatesPage onBack={handleBackToHome} />;

    if (policyPage && policyPages[policyPage]) {
      const { title, content } = policyPages[policyPage];
      return <PolicyPage title={title} onBack={handleBackToHome}>{content}</PolicyPage>;
    }

    if (blogState?.page === 'list') return <BlogPage onBack={handleBackToHome} onSelectPost={(slug) => handleShowBlogPage('post', slug)} />;
    if (blogState?.page === 'post' && blogState.slug) return <BlogPostPage slug={blogState.slug} onBack={() => handleShowBlogPage('list')} onSelectCalculator={handleSelectCalculator} />;

    return <HomePage 
        onSelectCalculator={handleSelectCalculator} 
        onToggleSidebar={handleToggleSidebar} 
        onToggleHistoryPanel={handleToggleHistory}
        onRestoreFromHistory={handleRestoreFromHistory}
        onShowPolicyPage={handleShowPolicyPage}
        onShowBlogPage={handleShowBlogPage}
    />;
  }

  const handleOnboardingComplete = () => {
      setShowOnboarding(false);
      localStorage.setItem('hasSeenOnboarding', 'true');
  };
  
  if (isEmbedMode) {
      return renderContent();
  }

  return (
    <div id="app-container">
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
        onShowPolicyPage={handleShowPolicyPage}
        onShowBlogPage={() => handleShowBlogPage('list')}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenCheatCodeModal={() => setIsCheatCodeModalOpen(true)}
      />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
      <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
      <CookieConsentBanner onShowPrivacyPolicy={() => handleShowPolicyPage('privacy')} />
      <CheatCodeModal isOpen={isCheatCodeModalOpen} onClose={() => setIsCheatCodeModalOpen(false)} />
      <EmbedModal isOpen={isEmbedModalOpen} onClose={() => setIsEmbedModalOpen(false)} calculatorName={currentCalculator} />
      <OutOfFuelToast isOpen={showOutOfFuelToast} onClose={closeOutOfFuelToast} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DateTrackerProvider>
        <HistoryProvider>
          <FuelProvider>
            <AdProvider>
              <AppContent />
            </AdProvider>
          </FuelProvider>
        </HistoryProvider>
      </DateTrackerProvider>
    </ThemeProvider>
  );
}

export default App;