import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';
import { useFuel } from '../contexts/FuelContext';

interface Result {
    monthsToPayOff: number;
    totalInterest: number;
    totalPayment: number;
}

interface CreditCardInterestCalculatorState {
    balance: string;
    apr: string;
    monthlyPayment: string;
}

interface CreditCardInterestCalculatorProps {
    isPremium?: boolean;
    initialState?: CreditCardInterestCalculatorState;
}

const CreditCardInterestCalculator: React.FC<CreditCardInterestCalculatorProps> = ({ isPremium, initialState }) => {
    const [balance, setBalance] = useState('50000');
    const [apr, setApr] = useState('24');
    const [monthlyPayment, setMonthlyPayment] = useState('2000');
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState('');
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;

    useEffect(() => {
        if (initialState) {
            setBalance(initialState.balance || '50000');
            setApr(initialState.apr || '24');
            setMonthlyPayment(initialState.monthlyPayment || '2000');
            setResult(null);
            setError('');
        }
    }, [initialState]);

    const handleCalculate = () => {
        const performCalculation = () => {
            const B = parseFloat(balance);
            const annualRate = parseFloat(apr) / 100;
            const P = parseFloat(monthlyPayment);

            setError('');
            if (isNaN(B) || isNaN(annualRate) || isNaN(P) || B <= 0) {
                return null;
            }

            const monthlyRate = annualRate / 12;
            if (P <= B * monthlyRate) {
                setError('Monthly payment is too low to cover interest. Debt will never be paid off.');
                setResult(null);
                return null;
            }
            
            // Using the formula: N = -log(1 - (B * i) / P) / log(1 + i)
            const months = -Math.log(1 - (B * monthlyRate) / P) / Math.log(1 + monthlyRate);
            const totalPayment = P * months;
            const totalInterest = totalPayment - B;
            
            const calculatedResult = { monthsToPayOff: Math.ceil(months), totalInterest, totalPayment };

            addHistory({
                calculator: 'Credit Card Interest Calculator',
                calculation: `Debt ${formatCurrency(B)} @ ${apr}% APR -> ${Math.ceil(months)} months`,
                inputs: { balance, apr, monthlyPayment }
            });
            
            setShareText(`Credit Card Payoff Calculation:\n- Outstanding Balance: ${formatCurrency(B)}\n- APR: ${apr}%\n- Monthly Payment: ${formatCurrency(P)}\n\nResult:\n- Time to Pay Off: ${Math.ceil(months)} months\n- Total Interest Paid: ${formatCurrency(totalInterest)}`);
            return calculatedResult;
        };

        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            const res = performCalculation();
            if (res) setResult(res);
        } else {
            const res = performCalculation();
            if (res) {
                if (shouldShowAd(isPremium)) {
                    setPendingResult(res);
                    setShowAd(true);
                } else {
                    setResult(res);
                }
            }
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
                    calculatorName="Credit Card Payoff Calculator"
                    inputs={{ balance, apr, monthlyPayment }}
                    result={result}
                />
            )}
            <div className="space-y-4">
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="balance" className="block text-sm font-medium text-theme-secondary">Outstanding Balance ({currencySymbol})</label>
                        <InfoTooltip text="The current amount of debt on your credit card." />
                    </div>
                    <input type="number" id="balance" value={balance} onChange={e => setBalance(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="apr" className="block text-sm font-medium text-theme-secondary">Annual Percentage Rate (APR %)</label>
                        <InfoTooltip text="The yearly interest rate charged on your card balance." />
                    </div>
                    <input type="number" id="apr" value={apr} onChange={e => setApr(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="monthlyPayment" className="block text-sm font-medium text-theme-secondary">Monthly Payment ({currencySymbol})</label>
                        <InfoTooltip text="The amount you plan to pay towards your card each month." />
                    </div>
                    <input type="number" id="monthlyPayment" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate Payoff
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Debt Payoff Schedule</h3>
                    <div className="py-4">
                      <PieChart data={[
                          { label: 'Principal Paid', value: parseFloat(balance), color: '#3b82f6' },
                          { label: 'Total Interest', value: result.totalInterest, color: '#ef4444' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center text-center">
                        <div className="w-1/2">
                            <span className="text-theme-secondary block">Time to Pay Off</span>
                            <span className="text-3xl font-bold text-primary">{result.monthsToPayOff}</span>
                            <span className="text-theme-secondary block text-sm">months</span>
                        </div>
                        <div className="w-1/2 border-l border-theme">
                             <span className="text-theme-secondary block">Total Interest Paid</span>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(result.totalInterest)}</span>
                        </div>
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

export default CreditCardInterestCalculator;