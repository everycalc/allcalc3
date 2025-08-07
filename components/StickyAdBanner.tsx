import React, { useEffect, useRef, useState } from 'react';

const StickyAdBanner: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && adRef.current && !adRef.current.hasChildNodes()) {
          try {
            const adSlot = document.createElement('ins');
            adSlot.className = 'adsbygoogle';
            adSlot.style.display = 'block';
            adSlot.style.width = '100%';
            adSlot.style.height = '100%';
            adSlot.setAttribute('data-ad-client', 'ca-pub-2892214526865008'); // Your client ID
            adSlot.setAttribute('data-ad-slot', '7805870574'); // Your ad slot ID
            
            adRef.current?.appendChild(adSlot);

            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            
            // Check if the ad loaded by looking for an iframe
            setTimeout(() => {
                if (adRef.current?.querySelector('iframe')) {
                    setIsAdLoaded(true);
                }
            }, 1000);

          } catch (e) {
            console.error("Sticky AdSense error:", e);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-30 bg-theme-secondary/80 backdrop-blur-sm transition-all duration-300 ${isAdLoaded ? 'h-[60px]' : 'h-0'}`}>
      <div ref={adRef} className="w-full h-full flex items-center justify-center">
        {/* Ad will be injected here */}
      </div>
    </div>
  );
};

export default StickyAdBanner;