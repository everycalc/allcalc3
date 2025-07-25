
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';

interface Result {
    finalAmount: number;
    totalInterest: number;
}

interface CompoundInterestCalculatorState {
    principal: string;
    rate: string;
    time: string;
    frequency: string;
}

interface CompoundInterestCalculatorProps {
    isPremium?: boolean;
    initialState?: CompoundInterestCalculatorState;
}

const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({ isPremium, initialState }) => {
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('8');
    const [time, setTime] = useState('10');
    const [frequency, setFrequency] = useState('12');
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
            setPrincipal(initialState.principal || '10000');
            setRate(initialState.rate || '8');
            setTime(initialState.time || '10');
            setFrequency(initialState.frequency || '12');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const P = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(time);
        const n = parseFloat(frequency);

        if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(n) || P <= 0) {
            setResult(null);
            return;
        }

        const amount = P * Math.pow((1 + r / n), n * t);
        const interest = amount - P;

        const calculatedResult = { finalAmount: amount, totalInterest: interest };

        addHistory({
            calculator: 'Compound Interest Calculator',
            calculation: `CI on ${formatCurrency(P)} @ ${rate}% for ${t} yrs -> ${formatCurrency(amount)}`,
            inputs: { principal, rate, time, frequency }
        });
        
        setShareText(`Compound Interest Calculation:\n- Principal: ${formatCurrency(P)}\n- Rate: ${rate}% p.a.\n- Time: ${t} years\n- Compounding: ${n === 12 ? 'Monthly' : n === 4 ? 'Quarterly' : n === 2 ? 'Semi-Annually' : 'Annually'}\n\nResult:\n- Total Interest: ${formatCurrency(interest)}\n- Final Amount: ${formatCurrency(amount)}`);

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
                    calculatorName="Compound Interest Calculator"
                    inputs={{ principal, rate, time, frequency }}
                    result={result}
                />
            )}
            <div className="space-y-4">
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="principal" className="block text-sm font-medium text-theme-secondary">Principal Amount ({currencySymbol})</label>
                        <InfoTooltip text="The initial amount of money you are investing or borrowing." />
                    </div>
                    <input type="number" id="principal" value={principal} onChange={e => setPrincipal(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="rate" className="block text-sm font-medium text-theme-secondary mb-1">Annual Interest Rate (%)</label>
                    <input type="number" id="rate" value={rate} onChange={e => setRate(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-theme-secondary mb-1">Time Period (Years)</label>
                    <input type="number" id="time" value={time} onChange={e => setTime(e.target.value)} className={inputClasses}/>
                </div>
                 <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="frequency" className="block text-sm font-medium text-theme-secondary">Compounding Frequency</label>
                        <InfoTooltip text="How often the interest is calculated and added to the principal." />
                    </div>
                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value)} className={inputClasses}>
                        <option value="12">Monthly</option>
                        <option value="4">Quarterly</option>
                        <option value="2">Semi-Annually</option>
                        <option value="1">Annually</option>
                    </select>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Investment Growth</h3>
                    <div className="py-4">
                        <PieChart data={[
                            { label: 'Principal Amount', value: parseFloat(principal), color: '#3b82f6' },
                            { label: 'Total Interest', value: result.totalInterest, color: '#16a34a' }
                        ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Principal Amount:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(parseFloat(principal))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Total Interest:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Final Amount:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.finalAmount)}</span>
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

export default CompoundInterestCalculator;