import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`tab-button ${isActive ? 'active' : ''}`}
      role="tab"
      aria-selected={isActive}
    >
      {label}
    </button>
  );
};

export default TabButton;