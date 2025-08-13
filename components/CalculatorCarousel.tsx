import React, { useRef } from 'react';
import { CalculatorItem } from '../data/calculators';
import CalculatorCard from './CalculatorCard';

interface CalculatorCarouselProps {
  items: CalculatorItem[];
  onSelectCalculator: (name: string) => void;
  pinId?: string;
}

const CalculatorCarousel: React.FC<CalculatorCarouselProps> = ({ items, onSelectCalculator, pinId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div ref={scrollRef} className="carousel-container flex items-stretch overflow-x-auto gap-4 py-2 scroll-smooth snap-x snap-mandatory">
        {items.map((item, index) => (
          <div key={item.name} className="snap-start flex-shrink-0 w-[140px] h-[140px]">
            <CalculatorCard 
              name={item.name} 
              icon={item.icon} 
              isPremium={item.isPremium} 
              onClick={() => onSelectCalculator(item.name)}
              pinId={index === 0 ? pinId : undefined}
            />
          </div>
        ))}
      </div>
      <button onClick={() => scroll('left')} className="carousel-arrow left-0" aria-label="Scroll left">‹</button>
      <button onClick={() => scroll('right')} className="carousel-arrow right-0" aria-label="Scroll right">›</button>
    </div>
  );
};

export default CalculatorCarousel;
