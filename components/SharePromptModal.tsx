import React, { useState, useEffect } from 'react';

interface SharePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePromptModal: React.FC<SharePromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const textToShare = `Check out this awesome calculator app! It has everything you need: ${window.location.origin}`;

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

  const handleShare = async () => {
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
      // Fallback to copy
      try {
        await navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
    onClose(); // Close the modal after any share action
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="modal-content relative w-full max-w-sm rounded-xl shadow-2xl p-6 text-center transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <h2 id="share-modal-title" className="text-2xl font-bold text-primary mb-2">Enjoying the app?</h2>
        <p className="text-on-surface-variant mb-6">Help spread the word by sharing it with your friends and family!</p>
        <div className="space-y-2">
            <button
                onClick={handleShare}
                className="btn-primary font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 w-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span>{copied ? 'Copied Link!' : 'Share the App'}</span>
            </button>
             <button 
              onClick={onClose} 
              className="w-full text-sm text-on-surface-variant font-semibold py-2 px-4 rounded-md hover:bg-surface-container-high transition-colors"
            >
              Maybe Later
            </button>
        </div>
      </div>
    </div>
  );
};

export default SharePromptModal;
