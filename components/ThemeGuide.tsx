import React, { useState, useEffect } from 'react';

interface ThemeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeGuide: React.FC<ThemeGuideProps> = ({ isOpen, onClose }) => {
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const [contentStyle, setContentStyle] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    const targetId = 'theme-selector-container';
    const padding = 15;
    
    // Use a timeout to allow the modal to render first
    const timer = setTimeout(() => {
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
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            pointerEvents: 'none',
          });
    
          const contentTop = rect.top - padding - 20; // 20px above spotlight
          setContentStyle({
            position: 'absolute',
            top: `${contentTop}px`,
            left: '50%',
            transform: 'translate(-50%, -100%)',
            width: 'calc(100% - 2rem)',
            maxWidth: '22rem',
            transition: 'all 0.3s ease-in-out',
          });
        }
    }, 50); // Small delay

    return () => clearTimeout(timer);

  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] animate-fade-in" onClick={onClose}>
      <div style={spotlightStyle}></div>
      <div
        className="relative w-full bg-theme-primary rounded-xl shadow-2xl p-6 text-center"
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">🎨</div>
        <h2 className="text-2xl font-bold text-theme-primary mb-2">Make It Yours!</h2>
        <p className="text-theme-secondary mb-6">You can change colors, switch to a glass theme, use light/dark mode, and even reorder the calculator categories on the home page.</p>
        <button onClick={onClose} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors">
            Start Customizing
        </button>
      </div>
    </div>
  );
};

export default ThemeGuide;