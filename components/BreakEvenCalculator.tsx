
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';

interface Result {
    breakEvenUnits: number | null;
    breakEvenRevenue: number | null;
}

interface BreakEvenCalculatorState {
    fixedCosts: string;
    pricePerUnit: string;
    variableCostPerUnit: string;
}

interface BreakEvenCalculatorProps {
    isPremium?: boolean;
    initialState?: BreakEvenCalculatorState;
}

const BreakEvenCalculator: React.FC<BreakEvenCalculatorProps> = ({ isPremium, initialState }) => {
    const [fixedCosts, setFixedCosts] = useState('10000');
    const [pricePerUnit, setPricePerUnit] = useState('50');
    const [variableCostPerUnit, setVariableCostPerUnit] = useState('30');
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
            setFixedCosts(initialState.fixedCosts || '10000');
            setPricePerUnit(initialState.pricePerUnit || '50');
            setVariableCostPerUnit(initialState.variableCostPerUnit || '30');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const fc = parseFloat(fixedCosts);
        const ppu = parseFloat(pricePerUnit);
        const vcu = parseFloat(variableCostPerUnit);

        const contributionMargin = ppu - vcu;

        if (isNaN(fc) || isNaN(ppu) || isNaN(vcu) || contributionMargin <= 0) {
            setResult({ breakEvenUnits: null, breakEvenRevenue: null });
            return;
        }

        const units = fc / contributionMargin;
        const revenue = units * ppu;
        
        const calculatedResult = { breakEvenUnits: units, breakEvenRevenue: revenue };
        
        addHistory({
            calculator: 'Break-Even Point Calculator',
            calculation: `Break-Even: ${Math.ceil(units).toLocaleString()} units or ${formatCurrency(revenue)}`,
            inputs: { fixedCosts, pricePerUnit, variableCostPerUnit }
        });

        setShareText(`Break-Even Point Calculation:\n- Fixed Costs: ${formatCurrency(fc)}\n- Price Per Unit: ${formatCurrency(ppu)}\n- Variable Cost Per Unit: ${formatCurrency(vcu)}\n\nResult:\n- Break-Even Units: ${Math.ceil(units).toLocaleString()}\n- Break-Even Revenue: ${formatCurrency(revenue)}`);

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
                    calculatorName="Break-Even Point Calculator"
                    inputs={{ fixedCosts, pricePerUnit, variableCostPerUnit }}
                    result={result}
                />
            )}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="fixedCosts" className="block text-sm font-medium text-theme-secondary">Total Fixed Costs ({currencySymbol})</label>
                        <InfoTooltip text="Costs that do not change with the number of units produced (e.g., rent, salaries)." />
                    </div>
                    <input type="number" id="fixedCosts" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="pricePerUnit" className="block text-sm font-medium text-theme-secondary">Sale Price Per Unit ({currencySymbol})</label>
                        <InfoTooltip text="The price at which you sell one unit of your product." />
                    </div>
                    <input type="number" id="pricePerUnit" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="variableCostPerUnit" className="block text-sm font-medium text-theme-secondary">Variable Cost Per Unit ({currencySymbol})</label>
                         <InfoTooltip text="The costs that change directly with the number of units produced (e.g., materials, direct labor)." />
                    </div>
                    <input type="number" id="variableCostPerUnit" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Results</h3>
                    {result.breakEvenUnits !== null ? (
                        <>
                            <div className="flex justify-between items-center text-center">
                                <div className="w-1/2">
                                    <span className="text-theme-secondary block">Break-Even Units</span>
                                    <span className="text-3xl font-bold text-primary">{Math.ceil(result.breakEvenUnits).toLocaleString()}</span>
                                </div>
                                <div className="w-1/2 border-l border-theme">
                                    <span className="text-theme-secondary block">Break-Even Revenue</span>
                                    <span className="text-3xl font-bold text-primary">{formatCurrency(result.breakEvenRevenue!)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme">
                                <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                   Explain
                                </button>
                                <ShareButton textToShare={shareText} />
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-yellow-500">Contribution margin must be positive. Ensure sale price is greater than variable cost.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BreakEvenCalculator;