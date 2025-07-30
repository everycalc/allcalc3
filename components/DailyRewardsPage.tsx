import React, { useState, useEffect } from 'react';
import { useDailyRewards } from '../contexts/DailyRewardsContext';
import { useFuel } from '../contexts/FuelContext';
import RewardedAdModal from './RewardedAdModal';
import AdsensePlaceholder from './AdsensePlaceholder';

interface DailyRewardsPageProps {
  onBack: () => void;
}

const REWARDS = [1, 1, 2, 3, 2, 3, 5]; // Must match context
const AD_DAYS = [4, 7]; // Must match context

const DailyRewardsPage: React.FC<DailyRewardsPageProps> = ({ onBack }) => {
    const { streak, canClaimReward, claimReward } = useDailyRewards();
    const { addFuel } = useFuel();
    const [showAd, setShowAd] = useState(false);
    const [pendingReward, setPendingReward] = useState(0);

    const handleClaimClick = () => {
        const { success, reward, requiresAd } = claimReward();
        if (success) {
            if (requiresAd) {
                setPendingReward(reward);
                setShowAd(true);
            } else {
                // Reward already added by context
                // Maybe show a success message
            }
        }
    };
    
    const handleAdComplete = () => {
        addFuel(pendingReward);
        // Manually update the state via a re-claim which will now succeed without ad
        claimReward(); 
        setShowAd(false);
        setPendingReward(0);
        
        // Request notification permission after first ad-based claim
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            });
        }
    };

    const isClaimable = canClaimReward();
    const currentDayIndex = isClaimable ? (streak % REWARDS.length) : ((streak -1) % REWARDS.length);


    return (
        <div className="flex flex-col min-h-screen bg-theme-primary">
            {showAd && <RewardedAdModal duration={5} rewardAmount={pendingReward} onClose={() => setShowAd(false)} onComplete={handleAdComplete} />}
            <header className="bg-theme-secondary/80 backdrop-blur-sm p-4 flex items-center shadow-md sticky top-0 z-10 text-theme-primary">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Go back to home page">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-4">Daily Rewards</h1>
            </header>
            <main className="flex-grow p-4 max-w-2xl mx-auto w-full">
                <AdsensePlaceholder />
                <div className="bg-theme-secondary p-6 rounded-lg text-center mt-6">
                    <h2 className="text-2xl font-bold text-primary">Come back every day!</h2>
                    <p className="text-theme-secondary mt-2">Maintain your streak to earn bigger Calculation Fuel rewards. Your current streak is:</p>
                    <p className="text-6xl font-extrabold text-theme-primary my-4">{streak} {streak === 1 ? 'Day' : 'Days'}</p>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 my-6">
                        {REWARDS.map((reward, index) => {
                            const dayNumber = index + 1;
                            const isClaimed = !isClaimable && dayNumber <= currentDayIndex + 1;
                            const isCurrent = isClaimable && dayNumber === currentDayIndex + 1;
                            const isFuture = dayNumber > currentDayIndex + 1;

                            return (
                                <div key={dayNumber} className={`p-3 rounded-lg border-2 ${isCurrent ? 'border-primary animate-pulse' : isClaimed ? 'border-green-500 bg-green-500/10' : 'border-theme-tertiary'}`}>
                                    <p className="text-xs font-bold text-theme-secondary">Day {dayNumber}</p>
                                    <p className="text-2xl font-bold my-1">{`+${reward}`}</p>
                                    <div className="h-4 flex items-center justify-center">
                                       {isClaimed ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> : AD_DAYS.includes(dayNumber) && <span className="text-xs bg-primary/50 text-on-primary px-1 rounded">Ad</span> }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    <button 
                        onClick={handleClaimClick}
                        disabled={!isClaimable}
                        className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors duration-200 shadow-lg disabled:bg-theme-tertiary disabled:cursor-not-allowed"
                    >
                        {isClaimable ? `Claim Day ${currentDayIndex + 1} Reward` : "You've already claimed today's reward!"}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default DailyRewardsPage;