import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
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

import { ProProvider } from './contexts/ProContext';
import CheatCodeModal from './components/CheatCodeModal';
import { blogPosts } from './data/blogPosts';
import { calculatorDescriptions } from './data/calculatorDescriptions';
import { calculatorsData } from './data/calculators';


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

// SEO Helper
const updateSeoTags = (title: string, description: string, keywords: string, jsonLd?: object) => {
    document.title = title;
    document.querySelector('#meta-description')?.setAttribute('content', description);
    document.querySelector('#meta-keywords')?.setAttribute('content', keywords);

    const jsonLdScript = document.querySelector('#json-ld-structured-data');
    if (jsonLdScript) {
        jsonLdScript.innerHTML = jsonLd ? JSON.stringify(jsonLd) : '';
    }
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
  const [isCheatCodeModalOpen, setIsCheatCodeModalOpen] = useState(false);

  const { history } = useContext(HistoryContext);
  const prevHistoryLengthRef = useRef(history.length);

  const allCalculatorsList = useMemo(() => calculatorsData.flatMap(cat => cat.items), []);

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
    // Dynamic SEO Management
    let title = 'All Type Calculator: Free Online Tools for All Your Calculation Needs';
    let description = 'The ultimate free online calculator suite. All Type Calculator provides a versatile collection of tools for business, finance, health, and math. Get instant, accurate results with the best all-in-one calculator app.';
    let keywords = 'all type calculator, free online calculator, math calculator, finance calculator, business calculator, health calculator';
    let jsonLd: object | undefined = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': window.location.origin,
        'name': 'All Type Calculator',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': `${window.location.origin}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    if (currentCalculator) {
      const calcData = calculatorDescriptions[currentCalculator];
      title = `${currentCalculator} | All Type Calculator`;
      description = calcData?.metaDescription || `Use the All Type Calculator for your ${currentCalculator} needs. A free, fast, and accurate online tool.`;
      keywords = `all type calculator, ${currentCalculator.toLowerCase()}, free ${currentCalculator.toLowerCase()}, online calculator`;
      
      const faqData = calcData?.faqs;
      let faqSchema: object | undefined = undefined;
      if (faqData && faqData.length > 0) {
          faqSchema = {
              '@type': 'FAQPage',
              'mainEntity': faqData.map(faq => ({
                  '@type': 'Question',
                  'name': faq.q,
                  'acceptedAnswer': {
                      '@type': 'Answer',
                      'text': faq.a
                  }
              }))
          };
      }
      
      jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          'name': `${currentCalculator} - How to Calculate`,
          'description': calcData?.description || description,
          'step': [
            { '@type': 'HowToStep', 'name': 'Enter Inputs', 'text': `Enter your values into the designated fields for the ${currentCalculator}.` },
            { '@type': 'HowToStep', 'name': 'Calculate', 'text': 'Click the "Calculate" button to see the instant result.' },
            { '@type': 'HowToStep', 'name': 'Review and Export', 'text': 'Review the detailed breakdown, explore the explanation, and export or share your results.' }
          ],
          ...(faqSchema && { 'mainEntity': faqSchema })
      };

    } else if (showSavedDatesPage) {
      title = 'Saved Dates | All Type Calculator';
      description = 'Manage your saved birthdays and anniversaries for use with the Age Calculator. Never forget an important date with All Type Calculator.';
      keywords = 'all type calculator, saved dates, birthday tracker, anniversary calculator';
    } else if (policyPage && policyPages[policyPage]) {
      title = `${policyPages[policyPage].title} | All Type Calculator`;
      description = `Read the ${policyPages[policyPage].title} for the All Type Calculator application. Understand our policies on data, terms of use, and more.`;
      keywords = `all type calculator, ${policyPages[policyPage].title.toLowerCase()}`;
    } else if (blogState?.page === 'list') {
      title = 'Blog & Guides | All Type Calculator';
      description = 'Explore insightful articles and guides on finance, business, and lifestyle topics from the All Type Calculator blog. Learn how to make the most of our tools.';
      keywords = 'all type calculator, blog, finance guides, business tips, calculator tutorials';
    } else if (blogState?.page === 'post' && blogState.slug) {
      const post = blogPosts.find(p => p.slug === blogState.slug);
      if (post) {
        title = `${post.title} | All Type Calculator Blog`;
        description = post.metaDescription || post.excerpt;
        keywords = `all type calculator, ${post.title.toLowerCase()}, ${post.category.toLowerCase()} blog`;
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': post.title,
          'author': { '@type': 'Organization', 'name': 'All Type Calculator' },
          'datePublished': new Date().toISOString(), // Placeholder, ideally from post data
          'description': description,
        }
      }
    }
    updateSeoTags(title, description, keywords, jsonLd);
  }, [currentCalculator, showSavedDatesPage, policyPage, blogState]);

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

  const clearAllPages = () => {
      setCurrentCalculator(null);
      setShowSavedDatesPage(false);
      setPolicyPage(null);
      setBlogState(null);
  };

  // The function that updates state based on a path. It does NOT navigate.
  const processRoute = (path: string) => {
    clearAllPages();

    const calcMatch = path.match(/^\/calc\/(.*)$/);
    const blogPostMatch = path.match(/^\/blog\/(.*)$/);

    if (calcMatch && calcMatch[1]) {
      const slug = calcMatch[1];
      const calc = allCalculatorsList.find(c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === slug);
      if (calc) {
        setCurrentCalculator(calc.name);
        setCalculatorState(null);
      }
      // If calc not found, it will default to homepage because clearAllPages was called.
      return;
    }

    if (blogPostMatch && blogPostMatch[1]) {
      const slug = blogPostMatch[1];
      if (blogPosts.some(p => p.slug === slug)) {
        setBlogState({ page: 'post', slug });
      } else {
        // if blog post not found, show the blog list page
        setBlogState({ page: 'list' });
      }
      return;
    }

    switch (path) {
      case '/':
      case '/index.html':
        // Handled by clearAllPages, defaults to HomePage
        break;
      case '/saved-dates':
        setShowSavedDatesPage(true);
        break;
      case '/blog':
        setBlogState({ page: 'list' });
        break;
      case '/privacy':
      case '/terms':
      case '/about':
      case '/disclaimer':
        setPolicyPage(path.substring(1));
        break;
      default:
        // Unknown path, will render HomePage by default because of clearAllPages.
        // No navigation happens here, preventing loops.
        break;
    }
  };

  // The function that triggers navigation. It changes the URL, then calls processRoute.
  const navigateTo = (path: string, replace = false) => {
    const method = replace ? 'replaceState' : 'pushState';
    const currentPath = window.location.pathname + window.location.search;
    if (path !== currentPath) {
        window.history[method]({ path }, '', path);
    }
    processRoute(path.split('?')[0]);
  };

  useEffect(() => {
    // Online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // History management for back button
    const handlePopState = (event: PopStateEvent) => {
        processRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial Route Handling on Load
    const params = new URLSearchParams(window.location.search);
    const embedCalculator = params.get('embed');

    if (embedCalculator && calculators[embedCalculator]) {
      setCurrentCalculator(embedCalculator);
      setIsEmbedMode(true);
    } else if (window.location.hash) {
        // Handle old hash-based URLs on first load
        const pathFromHash = window.location.hash.substring(1);
        const normalizedPath = pathFromHash.startsWith('/') ? pathFromHash : `/${pathFromHash}`;
        // Update the URL to the clean version without reloading the page
        window.history.replaceState(null, '', normalizedPath);
        processRoute(normalizedPath);
    } else {
       processRoute(window.location.pathname);
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Run only once on mount

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
      const urlName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      navigateTo(`/calc/${urlName}`);
    }
  };
  
  const handleRestoreFromHistory = (entry: HistoryEntry) => {
    if (calculators[entry.calculator] && entry.inputs) {
        setScrollPosition(window.scrollY);
        const urlName = entry.calculator.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        navigateTo(`/calc/${urlName}`);
        // We need to set state after navigating, because navigation clears state
        setTimeout(() => setCalculatorState(entry.inputs), 0);
        setIsHistoryOpen(false); // Close panel on selection
    }
  };

  const handleToggleHistory = () => setIsHistoryOpen(prev => !prev);
  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  const handleShowSavedDatesPage = () => {
    setScrollPosition(window.scrollY);
    navigateTo('/saved-dates');
    setIsSidebarOpen(false);
  };

  const handleShowPolicyPage = (page: string) => {
    if (policyPages[page]) {
      setScrollPosition(window.scrollY);
      navigateTo(`/${page}`);
      setIsSidebarOpen(false);
    }
  };

  const handleShowBlogPage = (page: 'list' | 'post', slug?: string) => {
      setScrollPosition(window.scrollY);
      if (page === 'list') {
          navigateTo('/blog');
      } else if (page === 'post' && slug) {
          navigateTo(`/blog/${slug}`);
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
        onShowBlogPage={() => handleShowBlogPage('list')}
    />;
  }

  const handleOnboardingComplete = () => {
      setShowOnboarding(false);
      localStorage.setItem('hasSeenOnboarding', 'true');
  };
  
  if (isEmbedMode) {
      return (
        <div className="p-4 relative min-h-[600px]">
            {renderContent()}
            <a 
                href={window.location.origin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute bottom-2 right-2 text-xs text-gray-400 hover:text-primary z-10"
            >
                Powered by All Type Calculator
            </a>
        </div>
    );
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
      <SharePromptModal isOpen={isSharePromptOpen} onClose={() => setIsSharePromptOpen(false)} />
      <EmbedModal isOpen={isEmbedModalOpen} onClose={() => setIsEmbedModalOpen(false)} calculatorName={currentCalculator} />
      <CheatCodeModal isOpen={isCheatCodeModalOpen} onClose={() => setIsCheatCodeModalOpen(false)} />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DateTrackerProvider>
        <HistoryProvider>
          <ProProvider>
            <AppContent />
          </ProProvider>
        </HistoryProvider>
      </DateTrackerProvider>
    </ThemeProvider>
  );
}

export default App;
