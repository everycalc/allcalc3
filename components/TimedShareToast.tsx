import React, { useState, useEffect } from 'react';

interface TimedShareToastProps {
  isOpen: boolean;
  onClose: () => void;
  onShared: () => void;
}

const TimedShareToast: React.FC<TimedShareToastProps> = ({ isOpen, onClose, onShared }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const textToShare = `Check out this awesome calculator app! It has everything you need: ${window.location.origin}`;

  useEffect(() => {
    let timer: any = null;
    if (isOpen) {
      // Reset state when it opens
      setShowCloseButton(false);
      timer = setTimeout(() => {
        setShowCloseButton(true);
      }, 5000); // Show close button after 5 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  const handleShare = async () => {
    onShared(); // Notify AppContent that a share has occurred
    onClose(); // Close toast immediately on action
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'All Type Calculator',
          text: textToShare,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy for desktop
      try {
        await navigator.clipboard.writeText(textToShare);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-fade-in-up">
      <div className="toast-content rounded-2xl shadow-2xl p-4 flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 text-primary bg-primary-container p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.001l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
        </div>

        {/* Text */}
        <div className="flex-grow">
            <h3 className="font-bold text-on-surface">Enjoying the app?</h3>
            <p className="text-sm text-on-surface-variant">Sharing helps us grow!</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
            <button
                onClick={handleShare}
                className="btn-primary font-bold py-2 px-4 rounded-full text-sm"
            >
                Share
            </button>
            {showCloseButton && (
                 <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high animate-fade-in" aria-label="Close share prompt">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default TimedShareToast;