import React, { useState, useEffect } from 'react';
import { useFuel } from '../contexts/FuelContext';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const [referralLink, setReferralLink] = useState('');
  const [status, setStatus] = useState('');
  const { addFuel } = useFuel();
  const canShare = !!navigator.share;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      let refCode = localStorage.getItem('userRefCode');
      if (!refCode) {
        refCode = `REF${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        localStorage.setItem('userRefCode', refCode);
      }
      setReferralLink(`${window.location.origin}?ref=${refCode}`);
    } else {
      document.body.style.overflow = '';
      setStatus('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setStatus('Copied!');
      setTimeout(() => setStatus(''), 2500);
    }).catch(err => console.error('Failed to copy link: ', err));
  };
  
  const handleShare = async () => {
      if (canShare) {
          try {
              await navigator.share({
                  title: 'All Calculation App',
                  text: 'Check out this awesome calculator app! It has everything you need, and it works offline.',
                  url: referralLink,
              });
              // On successful share completion
              addFuel(5);
              setStatus('Shared! +5 Fuel added! ⛽');
              setTimeout(() => setStatus(''), 3000);
          } catch (error) {
              console.log('User cancelled share or error occurred:', error);
          }
      }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className="modal-content relative w-full max-w-md p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-primary mb-2">Refer a Friend, Get Fuel!</h2>
        <p className="text-on-surface-variant mb-4">Share the app with a friend. When they visit your link, they get <strong className="text-on-surface">+5 Fuel</strong> to start. You get <strong className="text-on-surface">+5 Fuel</strong> instantly just for sharing!</p>
        
        <div className="space-y-3">
            {canShare && (
                <button onClick={handleShare} className="btn-primary w-full font-bold py-3 px-4 rounded-lg">
                    Share Link & Get +5 Fuel
                </button>
            )}
            <div className="flex bg-surface-container-highest p-2 rounded-lg">
              <input 
                type="text" 
                readOnly 
                value={referralLink} 
                className="w-full bg-transparent text-on-surface focus:outline-none text-sm"
              />
              <button
                onClick={handleCopy}
                className="btn-secondary font-bold py-2 px-4 rounded-md flex-shrink-0"
              >
                Copy
              </button>
            </div>
        </div>

        {status && <p className="text-sm text-green-400 mt-3 animate-fade-in">{status}</p>}
        
        <button onClick={onClose} className="mt-6 text-sm text-on-surface-variant hover:underline">Close</button>
      </div>
    </div>
  );
};

export default ReferralModal;