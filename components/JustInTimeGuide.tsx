import React, { useState, useEffect } from 'react';

interface JustInTimeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const JustInTimeGuide: React.FC<JustInTimeGuideProps> = ({ isOpen, onClose, targetId, content, position = 'bottom' }) => {
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!isOpen) return;

    // Use a timeout to ensure the target element is rendered and has its final position
    const timer = setTimeout(() => {
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          const rect = targetElement.getBoundingClientRect();
          const padding = 8;
          
          setSpotlightStyle({
            position: 'fixed',
            left: `${rect.left - padding}px`,
            top: `${rect.top - padding}px`,
            width: `${rect.width + padding * 2}px`,
            height: `${rect.height + padding * 2}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            transition: 'all 0.3s ease-in-out',
            pointerEvents: 'none',
            zIndex: 9998,
          });

          let top = 0, left = 0, transform = '';
          const offset = 12;

          switch(position) {
              case 'top': 
                top = rect.top - offset; 
                left = rect.left + rect.width / 2; 
                transform = 'translate(-50%, -100%)'; 
                break;
              case 'left':
                top = rect.top + rect.height / 2;
                left = rect.left - offset;
                transform = 'translate(-100%, -50%)';
                break;
              case 'right':
                top = rect.top + rect.height / 2;
                left = rect.right + offset;
                transform = 'translate(0, -50%)';
                break;
              case 'bottom': 
              default: 
                top = rect.bottom + offset; 
                left = rect.left + rect.width / 2; 
                transform = 'translate(-50%, 0)'; 
                break;
          }
          
          setContentStyle({ top: `${top}px`, left: `${left}px`, transform, zIndex: 9999, position: 'fixed' });
        }
    }, 100); // Small delay to ensure correct positioning

    const handleClickOutside = (event: MouseEvent) => {
        const contentEl = document.getElementById('jit-content');
        // Check if the click is outside the content box
        if (contentEl && !contentEl.contains(event.target as Node)) {
            onClose();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [isOpen, targetId, position, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9997]">
      <div style={spotlightStyle}></div>
      <div
        id="jit-content"
        style={contentStyle}
        className="w-64 bg-theme-secondary rounded-lg shadow-2xl p-4 text-center animate-fade-in"
      >
        <p className="text-sm text-theme-primary mb-4">{content}</p>
        <button onClick={onClose} className="text-sm bg-primary text-on-primary font-bold py-1.5 px-4 rounded-md hover:bg-primary-light transition-colors">
          Got it
        </button>
      </div>
    </div>
  );
};

export default JustInTimeGuide;
