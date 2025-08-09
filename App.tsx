import React, { useState, useEffect, useContext, useRef } from 'react';
import HomePage from './components/HomePage';
import StandardCalculator from './components/StandardCalculator';
import ScientificCalculator from './components/ScientificCalculator';
import LoanCalculator from './components/LoanCalculator';
import UnitConverter from './components/UnitConverter';
import AreaCalculator from './components/AreaCalculator';
import VolumeCalculator from './components/VolumeCalculator';
import BMICalculator from './components/BMICalculator';
import CalculatorPageWrapper from './components/CalculatorPageWrapper';
import { HistoryProvider, HistoryEntry, HistoryContext } from './contexts/HistoryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DateTrackerProvider } from './contexts/DateTrackerContext';
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

import PolicyPage from './components/PolicyPage';
import { PrivacyPolicyContent, TermsOfServiceContent, AboutUsContent, DisclaimerContent } from './data/policyContent';
import CookieConsentBanner from './components/CookieConsentBanner';
import OnboardingGuide from './components/OnboardingGuide';

import EmbedModal from './components/EmbedModal';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import SharePromptModal from './components/SharePromptModal';

interface CalculatorProps {
  initialState?: any;
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
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isSharePromptOpen, setIsSharePromptOpen] = useState(false);

  const { history } = useContext(HistoryContext);
  const prevHistoryLengthRef = useRef(history.length);

  useEffect(() => {
    // This effect runs whenever a calculation is added to history, triggering the share prompt
    if (history.length > prevHistoryLengthRef.current) {
        const hasShownPrompt = sessionStorage.getItem('hasShownSharePrompt');
        if (!hasShownPrompt) {
            const currentCount = parseInt(sessionStorage.getItem('calculationCount') || '0', 10);
            const newCount = currentCount + 1;
            sessionStorage.setItem('calculationCount', newCount.toString());

            if (newCount >= 2) {
                setIsSharePromptOpen(true);
                sessionStorage.setItem('hasShownSharePrompt', 'true');
            }
        }
    }
    prevHistoryLengthRef.current = history.length;
  }, [history]);

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

  const clearAllPages = () => {
      setCurrentCalculator(null);
      setShowSavedDatesPage(false);
      setPolicyPage(null);
      setBlogState(null);
  }

  useEffect(() => {
    // Online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // History management for back button
    const handlePopState = (event: PopStateEvent) => {
        const state = event.state;
        clearAllPages();
        if (state?.page === 'home' || !state) {
            // Already handled by clearAllPages
        } else if (state?.page === 'calculator' && calculators[state.name]) {
            setCurrentCalculator(state.name);
            setCalculatorState(null);
        } else if (state?.page === 'savedDates') {
            setShowSavedDatesPage(true);
        } else if (state?.page === 'policy' && policyPages[state.name]) {
            setPolicyPage(state.name);
        } else if (state?.page === 'blogList') {
            setBlogState({ page: 'list' });
        } else if (state?.page === 'blogPost' && state.slug) {
            setBlogState({ page: 'post', slug: state.slug });
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

  const isHomePage = !currentCalculator && !showSavedDatesPage && !policyPage && !blogState;

  useEffect(() => {
    // Scroll restoration logic
    if (isHomePage) {
      setTimeout(() => window.scrollTo(0, scrollPosition), 0);
    }
  }, [isHomePage, scrollPosition]);

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
      return (
        <CalculatorPageWrapper 
          title={currentCalculator} 
          onBack={() => window.history.back()}
          isEmbed={isEmbedMode}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          onSelectCalculator={handleSelectCalculator}
          onSelectBlogPost={(slug) => handleShowBlogPage('post', slug)}
        >
          <CalculatorComponent initialState={calculatorState} />
        </CalculatorPageWrapper>
      );
    }
    
    if (showSavedDatesPage) return <SavedDatesPage onBack={() => window.history.back()} />;

    if (policyPage && policyPages[policyPage]) {
      const { title, content } = policyPages[policyPage];
      return <PolicyPage title={title} onBack={() => window.history.back()}>{content}</PolicyPage>;
    }

    if (blogState?.page === 'list') return <BlogPage onBack={() => window.history.back()} onSelectPost={(slug) => handleShowBlogPage('post', slug)} />;
    if (blogState?.page === 'post' && blogState.slug) return <BlogPostPage slug={blogState.slug} onBack={() => window.history.back()} onSelectCalculator={handleSelectCalculator} />;

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
      />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
      <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
      <CookieConsentBanner onShowPrivacyPolicy={() => handleShowPolicyPage('privacy')} />
      <SharePromptModal isOpen={isSharePromptOpen} onClose={() => setIsSharePromptOpen(false)} />
      <EmbedModal isOpen={isEmbedModalOpen} onClose={() => setIsEmbedModalOpen(false)} calculatorName={currentCalculator} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DateTrackerProvider>
        <HistoryProvider>
          <AppContent />
        </HistoryProvider>
      </DateTrackerProvider>
    </ThemeProvider>
  );
}

export default App;
