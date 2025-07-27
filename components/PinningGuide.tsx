import React, { useState, useEffect } from 'react';

interface PinningGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const PinningGuide: React.FC<PinningGuideProps> = ({ isOpen, onClose }) => {
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const [contentStyle, setContentStyle] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const targetElement = document.getElementById('onboarding-pin-target');
      if (targetElement) {
        targetElement.style.animation = 'pulse-zoom 1.5s infinite';
        targetElement.style.zIndex = '60';
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      const targetElement = document.getElementById('onboarding-pin-target');
      if (targetElement) {
        targetElement.style.animation = '';
        targetElement.style.zIndex = '';
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const targetId = 'onboarding-pin-target';
    const padding = 10;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setSpotlightStyle({
        position: 'absolute',
        left: `${rect.left - padding}px`,
        top: `${rect.top - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
        borderRadius: '9999px',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: 'none',
      });

      const contentTop = rect.bottom + padding + 20;
      setContentStyle({
        position: 'absolute',
        top: `${contentTop}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '22rem',
        transition: 'all 0.3s ease-in-out',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in" onClick={onClose}>
      <div style={spotlightStyle}></div>
      <div
        className="relative w-full bg-theme-secondary rounded-xl shadow-2xl p-6 text-center"
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">📌</div>
        <h2 className="text-2xl font-bold text-theme-primary mb-2">Pin Your Favorites</h2>
        <p className="text-theme-secondary mb-6">Click the pin icon on any calculator to add it to a special 'Pinned' section at the top of the home page for quick access.</p>
        <button onClick={onClose} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors">
            Got It
        </button>
      </div>
    </div>
  );
};

export default PinningGuide;