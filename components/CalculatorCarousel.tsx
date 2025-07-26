import React, { useRef } from 'react';
import CalculatorCard from './CalculatorCard';

interface CalculatorItem {
  name: string;
  icon: React.ReactNode;
  isPremium?: boolean;
}

interface CalculatorCarouselProps {
  items: CalculatorItem[];
  onSelectCalculator: (name: string, isPremium?: boolean) => void;
}

const CalculatorCarousel: React.FC<CalculatorCarouselProps> = ({ items, onSelectCalculator }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-theme-secondary/50 hover:bg-theme-secondary text-theme-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
      >
        {items.map(item => (
          <div key={item.name} className="flex-shrink-0 w-24" style={{ scrollSnapAlign: 'start' }}>
            <CalculatorCard
              name={item.name}
              icon={item.icon}
              isPremium={item.isPremium}
              onClick={() => onSelectCalculator(item.name, item.isPremium)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-theme-secondary/50 hover:bg-theme-secondary text-theme-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
};

export default CalculatorCarousel;