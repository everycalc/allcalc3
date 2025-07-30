import React, { useState, useEffect, useRef } from 'react';

interface UnskippableAdModalProps {
  onComplete: () => void;
  duration?: number;
}

const UnskippableAdModal: React.FC<UnskippableAdModalProps> = ({ onComplete, duration = 15 }) => {
  const [countdown, setCountdown] = useState(duration);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Ad loading logic - runs only once on mount
    const adContainer = adContainerRef.current;
    if (adContainer && adContainer.childElementCount === 0) {
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
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("Unskippable ad push error:", e);
        }
    }
    return () => {
        document.body.style.overflow = '';
    };
  }, []);

   useEffect(() => {
     // Countdown timer logic
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onComplete();
    }
  }, [countdown, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md text-right mb-2">
        <div className="unskippable-ad-timer">
            Your download will begin in <span>{countdown}s</span>
        </div>
      </div>
      <div ref={adContainerRef} className="w-full max-w-md bg-theme-tertiary rounded-lg aspect-video flex items-center justify-center overflow-hidden">
        {/* Ad slot will be injected here */}
      </div>
      <div className="unskippable-progress-container">
        <div 
          style={{ animationDuration: `${duration}s` }} 
          className="unskippable-progress-bar"
        ></div>
      </div>
      <div className="mt-4 text-center text-white/50 text-xs">Advertisement</div>
    </div>
  );
};

export default UnskippableAdModal;