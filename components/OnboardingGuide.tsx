import React, { useState, useEffect } from 'react';

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const guideSteps = [
  {
    title: 'Welcome to All Calculation!',
    content: 'Here are a few tips to get you started.',
    icon: '👋',
    targetId: null,
  },
  {
    title: 'Search is Key',
    content: 'Use the search button to instantly find any calculator you need.',
    icon: '🔍',
    targetId: 'onboarding-search-toggle',
    spotlightPadding: 10,
  },
  {
    title: 'Explore More Options',
    content: 'The sidebar holds themes, full history, and other settings.',
    icon: '⚙️',
    targetId: 'onboarding-sidebar-toggle',
    spotlightPadding: 10,
  },
  {
    title: "You're All Set!",
    content: 'Contextual tips will appear as you discover new features. Enjoy the app!',
    icon: '🚀',
    targetId: null,
  }
];


const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const [contentStyle, setContentStyle] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Always reset to step 0 when the guide is opened
      setStep(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const currentStep = guideSteps[step];
    const targetId = currentStep.targetId;
    const padding = currentStep.spotlightPadding || 0;
    
    // Reset styles for non-targeted steps
    if (!targetId) {
      setSpotlightStyle({ display: 'none' });
      // Center the content box
      setContentStyle({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '22rem', // sm
      });
      return;
    }

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
        borderRadius: '8px',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: 'none',
      });

      // Position content box relative to spotlight
      const contentTop = rect.bottom + padding + 20; // 20px below spotlight
      setContentStyle({
        position: 'absolute',
        top: `${contentTop}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '22rem', // sm
        transition: 'all 0.3s ease-in-out',
      });

    }
  }, [step, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < guideSteps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const currentStepData = guideSteps[step];

  return (
    <div className="fixed inset-0 z-50 animate-fade-in" onClick={onClose}>
      <div style={spotlightStyle}></div>
      <div
        className="relative w-full bg-theme-secondary rounded-2xl shadow-2xl p-6 text-center flex flex-col"
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">{currentStepData.icon}</div>
        <h2 className="text-2xl font-bold text-theme-primary mb-2">{currentStepData.title}</h2>
        <p className="text-theme-secondary mb-6">{currentStepData.content}</p>

        <div className="flex justify-center items-center mb-6">
            {guideSteps.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full mx-1 transition-colors ${index === step ? 'bg-primary' : 'bg-theme-tertiary'}`}></div>
            ))}
        </div>

        <div className="mt-auto space-y-2">
            <button onClick={handleNext} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors shadow-lg">
                {step === guideSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
            {step < guideSteps.length - 1 && 
                <button onClick={onClose} className="w-full text-sm text-theme-secondary font-semibold py-2 px-4 rounded-md hover:bg-theme-tertiary transition-colors">
                    Skip Guide
                </button>
            }
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;