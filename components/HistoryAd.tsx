import React, { useEffect, useRef } from 'react';

const HistoryAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adContainer = adRef.current;
    if (!adContainer) return;

    const timeoutId = setTimeout(() => {
      if (adContainer.querySelector('.adsbygoogle-filled')) {
        return;
      }
      try {
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } else {
          adContainer.style.display = 'none'; // Hide if ad blocker is active
        }
      } catch (e) {
        console.error("Adsense history ad error:", e);
        adContainer.style.display = 'none';
      }
    }, 150);

    return () => clearTimeout(timeoutId);
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