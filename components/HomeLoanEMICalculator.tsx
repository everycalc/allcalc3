import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';
import { useFuel } from '../contexts/FuelContext';

interface Result {
    emi: number;
    totalInterest: number;
    totalPayment: number;
    isAffordable?: boolean;
}

interface HomeLoanEMICalculatorState {
    amount: string;
    rate: string;
    tenure: string;
    income: string;
    otherEmi: string;
}

interface HomeLoanEMICalculatorProps {
    isPremium?: boolean;
    initialState?: HomeLoanEMICalculatorState;
}

const HomeLoanEMICalculator: React.FC<HomeLoanEMICalculatorProps> = ({ isPremium, initialState }) => {
    const [amount, setAmount] = useState('2500000');
    const [rate, setRate] = useState('8.5');
    const [tenure, setTenure] = useState('20');
    const [income, setIncome] = useState('80000');
    const [otherEmi, setOtherEmi] = useState('5000');
    const [result, setResult] = useState<Result | null>(null);
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
            setAmount(initialState.amount || '2500000');
            setRate(initialState.rate || '8.5');
            setTenure(initialState.tenure || '20');
            setIncome(initialState.income || '80000');
            setOtherEmi(initialState.otherEmi || '5000');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const performCalculation = () => {
            const P = parseFloat(amount);
            const annualRate = parseFloat(rate) / 100;
            const t = parseFloat(tenure);
            const monthlyIncome = parseFloat(income);
            const existingEmi = parseFloat(otherEmi);

            if (isNaN(P) || isNaN(annualRate) || isNaN(t) || P <= 0) {
                return null;
            }

            const r = annualRate / 12;
            const n = t * 12;

            const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = emi * n;
            const totalInterest = totalPayment - P;

            let affordabilityText = '';
            let isAffordable: boolean | undefined = undefined;
            if (!isNaN(monthlyIncome) && monthlyIncome > 0) {
                const totalEmi = emi + (isNaN(existingEmi) ? 0 : existingEmi);
                const emiToIncomeRatio = (totalEmi / monthlyIncome);
                isAffordable = emiToIncomeRatio <= 0.5; // General rule: total EMIs < 50% of income
                affordabilityText = `\nAffordability: ${isAffordable ? 'This loan seems affordable.' : 'This loan may be a stretch.'}`;
            }
            
            const calculatedResult = { emi, totalInterest, totalPayment, isAffordable };
            
            addHistory({
                calculator: 'Home Loan EMI & Affordability',
                calculation: `EMI for ${formatCurrency(P)} -> ${formatCurrency(emi)}/mo`,
                inputs: { amount, rate, tenure, income, otherEmi }
            });
            
            setShareText(`Home Loan EMI Calculation:\n- Loan Amount: ${formatCurrency(P)}\n- Interest Rate: ${rate}%\n- Tenure: ${tenure} years\n\nResult:\n- Monthly EMI: ${formatCurrency(emi)}\n- Total Interest: ${formatCurrency(totalInterest)}${affordabilityText}`);
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
                    calculatorName="Home Loan EMI & Affordability Calculator"
                    inputs={{ amount, rate, tenure, income, otherEmi }}
                    result={result}
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Loan Amount ({currencySymbol})</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Interest Rate (% p.a.)</label>
                    <input type="number" value={rate} onChange={e => setRate(e.target.value)} className={inputClasses}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Loan Tenure (Years)</label>
                    <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            <details className="bg-theme-secondary rounded-lg group">
                <summary className="font-semibold text-theme-primary p-3 cursor-pointer list-none flex justify-between items-center">
                    <span>Affordability Check (Optional)</span>
                     <InfoTooltip text="Check if the EMI is manageable based on your income. Lenders generally recommend that your total EMIs do not exceed 50% of your net monthly income." />
                </summary>
                <div className="p-4 border-t border-theme grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Your Net Monthly Income ({currencySymbol})</label>
                        <input type="number" value={income} onChange={e => setIncome(e.target.value)} className={inputClasses}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Other Existing EMIs ({currencySymbol})</label>
                        <input type="number" value={otherEmi} onChange={e => setOtherEmi(e.target.value)} className={inputClasses}/>
                    </div>
                </div>
            </details>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate EMI
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Loan Details</h3>
                     <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Monthly EMI:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.emi)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Total Interest:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Total Payment:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalPayment)}</span>
                    </div>
                    {result.isAffordable !== undefined && (
                        <div className={`text-center p-3 mt-4 rounded-lg ${result.isAffordable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            <p className="font-bold">{result.isAffordable ? 'This loan seems affordable.' : 'This loan may be a stretch.'}</p>
                            <p className="text-xs mt-1">{result.isAffordable ? 'Your total EMIs are within 50% of your income.' : 'Your total EMIs exceed 50% of your income.'}</p>
                        </div>
                    )}
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

export default HomeLoanEMICalculator;