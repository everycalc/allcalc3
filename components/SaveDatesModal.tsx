import React, { useEffect } from 'react';
import DateTracker from './DateTracker';
import AdsensePlaceholder from './AdsensePlaceholder';

interface SaveDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveDatesModal: React.FC<SaveDatesModalProps> = ({ isOpen, onClose }) => {
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className="modal-content relative w-full max-w-lg p-6 transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-on-surface">Manage Dates</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant" aria-label="Close date manager">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <DateTracker />
        <div className="mt-4">
            <AdsensePlaceholder />
        </div>
      </div>
    </div>
  );
};

export default SaveDatesModal;