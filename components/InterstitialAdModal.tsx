import React, { useState, useEffect, useRef } from 'react';

interface InterstitialAdModalProps {
  onClose: () => void;
}

const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({ onClose }) => {
  const [isSkippable, setIsSkippable] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const DURATION = 5; // 5 seconds

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsSkippable(true);
    }, DURATION * 1000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

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
        console.error("Interstitial ad push error:", e);
        adContainer.innerHTML = '<div class="text-center text-xs text-white/50 p-4 h-full flex items-center justify-center">Ad could not be displayed.</div>';
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const handleCloseClick = () => {
    if (showWarning) {
        onClose(); // Proceed with closing
    } else {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000); // Hide warning after 3s
    }
  }


  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
       <div className="w-full max-w-md flex justify-between items-center mb-2">
            <div className="h-8 flex items-center">
                {showWarning && <span className="ad-modal-warning animate-fade-in">Calculation will be cancelled. Click again to confirm.</span>}
            </div>
            <button onClick={handleCloseClick} className="ad-modal-close-btn" aria-label="Close ad">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
      </div>
      <div ref={adContainerRef} className="ad-modal-content">
        {/* Ad slot will be injected here */}
      </div>
       <div className="w-full max-w-md mt-4 text-center">
        <button
            onClick={onClose}
            disabled={!isSkippable}
            className="ad-modal-action-btn w-full font-semibold"
        >
            {!isSkippable && <div className="ad-modal-progress-fill" style={{ animationDuration: `${DURATION}s` }}></div>}
            <span className="relative z-10">{isSkippable ? 'Continue to Calculation' : 'Loading Ad...'}</span>
        </button>
      </div>
    </div>
  );
};

export default InterstitialAdModal;
