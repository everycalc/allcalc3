import React, { useState, useEffect, useRef } from 'react';

interface RewardedAdModalProps {
  onClose: () => void; // For closing without getting reward
  onComplete: () => void; // After watching the ad
  duration?: number;
  rewardAmount?: number; // Now optional, for display only
}

const RewardedAdModal: React.FC<RewardedAdModalProps> = ({ onClose, onComplete, duration = 10, rewardAmount }) => {
  const [isComplete, setIsComplete] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsComplete(true);
    }, duration * 1000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [duration]);

  useEffect(() => {
    const adContainer = adContainerRef.current;
    if (!adContainer) return;
    
    // Use a small timeout to ensure the AdSense script is ready
    const timeoutId = setTimeout(() => {
      const adSlot = document.createElement('ins');
      adSlot.className = 'adsbygoogle';
      adSlot.style.display = 'block';
      adSlot.style.width = '100%';
      adSlot.style.height = '100%';
      adSlot.setAttribute('data-ad-client', 'ca-pub-2892214526865008');
      adSlot.setAttribute('data-ad-slot', '7805870574');
      adSlot.setAttribute('data-ad-format', 'auto');
      adSlot.setAttribute('data-full-width-responsive', 'true');
      adContainer.appendChild(adSlot);

      try {
        if ((window as any).adsbygoogle) {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } else {
            adContainer.innerHTML = '<div class="text-center text-xs text-white/50 p-4 h-full flex items-center justify-center">Advertisement</div>';
        }
      } catch (e) {
        console.error("Rewarded ad push error:", e);
        adContainer.innerHTML = '<div class="text-center text-xs text-white/50 p-4 h-full flex items-center justify-center">Ad could not be displayed.</div>';
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleClaim = () => {
      if (isComplete) {
          onComplete();
      }
  }

  const buttonClasses = `
    text-white px-4 py-2 rounded-lg transition-colors bg-white/10 
    hover:bg-white/20 disabled:cursor-not-allowed 
    disabled:text-white/40 disabled:bg-white/5
    skip-button-filling-animation
  `;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md flex justify-between items-center mb-2">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/20 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button
                onClick={handleClaim}
                disabled={!isComplete}
                className={buttonClasses}
                style={{ '--animation-duration': `${duration}s` } as React.CSSProperties}
            >
                <span className="relative z-10">{isComplete ? `Claim Reward${rewardAmount ? ` (+${rewardAmount} Fuel)` : ''}` : 'Claim Reward'}</span>
            </button>
      </div>
      <div ref={adContainerRef} className="w-full max-w-md bg-theme-tertiary rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
        {/* Ad slot will be injected here */}
      </div>
      <div className="mt-4 text-center text-white/50 text-xs">Watch ad to earn a reward</div>
    </div>
  );
};

export default RewardedAdModal;