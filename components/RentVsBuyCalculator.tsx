
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';

interface Result {
    totalRentCost: number;
    totalBuyCost: number;
}

interface RentVsBuyInputs {
    propertyPrice: string;
    downPayment: string;
    loanTerm: string;
    interestRate: string;
    monthlyRent: string;
    comparisonYears: string;
}

interface RentVsBuyCalculatorProps {
    isPremium?: boolean;
    initialState?: RentVsBuyInputs;
}

const RentVsBuyCalculator: React.FC<RentVsBuyCalculatorProps> = ({ isPremium, initialState }) => {
    const [inputs, setInputs] = useState<RentVsBuyInputs>({
        propertyPrice: '5000000',
        downPayment: '1000000',
        loanTerm: '20',
        interestRate: '8.5',
        monthlyRent: '15000',
        comparisonYears: '10',
    });
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
            setInputs(initialState || {
                propertyPrice: '5000000',
                downPayment: '1000000',
                loanTerm: '20',
                interestRate: '8.5',
                monthlyRent: '15000',
                comparisonYears: '10',
            });
            setResult(null);
        }
    }, [initialState]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCalculate = () => {
        const propertyPrice = parseFloat(inputs.propertyPrice);
        const downPayment = parseFloat(inputs.downPayment);
        const P_loan = propertyPrice - downPayment;
        const annualRate = parseFloat(inputs.interestRate) / 100;
        const t_loan = parseFloat(inputs.loanTerm);
        const monthlyRent = parseFloat(inputs.monthlyRent);
        const comparisonYears = parseFloat(inputs.comparisonYears);

        if (isNaN(P_loan) || isNaN(annualRate) || isNaN(t_loan) || isNaN(monthlyRent) || isNaN(comparisonYears) || P_loan < 0) {
            setResult(null);
            return;
        }

        // Rent calculation
        const totalRentCost = monthlyRent * 12 * comparisonYears;

        // Buy calculation
        const r_monthly = annualRate / 12;
        const n_loan = t_loan * 12;
        const emi = (P_loan * r_monthly * Math.pow(1 + r_monthly, n_loan)) / (Math.pow(1 + r_monthly, n_loan) - 1);
        const totalEMIPaid = emi * Math.min(n_loan, comparisonYears * 12);
        const totalBuyCost = downPayment + totalEMIPaid;
        
        const calculatedResult = { totalRentCost, totalBuyCost };
        
        addHistory({
            calculator: 'Rent vs Buy Calculator',
            calculation: `Rent vs Buy over ${comparisonYears} years`,
            inputs: inputs
        });
        
        setShareText(`Rent vs Buy Comparison (${comparisonYears} years):\n\nBuying:\n- Property Price: ${formatCurrency(propertyPrice)}\n- Down Payment: ${formatCurrency(downPayment)}\n- Total Cost (Buy): ${formatCurrency(totalBuyCost)}\n\nRenting:\n- Monthly Rent: ${formatCurrency(monthlyRent)}\n- Total Cost (Rent): ${formatCurrency(totalRentCost)}`);

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

    const inputClasses = "w-full bg-theme-primary text-theme-primary border-theme rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
             {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Rent vs Buy Calculator"
                    inputs={inputs}
                    result={result}
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 bg-theme-secondary/50 rounded-lg">
                    <h3 className="text-xl font-bold text-center text-primary">Buying Costs</h3>
                    <div><label className="text-sm font-medium text-theme-secondary mb-1">Property Price ({currencySymbol})</label><input type="number" name="propertyPrice" value={inputs.propertyPrice} onChange={handleInputChange} className={inputClasses} /></div>
                    <div><label className="text-sm font-medium text-theme-secondary mb-1">Down Payment ({currencySymbol})</label><input type="number" name="downPayment" value={inputs.downPayment} onChange={handleInputChange} className={inputClasses} /></div>
                    <div><label className="text-sm font-medium text-theme-secondary mb-1">Loan Term (Years)</label><input type="number" name="loanTerm" value={inputs.loanTerm} onChange={handleInputChange} className={inputClasses} /></div>
                    <div><label className="text-sm font-medium text-theme-secondary mb-1">Interest Rate (%)</label><input type="number" name="interestRate" value={inputs.interestRate} onChange={handleInputChange} className={inputClasses} /></div>
                </div>
                <div className="space-y-4 p-4 bg-theme-secondary/50 rounded-lg">
                    <h3 className="text-xl font-bold text-center text-primary">Renting Costs</h3>
                    <div><label className="text-sm font-medium text-theme-secondary mb-1">Monthly Rent ({currencySymbol})</label><input type="number" name="monthlyRent" value={inputs.monthlyRent} onChange={handleInputChange} className={inputClasses} /></div>
                    <h3 className="text-xl font-bold text-center text-primary pt-4">Comparison</h3>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-theme-secondary mb-1">Comparison Period (Years)</label>
                        <InfoTooltip text="The number of years over which to compare the total costs of renting versus buying." />
                    </div>
                    <input type="number" name="comparisonYears" value={inputs.comparisonYears} onChange={handleInputChange} className={inputClasses} />
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Compare
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in text-center">
                    <h3 className="text-xl font-semibold text-theme-primary mb-4">Total Cost Over {inputs.comparisonYears} Years</h3>
                    <div className="flex justify-around items-center">
                        <div className="w-1/2">
                            <p className="text-lg font-bold">Renting</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(result.totalRentCost)}</p>
                        </div>
                         <div className="w-1/2 border-l border-theme">
                            <p className="text-lg font-bold">Buying</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(result.totalBuyCost)}</p>
                        </div>
                    </div>
                    <p className="text-center text-xs text-theme-secondary pt-4">Note: This is a simplified comparison and does not include factors like property appreciation, taxes, or maintenance costs.</p>
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

export default RentVsBuyCalculator;