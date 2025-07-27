
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';

interface Result {
    finalPrice: number;
    savedAmount: number;
}

interface DiscountCalculatorState {
    originalPrice: string;
    discount: string;
}

interface DiscountCalculatorProps {
    isPremium?: boolean;
    initialState?: DiscountCalculatorState;
}

const DiscountCalculator: React.FC<DiscountCalculatorProps> = ({ isPremium, initialState }) => {
    const [originalPrice, setOriginalPrice] = useState('100');
    const [discount, setDiscount] = useState('20');
    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setOriginalPrice(initialState.originalPrice || '100');
            setDiscount(initialState.discount || '20');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const price = parseFloat(originalPrice);
        const disc = parseFloat(discount);

        if (isNaN(price) || isNaN(disc) || price < 0 || disc < 0) {
            setResult(null);
            return;
        }

        const saved = price * (disc / 100);
        const final = price - saved;
        
        const calculatedResult = { finalPrice: final, savedAmount: saved };
        
        addHistory({
            calculator: 'Discount Calculator',
            calculation: `${disc}% off ${formatCurrency(price)} = ${formatCurrency(final)}`,
            inputs: { originalPrice, discount }
        });
        
        setShareText(`Discount Calculation:\n- Original Price: ${formatCurrency(price)}\n- Discount: ${disc}%\n\nResult:\n- Final Price: ${formatCurrency(final)}\n- You Save: ${formatCurrency(saved)}`);

        if (shouldShowAd(isPremium)) {
            setPendingResult(calculatedResult);
            setShowAd(true);
        } else {
            setResult(calculatedResult);
        }
    };
    
    const handleAdClose = () => {
        if (pendingResult) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };

    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
             {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Discount Calculator"
                    inputs={{ originalPrice, discount }}
                    result={result}
                />
            )}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-theme-secondary">Original Price ({currencySymbol})</label>
                        <InfoTooltip text="The price of the item before any discount." />
                    </div>
                    <input type="number" id="originalPrice" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="discount" className="block text-sm font-medium text-theme-secondary">Discount (%)</label>
                        <InfoTooltip text="The percentage discount to be applied." />
                    </div>
                    <input type="number" id="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Results</h3>
                    <div className="py-4">
                      <PieChart data={[
                          { label: 'Final Price', value: result.finalPrice, color: '#3b82f6' },
                          { label: 'You Save', value: result.savedAmount, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">You Save:</span>
                        <span className="text-xl font-bold text-green-500">{formatCurrency(result.savedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Final Price:</span>
                        <span className="text-3xl font-bold text-primary">{formatCurrency(result.finalPrice)}</span>
                    </div>
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme">
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain
                        </button>
                        <ShareButton textToShare={shareText} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountCalculator;
