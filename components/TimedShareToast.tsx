import React, { useState, useEffect } from 'react';

interface TimedShareToastProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimedShareToast: React.FC<TimedShareToastProps> = ({ isOpen, onClose }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const textToShare = `Check out this awesome calculator app! It has everything you need: ${window.location.origin}`;

  useEffect(() => {
    let timer: number | null = null;
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
    onClose(); // Close toast immediately on action
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'All Calculation',
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
      <div className="modal-content rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-on-surface">Like the app? Share it!</p>
        <div className="flex items-center gap-2">
            <button
                onClick={handleShare}
                className="btn-primary font-bold py-2 px-4 rounded-md text-sm flex-shrink-0"
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