import React, { useState, useEffect, useRef } from 'react';

interface InterstitialAdModalProps {
  onClose: () => void;
}

const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({ onClose }) => {
  const [isSkippable, setIsSkippable] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start the animation immediately on mount
    setIsFilling(true);

    // Make the button skippable after 5 seconds
    const timer = setTimeout(() => {
      setIsSkippable(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const adContainer = adContainerRef.current;
    if (!adContainer) return;

    // Dynamically create the ad slot to ensure a fresh one every time
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

    // Push the ad
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Interstitial ad push error:", e);
    }

    // Cleanup on unmount
    return () => {
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
  }, []);

  const buttonClasses = `
    text-white px-4 py-2 rounded-lg transition-colors bg-white/10 
    hover:bg-white/20 disabled:cursor-not-allowed 
    disabled:text-white/40 disabled:bg-white/5
    skip-button-filling-animation
    ${isFilling ? 'is-filling' : ''}
  `;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md text-right mb-2">
         <button
            onClick={onClose}
            disabled={!isSkippable}
            className={buttonClasses}
          >
            <span className="relative z-10">Skip Ad →</span>
         </button>
      </div>
      <div ref={adContainerRef} className="w-full max-w-md bg-theme-tertiary rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
        {/* Ad slot will be injected here */}
      </div>
      <div className="mt-4 text-center text-white/50 text-xs">Advertisement</div>
    </div>
  );
};

export default InterstitialAdModal;