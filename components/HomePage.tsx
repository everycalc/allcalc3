import React, { useState, useMemo } from 'react';
import CalculatorCard from './CalculatorCard';
import { useTheme } from '../contexts/ThemeContext';
import AdsensePlaceholder from './AdsensePlaceholder';
import RecentHistory from './RecentHistory';
import { HistoryEntry } from '../contexts/HistoryContext';
import { calculatorsData } from '../data/calculators';
import Logo from './Logo';
import SearchModal from './SearchModal';
import { blogPosts } from '../data/blogPosts';
import BlogCard from './BlogCard';
import CalculatorCarousel from './CalculatorCarousel';

interface HomePageProps {
  onSelectCalculator: (name: string, isPremium?: boolean) => void;
  onToggleSidebar: () => void;
  onToggleHistoryPanel: () => void;
  onRestoreFromHistory: (entry: HistoryEntry) => void;
  onShowPolicyPage: (page: string) => void;
  onShowBlogPage: (page: string, slug?: string) => void;
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

const Footer: React.FC<{ onShowPolicyPage: (page: string) => void; onShowBlogPage: (page: string) => void }> = ({ onShowPolicyPage, onShowBlogPage }) => {
  return (
    <footer className="w-full mt-12 py-6 border-t border-outline-variant text-center text-sm text-on-surface-variant">
      <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2">
        <button onClick={() => onShowPolicyPage('about')} className="hover:text-primary hover:underline">About Us</button>
        <span className="opacity-50 hidden sm:inline">|</span>
        <button onClick={() => onShowBlogPage('list')} className="hover:text-primary hover:underline">Blog</button>
        <span className="opacity-50 hidden sm:inline">|</span>
        <button onClick={() => onShowPolicyPage('privacy')} className="hover:text-primary hover:underline">Privacy Policy</button>
        <span className="opacity-50 hidden sm:inline">|</span>
        <button onClick={() => onShowPolicyPage('terms')} className="hover:text-primary hover:underline">Terms of Service</button>
         <span className="opacity-50 hidden sm:inline">|</span>
        <button onClick={() => onShowPolicyPage('disclaimer')} className="hover:text-primary hover:underline">Disclaimer</button>
      </div>
      <p className="mt-4 opacity-75">&copy; {new Date().getFullYear()} All Type Calculator. All rights reserved.</p>
    </footer>
  );
};


const HomePage: React.FC<HomePageProps> = ({ onSelectCalculator, onToggleSidebar, onToggleHistoryPanel, onRestoreFromHistory, onShowPolicyPage, onShowBlogPage }) => {
    const { pinnedCalculators } = useTheme();
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    
    const allCalculatorsFlat = useMemo(() => calculatorsData.flatMap(cat => cat.items), []);
    
    const suggestedCalculators = useMemo(() => {
        return suggestedCalculatorNames
            .map(name => allCalculatorsFlat.find(calc => calc.name === name))
            .filter((item): item is NonNullable<typeof item> => !!item);
    }, [allCalculatorsFlat]);
    
    const pinnedCalculatorsData = useMemo(() => {
        return pinnedCalculators
            .map(pinName => allCalculatorsFlat.find(calc => calc.name === pinName))
            .filter((item): item is NonNullable<typeof item> => !!item);
    }, [pinnedCalculators, allCalculatorsFlat]);
    
    const latestBlogs = blogPosts.slice(0, 2);

    const realEstateIndex = calculatorsData.findIndex(cat => cat.category === 'Real Estate & Construction');
    const categoriesBeforeBlog = realEstateIndex !== -1 ? calculatorsData.slice(0, realEstateIndex + 1) : calculatorsData;
    const categoriesAfterBlog = realEstateIndex !== -1 ? calculatorsData.slice(realEstateIndex + 1) : [];

    return (
        <div className="flex flex-col min-h-screen">
            <SearchModal 
                isOpen={isSearchModalOpen} 
                onClose={() => setIsSearchModalOpen(false)}
                onSelectCalculator={onSelectCalculator}
            />
             <header 
                id="onboarding-header"
                className="home-header flex items-center justify-between p-4"
            >
                <button onClick={onToggleSidebar} id="onboarding-sidebar-toggle" className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Open sidebar menu">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex items-center gap-2 text-primary">
                    <Logo />
                    <h1 className="text-xl font-bold">All Type Calculator</h1>
                </div>
                <div className="flex items-center">
                    <button onClick={() => setIsSearchModalOpen(true)} id="onboarding-search-toggle" className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Search calculators">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={onToggleHistoryPanel} className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="View history">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </button>
                </div>
            </header>

            <main className="flex-grow p-4 sm:p-6 lg:p-8">
                {pinnedCalculators.length > 0 && (
                    <section className="mb-8" aria-labelledby="pinned-calculators">
                        <h2 id="pinned-calculators" className="text-2xl font-semibold mb-2 text-on-surface flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 9.586V4a1 1 0 011-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            Pinned
                        </h2>
                        <CalculatorCarousel items={pinnedCalculatorsData} onSelectCalculator={onSelectCalculator} />
                    </section>
                )}

                <section className="mb-8" aria-labelledby="suggested-calculators">
                    <h2 id="suggested-calculators" className="text-2xl font-semibold mb-2 text-on-surface flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 112 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6H6a1 1 0 110-2h1V3a1 1 0 01-1-1zm11 1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0V6h1a1 1 0 100-2h-1V3zM4 12a1 1 0 011-1h1v-1a1 1 0 112 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H5a1 1 0 01-1-1zm11 1a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" clipRule="evenodd" /></svg>
                        Suggested For You
                    </h2>
                     <CalculatorCarousel items={suggestedCalculators} onSelectCalculator={onSelectCalculator} pinId={'onboarding-pin-target'} />
                </section>
               
                <RecentHistory onToggleHistoryPanel={onToggleHistoryPanel} onRestore={onRestoreFromHistory} />
                
                <div id="onboarding-main-content">
                    {categoriesBeforeBlog.map((category, index) => (
                        <React.Fragment key={category.category}>
                            <section className="mb-8" aria-labelledby={category.category.replace(/\s+/g, '-')}>
                                <h2 id={category.category.replace(/\s+/g, '-')} className={`text-2xl font-semibold mb-4 text-on-surface`}>{category.category}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {category.items.map((item: any) => (
                                        <CalculatorCard key={item.name} name={item.name} icon={item.icon} isPremium={item.isPremium} onClick={() => onSelectCalculator(item.name, item.isPremium)} />
                                    ))}
                                </div>
                            </section>
                            {(index + 1) % 2 === 0 && <AdsensePlaceholder />}
                        </React.Fragment>
                    ))}

                    <section className="my-12" aria-labelledby="latest-blogs">
                        <div className="flex justify-between items-center mb-4">
                            <h2 id="latest-blogs" className="text-2xl font-semibold text-on-surface">Latest From Our Blog</h2>
                            <button onClick={() => onShowBlogPage('list')} className="text-sm font-semibold text-primary hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                            {latestBlogs.map(post => (
                                <BlogCard key={post.slug} post={post} onSelect={() => onShowBlogPage('post', post.slug)} />
                            ))}
                        </div>
                    </section>

                     {categoriesAfterBlog.map((category, index) => (
                        <React.Fragment key={category.category}>
                            <section className="mb-8" aria-labelledby={category.category.replace(/\s+/g, '-')}>
                                <h2 id={category.category.replace(/\s+/g, '-')} className={`text-2xl font-semibold mb-4 text-on-surface`}>{category.category}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {category.items.map((item: any) => (
                                        <CalculatorCard key={item.name} name={item.name} icon={item.icon} isPremium={item.isPremium} onClick={() => onSelectCalculator(item.name, item.isPremium)} />
                                    ))}
                                </div>
                            </section>
                            {(index + 1) % 2 !== 0 && <AdsensePlaceholder />}
                        </React.Fragment>
                    ))}
                </div>

                <Footer onShowPolicyPage={onShowPolicyPage} onShowBlogPage={onShowBlogPage} />
            </main>
        </div>
    );
};

export default HomePage;