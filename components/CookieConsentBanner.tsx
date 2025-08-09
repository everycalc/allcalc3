import React, { useState, useEffect } from 'react';

interface CookieConsentBannerProps {
  onShowPrivacyPolicy: () => void;
}

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onShowPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'true') {
      // Use a small delay to prevent layout shift on load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-container-low/90 backdrop-blur-sm p-4 z-50 animate-fade-in-up shadow-lg border-t border-outline-variant">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-on-surface text-center sm:text-left">
          We use cookies to personalize content and ads, and to analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our{' '}
          <button onClick={onShowPrivacyPolicy} className="text-primary hover:underline font-semibold">Privacy Policy</button> for more details.
        </p>
        <button
          onClick={handleAccept}
          className="btn-primary font-bold py-2 px-6 rounded-md flex-shrink-0"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;