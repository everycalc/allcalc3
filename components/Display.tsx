import React from 'react';

interface DisplayProps {
  value: string;
  subValue?: string;
}

const Display: React.FC<DisplayProps> = ({ value, subValue }) => {
  return (
    <div className="calculator-display rounded-3xl p-6 mb-4 text-right overflow-hidden break-words min-h-[120px] flex flex-col justify-end">
      <div className="text-on-surface-variant text-2xl h-8 font-medium">{subValue || ''}</div>
      <div className="text-on-surface text-6xl font-semibold tracking-wide" style={{ minHeight: '4.5rem' }}>
        {value}
      </div>
    </div>
  );
};

export default Display;