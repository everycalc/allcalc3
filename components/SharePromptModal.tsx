import React, { useState, useEffect } from 'react';
import ShareButton from './ShareButton';

interface SharePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePromptModal: React.FC<SharePromptModalProps> = ({ isOpen, onClose }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={showCloseButton ? onClose : undefined} // Only allow closing via overlay if button is visible
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-sm bg-theme-secondary rounded-xl shadow-2xl p-6 text-center transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <h2 id="share-modal-title" className="text-2xl font-bold text-theme-primary mb-2">Before you go...</h2>
        <p className="text-theme-secondary mb-6">Enjoying this app? Help spread the word by sharing it with your friends!</p>
        <div className="flex justify-center">
            <ShareButton 
                textToShare={`Check out this awesome calculator app! It has everything you need: ${window.location.origin}`} 
                onShared={() => setShowCloseButton(true)}
            />
        </div>
        <div className="h-10 mt-4"> {/* Placeholder to prevent layout shift */}
          {showCloseButton && (
            <button 
              onClick={onClose} 
              className="w-full text-sm text-theme-secondary font-semibold py-2 px-4 rounded-md hover:bg-theme-tertiary transition-colors animate-fade-in"
            >
              No, thanks
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharePromptModal;