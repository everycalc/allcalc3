import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: (label: string) => void;
  className?: string;
}

const CalculatorButton: React.FC<ButtonProps> = ({ label, onClick, className = '' }) => {
  const getLabelAsString = (): string => {
    if (typeof label === 'string') return label;
    // This is a simplification. For complex ReactNodes, you'd need a better way.
    return '';
  };

  return (
    <button
      onClick={() => onClick(getLabelAsString())}
      className={`calculator-button ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;