import React, { useState, useEffect } from 'react';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHistory: () => void;
  onOpenTheme: () => void;
}

const guideSteps = [
  {
    targetId: 'onboarding-search-toggle',
    title: 'Find Calculators Fast',
    content: 'Use the search button to quickly find any calculator you need.',
    position: 'bottom-end',
  },
  {
    targetId: 'onboarding-sidebar-toggle',
    title: 'Customize Your Experience',
    content: 'Open the sidebar to change themes, view your saved dates, and more.',
    position: 'bottom-start',
  },
  {
    targetId: 'onboarding-pin-target',
    title: 'Pin Your Favorites',
    content: 'Click the pin icon on any calculator to add it to the top of your home page for quick access.',
    position: 'bottom',
  },
  {
    targetId: 'onboarding-main-content',
    title: 'Full History',
    content: 'Your recent calculations appear here. You can view, restore, or clear your entire history.',
    position: 'top',
  },
];

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose, onOpenHistory, onOpenTheme }) => {
  const [step, setStep] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const [contentStyle, setContentStyle] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    const currentStep = guideSteps[step];
    const targetElement = document.getElementById(currentStep.targetId);

    if (targetElement) {
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
      });

      let top = 0, left = 0, transform = '';
      const offset = 12;

      switch(currentStep.position) {
          case 'top': top = rect.top - offset; left = rect.left + rect.width / 2; transform = 'translate(-50%, -100%)'; break;
          case 'bottom-start': top = rect.bottom + offset; left = rect.left; transform = 'translate(0, 0)'; break;
          case 'bottom-end': top = rect.bottom + offset; left = rect.right; transform = 'translate(-100%, 0)'; break;
          case 'bottom': default: top = rect.bottom + offset; left = rect.left + rect.width / 2; transform = 'translate(-50%, 0)'; break;
      }
      
      setContentStyle({ top: `${top}px`, left: `${left}px`, transform });
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < guideSteps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };
  
  const handleFinalAction = (action: () => void) => {
    action();
    onClose();
  }

  const currentStepData = guideSteps[step];

  return (
    <div className="fixed inset-0 z-[9997]">
      <div style={spotlightStyle}></div>
      <div
        style={contentStyle}
        className="fixed w-72 bg-theme-secondary rounded-lg shadow-2xl p-4 text-center z-[9999] animate-fade-in"
      >
        <h3 className="font-bold text-lg text-primary mb-2">{currentStepData.title}</h3>
        <p className="text-sm text-theme-primary mb-4">{currentStepData.content}</p>
        <div className="flex justify-between items-center">
            <button onClick={onClose} className="text-xs text-theme-secondary hover:underline">Skip</button>
            <span className="text-xs text-theme-secondary">{step + 1} / {guideSteps.length}</span>
            <button onClick={handleNext} className="text-sm bg-primary text-on-primary font-bold py-1.5 px-4 rounded-md hover:bg-primary-light transition-colors">
              {step === guideSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;