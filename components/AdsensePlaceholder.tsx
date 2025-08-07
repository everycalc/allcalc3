import React, { useEffect, useRef } from 'react';

const AdsensePlaceholder: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adContainer = adRef.current;
    if (!adContainer) return;

    // Use a small timeout to ensure the AdSense script is ready
    const timeoutId = setTimeout(() => {
      // Check if an ad has already been loaded in this container
      if (adContainer.querySelector('.adsbygoogle-filled')) {
        return;
      }

      try {
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } else {
            adContainer.innerHTML = '<div class="text-center text-xs text-theme-secondary p-4 h-full flex items-center justify-center">Advertisement</div>';
        }
      } catch (e) {
        console.error("AdSense push error:", e);
        adContainer.innerHTML = '<div class="text-center text-xs text-theme-secondary p-4 h-full flex items-center justify-center">Ad could not be displayed.</div>';
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full min-h-[100px] my-4 flex items-center justify-center bg-theme-secondary/20 rounded-lg">
      <div ref={adRef} className="w-full h-full">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100px' }}
          data-ad-client="ca-pub-2892214526865008"
          data-ad-slot="7805870574"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default AdsensePlaceholder;