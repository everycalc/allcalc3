import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFuel } from '../contexts/FuelContext';
import { useDailyRewards } from '../contexts/DailyRewardsContext';
import RewardedAdModal from './RewardedAdModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleHistory: () => void;
  onShowSavedDatesPage: () => void;
  onShowDailyRewardsPage: () => void;
  onShowPolicyPage: (page: string) => void;
  onOpenFeedbackModal: () => void;
  onOpenThemeModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggleHistory, onShowSavedDatesPage, onShowDailyRewardsPage, onShowPolicyPage, onOpenFeedbackModal, onOpenThemeModal }) => {
  const { sidebarPosition } = useTheme();
  const { fuel, addFuel } = useFuel();
  const { canClaimReward } = useDailyRewards();
  const [version, setVersion] = useState('');
  const [isRefuelModalOpen, setIsRefuelModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetch('/metadata.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setVersion(data.version);
        })
        .catch(error => {
          console.error('Failed to load version from metadata.json:', error);
          setVersion('N/A');
        });
    } else {
        document.body.style.overflow = '';
    }
    return () => {
        document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpenFeedback = () => {
    onOpenFeedbackModal();
    onClose();
  }

  const handleOpenTheme = () => {
    onOpenThemeModal();
    onClose();
  }
  
  const handlePolicyClick = (page: string) => {
    onShowPolicyPage(page);
    onClose();
  };
  
  const handleRefuelClick = () => {
    // This flow is for general refueling, not for specific actions like PDF downloads
    setIsRefuelModalOpen(true);
  }

  const handleRefuelComplete = () => {
    addFuel(3);
    setIsRefuelModalOpen(false);
  };

  const positionClasses = sidebarPosition === 'left' ? 'left-0' : 'right-0';
  const transformClasses = sidebarPosition === 'left' 
    ? (isOpen ? 'translate-x-0' : '-translate-x-full')
    : (isOpen ? 'translate-x-0' : 'translate-x-full');

  return (
    <>
      {isRefuelModalOpen && <RewardedAdModal onClose={() => setIsRefuelModalOpen(false)} onComplete={handleRefuelComplete} />}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 ${positionClasses} h-full w-full max-w-xs bg-theme-secondary shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${transformClasses}`}
      >
        <div className="flex flex-col h-full text-theme-primary">
            <header className="flex items-center justify-between p-4 border-b border-theme flex-shrink-0">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 text-theme-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </header>

            <div className="relative flex flex-col flex-grow overflow-y-auto">
                <div className="p-4 space-y-2 flex-grow">
                     <button 
                        onClick={onShowDailyRewardsPage}
                        aria-label="Daily Rewards"
                        className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors relative"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Daily Rewards</span>
                        {canClaimReward() && <span className="notification-dot"></span>}
                    </button>

                    <button 
                        onClick={() => { onToggleHistory(); onClose(); }} 
                        className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>View Full History</span>
                    </button>

                    <button 
                        onClick={onShowSavedDatesPage} 
                        aria-label="Save Dates"
                        className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>Save Dates</span>
                    </button>

                     <button 
                        onClick={handleOpenTheme} 
                        aria-label="Customize Theme and Layout"
                        className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                        <span>Theme & Customization</span>
                    </button>

                    <button 
                        onClick={handleOpenFeedback} 
                        aria-label="Give Feedback or Request a Calculator"
                        className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        <span>Feedback &amp; Request</span>
                    </button>

                    <div className="mt-4 pt-4 border-t border-theme space-y-2">
                        <h3 className="px-3 text-sm font-semibold text-theme-secondary">How Fuel Works</h3>
                        <div className="text-xs text-theme-secondary px-3 space-y-1">
                            <p>• Standard calculators use 1 Fuel.</p>
                            <p>• Expert Tools use 2 Fuel.</p>
                            <p>• When you run out, click "Refuel" below to watch a short ad for +3 Fuel!</p>
                            <p>• Ads will show after every 3 calculations when fuel is empty.</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-theme space-y-2">
                        <h3 className="px-3 text-sm font-semibold text-theme-secondary">About this App</h3>
                        <button onClick={() => handlePolicyClick('about')} className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors text-sm">About Us</button>
                        <button onClick={() => handlePolicyClick('privacy')} className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors text-sm">Privacy Policy</button>
                        <button onClick={() => handlePolicyClick('terms')} className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors text-sm">Terms of Service</button>
                        <button onClick={() => handlePolicyClick('disclaimer')} className="w-full flex items-center p-3 rounded-lg hover:bg-theme-tertiary transition-colors text-sm">Disclaimer</button>
                    </div>
                </div>
                
                <div className="text-center text-xs text-theme-secondary py-2">
                    Version {version}
                </div>
                 <div className="sticky bottom-0 bg-theme-secondary py-3 px-4 border-t border-theme">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-theme-primary">Calculation Fuel</span>
                        <span className="font-bold text-lg text-primary">{fuel}</span>
                    </div>
                    <button onClick={handleRefuelClick} className="w-full bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors shadow-lg">
                        + Refuel
                    </button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;