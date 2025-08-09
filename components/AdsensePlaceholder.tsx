import React, { useEffect, useRef } from 'react';
import { usePro } from '../contexts/ProContext';

const AdsensePlaceholder: React.FC = () => {
  const { isPro } = usePro();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Abort ad-loading logic if in pro mode or the ref isn't ready.
    if (isPro || !adRef.current) {
      return;
    }
    
    const adContainer = adRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Check if an ad has already been loaded to prevent re-pushing
            if (adContainer.querySelector('.adsbygoogle-filled') || adContainer.querySelector('iframe')) {
              observer.unobserve(adContainer);
              return;
            }

            try {
              if ((window as any).adsbygoogle) {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
              } else {
                adContainer.innerHTML = '<div class="text-center text-xs text-on-surface-variant p-4 h-full flex items-center justify-center">Advertisement</div>';
              }
            } catch (e) {
              // This can happen if the ad slot is not visible or has an invalid size.
              // We log the error but don't crash the app.
              console.error("AdSense push error:", e);
              adContainer.innerHTML = '<div class="text-center text-xs text-on-surface-variant p-4 h-full flex items-center justify-center">Ad could not be displayed.</div>';
            } finally {
              // Stop observing once we've tried to push the ad.
              observer.unobserve(adContainer);
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible.
      }
    );

    observer.observe(adContainer);

    return () => {
      if (adContainer) {
        observer.unobserve(adContainer);
      }
    };
  }, [isPro]); // Re-run effect if pro status changes.

  // Conditionally render the ad placeholder only if not in pro mode.
  if (isPro) {
    return null;
  }

  return (
    <div className="adsense-placeholder w-full min-h-[100px] my-4 flex items-center justify-center rounded-2xl">
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