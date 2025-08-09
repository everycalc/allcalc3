import React from 'react';

interface RelatedCalculatorLinkProps {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const RelatedCalculatorLink: React.FC<RelatedCalculatorLinkProps> = ({ name, icon, onClick }) => {
  return (
    <button onClick={onClick} className="related-calculator-link w-full flex items-center p-4 rounded-2xl transition-all text-left">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
        <div className="w-8 h-8 mr-4 flex-shrink-0 flex items-center justify-center">
            {icon}
        </div>
        <span className="font-semibold">{name}</span>
    </button>
  );
};

export default RelatedCalculatorLink;
