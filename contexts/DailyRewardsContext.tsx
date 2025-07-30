import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useFuel } from './FuelContext';

interface DailyRewardsData {
  streak: number;
  lastClaimedDate: string | null; // YYYY-MM-DD
}

interface DailyRewardsContextType {
  streak: number;
  lastClaimedDate: string | null;
  canClaimReward: () => boolean;
  claimReward: () => { success: boolean; reward: number; requiresAd: boolean };
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const DailyRewardsContext = createContext<DailyRewardsContextType>({
  streak: 0,
  lastClaimedDate: null,
  canClaimReward: () => false,
  claimReward: () => ({ success: false, reward: 0, requiresAd: false }),
});

export const useDailyRewards = () => useContext(DailyRewardsContext);

const REWARDS = [1, 1, 2, 3, 2, 3, 5]; // Example rewards for a 7-day streak
const AD_DAYS = [4, 7]; // Days that require an ad to claim

export const DailyRewardsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rewardsData, setRewardsData] = useState<DailyRewardsData>({ streak: 0, lastClaimedDate: null });
  const { addFuel } = useFuel();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('dailyRewards');
      if (storedData) {
        setRewardsData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load daily rewards data from localStorage", error);
    }
  }, []);

  const saveData = (data: DailyRewardsData) => {
    try {
      localStorage.setItem('dailyRewards', JSON.stringify(data));
      setRewardsData(data);
    } catch (error) {
      console.error("Failed to save daily rewards data to localStorage", error);
    }
  };

  const canClaimReward = (): boolean => {
    return rewardsData.lastClaimedDate !== getTodayDateString();
  };

  const claimReward = () => {
    if (!canClaimReward()) {
      return { success: false, reward: 0, requiresAd: false };
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (rewardsData.lastClaimedDate === yesterdayString) {
      newStreak = (rewardsData.streak % REWARDS.length) + 1;
    }

    const rewardIndex = (newStreak - 1) % REWARDS.length;
    const rewardAmount = REWARDS[rewardIndex];
    const requiresAd = AD_DAYS.includes(newStreak);

    // If it doesn't require an ad, grant the reward immediately
    if (!requiresAd) {
      addFuel(rewardAmount);
      saveData({ streak: newStreak, lastClaimedDate: getTodayDateString() });
    }
    
    // For ad-required rewards, the UI will call addFuel and saveData on ad completion
    return { success: true, reward: rewardAmount, requiresAd };
  };

  return (
    <DailyRewardsContext.Provider value={{ ...rewardsData, canClaimReward, claimReward }}>
      {children}
    </DailyRewardsContext.Provider>
  );
};