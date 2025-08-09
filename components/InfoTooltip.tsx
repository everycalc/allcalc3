import React from 'react';

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="relative flex items-center group">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-on-surface-variant cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div className="modal-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {text}
      </div>
    </div>
  );
};

export default InfoTooltip;