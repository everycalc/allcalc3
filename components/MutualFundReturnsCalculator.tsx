import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';
import { useAd } from '../contexts/AdContext';
import { useFuel } from '../contexts/FuelContext';
import InterstitialAdModal from './InterstitialAdModal';

type InvestmentType = 'LumpSum' | 'SIP';

interface Result {
    totalInvestment: number;
    estimatedReturns: number;
    futureValue: number;
}

interface MutualFundReturnsCalculatorState {
    investmentType: InvestmentType;
    amount: string;
    rate: string;
    tenure: string;
}

interface MutualFundReturnsCalculatorProps {
    initialState?: MutualFundReturnsCalculatorState;
    isPremium?: boolean;
}

const MutualFundReturnsCalculator: React.FC<MutualFundReturnsCalculatorProps> = ({ initialState, isPremium }) => {
    const [investmentType, setInvestmentType] = useState<InvestmentType>('SIP');
    const [amount, setAmount] = useState('5000');
    const [rate, setRate] = useState('12');
    const [tenure, setTenure] = useState('10');
    const [result, setResult] = useState<Result | null>(null);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency, currencySymbol } = useTheme();

    const [pendingCalculation, setPendingCalculation] = useState<(() => void) | null>(null);
    const [showAd, setShowAd] = useState(false);
    const { shouldShowAd } = useAd();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;

    useEffect(() => {
        if (initialState) {
            setInvestmentType(initialState.investmentType || 'SIP');
            setAmount(initialState.amount || '5000');
            setRate(initialState.rate || '12');
            setTenure(initialState.tenure || '10');
            setResult(null);
        }
    }, [initialState]);
    
    const handleAdClose = () => {
        setShowAd(false);
        if (pendingCalculation) {
            pendingCalculation();
            setPendingCalculation(null);
        }
    };

    const handleCalculate = () => {
        const performCalculation = () => {
            const P = parseFloat(amount);
            const r = parseFloat(rate) / 100;
            const t = parseFloat(tenure);

            if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || r <= 0 || t <= 0) {
                setResult(null);
                return;
            }

            let futureValue = 0;
            let totalInvestment = 0;

            if (investmentType === 'LumpSum') {
                futureValue = P * Math.pow(1 + r, t);
                totalInvestment = P;
            } else { // SIP
                const n = t * 12;
                const i = r / 12;
                futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
                totalInvestment = P * n;
            }

            const estimatedReturns = futureValue - totalInvestment;
            const calculatedResult = { totalInvestment, estimatedReturns, futureValue };
            setResult(calculatedResult);

            addHistory({
                calculator: 'Mutual Fund Returns Calculator',
                calculation: `${investmentType} of ${formatCurrency(P)} @ ${rate}% for ${t} yrs -> ${formatCurrency(futureValue)}`,
                inputs: { investmentType, amount, rate, tenure }
            });
            
            setShareText(`Mutual Fund Calculation (${investmentType}):\n- ${investmentType === 'SIP' ? 'Monthly' : 'Total'} Investment: ${formatCurrency(P)}\n- Expected Return: ${rate}% p.a.\n- Period: ${t} years\n\nResult:\n- Total Investment: ${formatCurrency(totalInvestment)}\n- Estimated Returns: ${formatCurrency(estimatedReturns)}\n- Future Value: ${formatCurrency(futureValue)}`);
        };
        
        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            performCalculation();
        } else {
            if (shouldShowAd(isPremium)) {
                setPendingCalculation(() => performCalculation);
                setShowAd(true);
            } else {
                performCalculation();
            }
        }
    };
    
    const handleTypeChange = (type: InvestmentType) => {
        setInvestmentType(type);
        setResult(null);
        setAmount(type === 'SIP' ? '5000' : '100000');
    };

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName={`Mutual Fund Calculator (${investmentType})`}
                    inputs={{ investmentType, amount, rate, tenure }}
                    result={result}
                />
            )}
            <div className="toggle-group flex justify-center p-1 rounded-lg">
                <button onClick={() => handleTypeChange('SIP')} className={`toggle-button w-1/2 py-2 rounded-md transition ${investmentType === 'SIP' ? 'toggle-button-active' : ''}`}>SIP</button>
                <button onClick={() => handleTypeChange('LumpSum')} className={`toggle-button w-1/2 py-2 rounded-md transition ${investmentType === 'LumpSum' ? 'toggle-button-active' : ''}`}>Lump Sum</button>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-on-surface-variant">{investmentType === 'SIP' ? 'Monthly Investment' : 'Total Investment'} ({currencySymbol})</label>
                        <InfoTooltip text={investmentType === 'SIP' ? "The amount you will invest each month." : "A one-time lump sum investment."} />
                    </div>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="rate" className="block text-sm font-medium text-on-surface-variant">Expected Return Rate (% p.a.)</label>
                         <InfoTooltip text="The estimated annual growth rate of your investment." />
                    </div>
                    <input type="number" id="rate" value={rate} onChange={e => setRate(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                    <label htmlFor="tenure" className="block text-sm font-medium text-on-surface-variant mb-1">Investment Period (Years)</label>
                    <input type="number" id="tenure" value={tenure} onChange={e => setTenure(e.target.value)} className="input-base w-full"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg">
                Calculate Returns
            </button>
            {result && (
                <div className="result-card p-6 space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Projected Value</h3>
                    <div className="py-4">
                      <PieChart data={[
                          { label: 'Invested Amount', value: result.totalInvestment, color: '#3b82f6' },
                          { label: 'Est. Returns', value: result.estimatedReturns, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Invested Amount:</span>
                        <span className="text-lg font-medium text-on-surface">{formatCurrency(result.totalInvestment)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Est. Returns:</span>
                        <span className="text-lg font-medium text-on-surface">{formatCurrency(result.estimatedReturns)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant pt-4 mt-4">
                        <span className="text-on-surface-variant">Future Value:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.futureValue)}</span>
                    </div>
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant">
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

export default MutualFundReturnsCalculator;