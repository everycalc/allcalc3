import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: (label: string) => void;
  className?: string;
}

const CalculatorButton: React.FC<ButtonProps> = ({ label, onClick, className = '' }) => {
  const baseClasses = 'flex items-center justify-center text-2xl font-semibold rounded-lg shadow-md transition-all duration-150 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-secondary ring-primary';
  
  const getLabelAsString = (): string => {
    if (typeof label === 'string') return label;
    // This is a simplification. For complex ReactNodes, you'd need a better way.
    return '';
  };

  return (
    <button
      onClick={() => onClick(getLabelAsString())}
      className={`${baseClasses} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;