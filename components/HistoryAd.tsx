
import React, { useEffect, useRef } from 'react';

const HistoryAd: React.FC = () => {
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
            console.error("Adsense history ad error:", e);
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
    <div ref={adRef} className="w-full my-4 flex items-center justify-center">
      {/* history ad */}
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '728px', height: '90px' }}
        data-ad-client="ca-pub-2892214526865008"
        data-ad-slot="5822920668"
      ></ins>
    </div>
  );
};

export default HistoryAd;
