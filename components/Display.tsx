import React from 'react';

interface DisplayProps {
  value: string;
  subValue?: string;
}

const Display: React.FC<DisplayProps> = ({ value, subValue }) => {
  return (
    <div className="bg-theme-primary/50 rounded-lg p-4 mb-4 text-right overflow-hidden break-words">
      <div className="text-theme-secondary text-xl h-7">{subValue || ''}</div>
      <div className="text-theme-primary text-5xl font-light tracking-wider" style={{ minHeight: '3.75rem' }}>
        {value}
      </div>
    </div>
  );
};

export default Display;