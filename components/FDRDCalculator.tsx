
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';

type DepositType = 'FD' | 'RD';

interface Result {
    totalInvestment: number;
    interestEarned: number;
    maturityValue: number;
}

interface FDRDCalculatorState {
    depositType: DepositType;
    investment: string;
    rate: string;
    tenure: string;
    compounding: string;
}

interface FDRDCalculatorProps {
    isPremium?: boolean;
    initialState?: FDRDCalculatorState;
}

const FDRDCalculator: React.FC<FDRDCalculatorProps> = ({ isPremium, initialState }) => {
    const [depositType, setDepositType] = useState<DepositType>('FD');
    const [investment, setInvestment] = useState('100000');
    const [rate, setRate] = useState('7');
    const [tenure, setTenure] = useState('5');
    const [compounding, setCompounding] = useState('4'); // Quarterly
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
            setDepositType(initialState.depositType || 'FD');
            setInvestment(initialState.investment || '100000');
            setRate(initialState.rate || '7');
            setTenure(initialState.tenure || '5');
            setCompounding(initialState.compounding || '4');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const P = parseFloat(investment);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(tenure);
        const n = parseFloat(compounding);

        if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || r < 0 || t <= 0) {
            setResult(null);
            return;
        }

        let maturityValue = 0;
        let totalInvestment = 0;

        if (depositType === 'FD') {
            maturityValue = P * Math.pow(1 + r / n, n * t);
            totalInvestment = P;
        } else { // RD
            const months = t * 12;
            totalInvestment = P * months;
            const i = r / 12; // Monthly rate
            maturityValue = P * ((Math.pow(1 + i, months) - 1) / i);
        }

        const interestEarned = maturityValue - totalInvestment;
        const calculatedResult = { totalInvestment, interestEarned, maturityValue };
        
        const calculationString = `${depositType} of ${formatCurrency(P)}${depositType === 'RD' ? '/mo' : ''} @ ${rate}% for ${t} yrs -> ${formatCurrency(maturityValue)}`;

        addHistory({
            calculator: 'FD/RD Calculator',
            calculation: calculationString,
            inputs: { depositType, investment, rate, tenure, compounding: depositType === 'FD' ? compounding : '12' }
        });
        
        setShareText(`${depositType} Calculation:\n- Investment: ${formatCurrency(P)}${depositType === 'RD' ? '/mo' : ''}\n- Rate: ${rate}%\n- Tenure: ${t} years\n\nResult:\n- Maturity Value: ${formatCurrency(maturityValue)}\n- Total Interest: ${formatCurrency(interestEarned)}`);

        if (shouldShowAd()) {
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

    const handleTypeChange = (type: DepositType) => {
        setDepositType(type);
        setResult(null);
        setInvestment(type === 'FD' ? '100000' : '5000');
    };
    
    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName={`FD/RD Calculator (${depositType})`}
                    inputs={{ depositType, investment, rate, tenure, compounding }}
                    result={result}
                />
            )}
            <div className="flex justify-center bg-theme-primary p-1 rounded-lg">
                <button onClick={() => handleTypeChange('FD')} className={`w-1/2 py-2 rounded-md transition ${depositType === 'FD' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Fixed Deposit (FD)</button>
                <button onClick={() => handleTypeChange('RD')} className={`w-1/2 py-2 rounded-md transition ${depositType === 'RD' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Recurring Deposit (RD)</button>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="investment" className="block text-sm font-medium text-theme-secondary">{depositType === 'FD' ? 'Total Investment' : 'Monthly Investment'} ({currencySymbol})</label>
                        <InfoTooltip text={depositType === 'FD' ? "A one-time lump sum investment." : "The amount you will invest each month."} />
                    </div>
                    <input type="number" id="investment" value={investment} onChange={e => setInvestment(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="rate" className="block text-sm font-medium text-theme-secondary">Interest Rate (% p.a.)</label>
                        <InfoTooltip text="The annual interest rate for the deposit." />
                    </div>
                    <input type="number" id="rate" value={rate} onChange={e => setRate(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="tenure" className="block text-sm font-medium text-theme-secondary mb-1">Tenure (Years)</label>
                    <input type="number" id="tenure" value={tenure} onChange={e => setTenure(e.target.value)} className={inputClasses}/>
                </div>
                {depositType === 'FD' && (
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <label htmlFor="compounding" className="block text-sm font-medium text-theme-secondary">Compounding Frequency</label>
                            <InfoTooltip text="How often the interest is calculated and added to the principal." />
                        </div>
                        <select id="compounding" value={compounding} onChange={e => setCompounding(e.target.value)} className={inputClasses}>
                            <option value="12">Monthly</option>
                            <option value="4">Quarterly</option>
                            <option value="2">Semi-Annually</option>
                            <option value="1">Annually</option>
                        </select>
                    </div>
                )}
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate Maturity
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Maturity Details</h3>
                    <div className="py-4">
                      <PieChart data={[
                          { label: 'Total Investment', value: result.totalInvestment, color: '#3b82f6' },
                          { label: 'Interest Earned', value: result.interestEarned, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Total Investment:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Interest Earned:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.interestEarned)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Maturity Value:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.maturityValue)}</span>
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

export default FDRDCalculator;
