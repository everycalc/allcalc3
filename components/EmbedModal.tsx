import React, { useState, useEffect } from 'react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorName: string | null;
}

const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, calculatorName }) => {
  const [copied, setCopied] = useState(false);

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

  if (!isOpen || !calculatorName) return null;

  const embedUrl = `${window.location.origin}?embed=${encodeURIComponent(calculatorName)}`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" style="border:1px solid #ccc; border-radius: 8px;" title="${calculatorName}"></iframe>\n<!-- Powered by All Calculation -->`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy embed code: ', err);
      alert('Failed to copy code.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-lg bg-theme-secondary rounded-xl shadow-2xl p-6 transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="embed-modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="embed-modal-title" className="text-xl font-bold text-theme-primary">Embed Calculator</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 text-theme-secondary" aria-label="Close embed dialog">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-theme-secondary">Copy and paste this code into your website or blog to embed the "{calculatorName}".</p>
          <textarea
            readOnly
            value={embedCode}
            className="w-full h-32 bg-theme-primary text-theme-primary rounded-md p-2 text-xs font-mono focus:ring-2 focus:ring-primary"
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          />
          <button
            onClick={handleCopy}
            className="w-full bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors duration-200"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbedModal;
