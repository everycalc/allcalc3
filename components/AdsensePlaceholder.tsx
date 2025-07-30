import React, { useEffect, useRef } from 'react';

const AdsensePlaceholder: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    const currentAdRef = adRef.current;

    if (!currentAdRef) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pushedRef.current) {
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushedRef.current = true; // Mark as pushed to prevent multiple pushes
          } catch (e) {
            console.error("Adsense error:", e);
          }
          // Once the ad is pushed, we can stop observing
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(currentAdRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={adRef} className="w-full min-h-[100px] my-4 flex items-center justify-center">
      {/* test for app */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-2892214526865008"
        data-ad-slot="7805870574"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdsensePlaceholder;
