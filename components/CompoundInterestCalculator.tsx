import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
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
    initialState?: CompoundInterestCalculatorState;
}

const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({ initialState }) => {
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('8');
    const [time, setTime] = useState('10');
    const [frequency, setFrequency] = useState('12');
    const [result, setResult] = useState<Result | null>(null);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);
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
        setResult(calculatedResult);

        addHistory({
            calculator: 'Compound Interest Calculator',
            calculation: `CI on ${formatCurrency(P)} @ ${rate}% for ${t} yrs -> ${formatCurrency(amount)}`,
            inputs: { principal, rate, time, frequency }
        });
        
        setShareText(`Compound Interest Calculation:\n- Principal: ${formatCurrency(P)}\n- Rate: ${rate}% p.a.\n- Time: ${t} years\n- Compounding: ${n === 12 ? 'Monthly' : n === 4 ? 'Quarterly' : n === 2 ? 'Semi-Annually' : 'Annually'}\n\nResult:\n- Total Interest: ${formatCurrency(interest)}\n- Final Amount: ${formatCurrency(amount)}`);
    };

    return (
        <div className="space-y-6">
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
                        <label htmlFor="principal" className="block text-sm font-medium text-on-surface-variant">Principal Amount ({currencySymbol})</label>
                        <InfoTooltip text="The initial amount of money you are investing or borrowing." />
                    </div>
                    <input type="number" id="principal" value={principal} onChange={e => setPrincipal(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                    <label htmlFor="rate" className="block text-sm font-medium text-on-surface-variant mb-1">Annual Interest Rate (%)</label>
                    <input type="number" id="rate" value={rate} onChange={e => setRate(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-on-surface-variant mb-1">Time Period (Years)</label>
                    <input type="number" id="time" value={time} onChange={e => setTime(e.target.value)} className="input-base w-full"/>
                </div>
                 <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="frequency" className="block text-sm font-medium text-on-surface-variant">Compounding Frequency</label>
                        <InfoTooltip text="How often the interest is calculated and added to the principal." />
                    </div>
                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value)} className="select-base w-full">
                        <option value="12">Monthly</option>
                        <option value="4">Quarterly</option>
                        <option value="2">Semi-Annually</option>
                        <option value="1">Annually</option>
                    </select>
                </div>
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg">
                Calculate
            </button>
            {result && (
                <div className="result-card p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Maturity Details</h3>
                    <div className="py-4">
                      <PieChart data={[
                          { label: 'Principal Amount', value: parseFloat(principal), color: '#3b82f6' },
                          { label: 'Total Interest', value: result.totalInterest, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Total Interest:</span>
                        <span className="text-lg font-medium text-on-surface">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant pt-4 mt-4">
                        <span className="text-on-surface-variant">Final Amount:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.finalAmount)}</span>
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

export default CompoundInterestCalculator;