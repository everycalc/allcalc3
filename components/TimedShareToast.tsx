import React, { useState } from 'react';
import ShareButton from './ShareButton';

interface TimedShareToastProps {
  isOpen: boolean;
  onClose: () => void;
  textToShare: string;
}

const TimedShareToast: React.FC<TimedShareToastProps> = ({ isOpen, onClose, textToShare }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-50 animate-fade-in-up">
      <div
        className="bg-theme-secondary rounded-xl shadow-2xl p-4 flex items-center justify-between space-x-4"
        role="alert"
      >
        <div className="flex-grow">
          <p className="font-semibold text-theme-primary">Enjoying this calculator?</p>
          <p className="text-sm text-theme-secondary">Help spread the word!</p>
        </div>
        <div className="flex-shrink-0">
          <ShareButton textToShare={textToShare} onShared={() => setShowCloseButton(true)} />
        </div>
        <div className="w-8 h-8"> {/* Placeholder to prevent layout shift */}
          {showCloseButton && (
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-black/10 text-theme-secondary flex-shrink-0 animate-fade-in" 
              aria-label="Dismiss"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimedShareToast;