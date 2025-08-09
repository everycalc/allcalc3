import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';
import { GoogleGenAI, Type } from '@google/genai';

interface Result {
    totalInvestment: number;
    estimatedReturns: number;
    maturityValue: number;
}

interface SIPCalculatorState {
    mode: 'calculate' | 'goalSeek';
    monthlyInvestment: string;
    targetAmount: string;
    returnRate: string;
    timePeriod: string;
}

interface SIPCalculatorProps {
    initialState?: SIPCalculatorState;
}

const SIPCalculator: React.FC<SIPCalculatorProps> = ({ initialState }) => {
    const [mode, setMode] = useState<'calculate' | 'goalSeek'>('calculate');
    const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
    const [returnRate, setReturnRate] = useState('12');
    const [timePeriod, setTimePeriod] = useState('10');
    
    const [targetAmount, setTargetAmount] = useState('10000000');
    const [goalSeekResult, setGoalSeekResult] = useState<{monthlyInvestment: number, explanation: string} | null>(null);
    const [isGoalSeeking, setIsGoalSeeking] = useState(false);
    const [goalSeekError, setGoalSeekError] = useState('');

    const [result, setResult] = useState<Result | null>(null);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    
    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setMode(initialState.mode || 'calculate');
            setMonthlyInvestment(initialState.monthlyInvestment || '5000');
            setTargetAmount(initialState.targetAmount || '10000000');
            setReturnRate(initialState.returnRate || '12');
            setTimePeriod(initialState.timePeriod || '10');
            setResult(null);
            setGoalSeekResult(null);
        }
    }, [initialState]);
    
    const handleModeChange = (newMode: 'calculate' | 'goalSeek') => {
        setMode(newMode);
        setResult(null);
        setGoalSeekResult(null);
        setGoalSeekError('');
    }

    const handleCalculate = () => {
        const P = parseFloat(monthlyInvestment);
        const annualRate = parseFloat(returnRate);
        const years = parseFloat(timePeriod);

        if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate <= 0 || years <= 0) {
            setResult(null);
            return;
        }

        const n = years * 12;
        const i = annualRate / 100 / 12;

        const maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const totalInvestment = P * n;
        const estimatedReturns = maturityValue - totalInvestment;
        const calculatedResult = { totalInvestment, estimatedReturns, maturityValue };
        setResult(calculatedResult);

        addHistory({
            calculator: 'SIP Calculator',
            calculation: `SIP of ${formatCurrency(P)}/mo @ ${annualRate}% for ${years} yrs -> ${formatCurrency(maturityValue)}`,
            inputs: { mode, monthlyInvestment, returnRate, timePeriod }
        });
        setShareText(`SIP Calculation:\n- Monthly Investment: ${formatCurrency(P)}\n- Return Rate: ${annualRate}% p.a.\n- Time Period: ${years} years\n\nResult:\n- Total Investment: ${formatCurrency(totalInvestment)}\n- Estimated Returns: ${formatCurrency(estimatedReturns)}\n- Maturity Value: ${formatCurrency(maturityValue)}`);
    };
    
    const handleGoalSeekCalculate = async () => {
        setIsGoalSeeking(true);
        setGoalSeekResult(null);
        setGoalSeekError('');
        
        try {
            if (!process.env.API_KEY) {
                setGoalSeekError("API key not configured.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `A user wants to achieve a financial goal of ${formatCurrency(parseFloat(targetAmount))} in ${timePeriod} years, with an expected annual return rate of ${returnRate}%. Calculate the required monthly investment (SIP amount) to reach this goal.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            monthlyInvestment: { type: Type.NUMBER, description: 'The calculated required monthly investment amount.' },
                            explanation: { type: Type.STRING, description: 'A brief, one-sentence friendly explanation of the result.' },
                        },
                        required: ['monthlyInvestment', 'explanation'],
                    },
                },
            });
            
            const jsonString = response.text.trim();
            const parsedResult = JSON.parse(jsonString);

            setGoalSeekResult(parsedResult);
            
            addHistory({
                calculator: 'SIP Calculator (Goal Seek)',
                calculation: `Goal: ${formatCurrency(parseFloat(targetAmount))} in ${timePeriod} yrs -> requires ${formatCurrency(parsedResult.monthlyInvestment)}/mo`,
                inputs: { mode: 'goalSeek', targetAmount, returnRate, timePeriod }
            });
             setShareText(`SIP Goal Seek:\n- Goal: ${formatCurrency(parseFloat(targetAmount))}\n- Time: ${timePeriod} years\n- Return Rate: ${returnRate}%\n\nRequired Monthly SIP: ${formatCurrency(parsedResult.monthlyInvestment)}`);

        } catch (error) {
            console.error("Goal Seek API Error:", error);
            setGoalSeekError("Sorry, we couldn't calculate your goal right now. Please try again.");
        } finally {
            setIsGoalSeeking(false);
        }
    };

    return (
        <div className="space-y-6">
            {isExplainModalOpen && result && mode === 'calculate' && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="SIP Calculator"
                    inputs={{ monthlyInvestment, returnRate, timePeriod }}
                    result={result}
                />
            )}
            <div className="toggle-group flex justify-center p-1 rounded-lg">
                <button onClick={() => handleModeChange('calculate')} className={`toggle-button w-1/2 py-2 rounded-md transition text-sm ${mode === 'calculate' ? 'toggle-button-active' : ''}`}>Calculate Future Value</button>
                <button onClick={() => handleModeChange('goalSeek')} className={`toggle-button w-1/2 py-2 rounded-md transition text-sm ${mode === 'goalSeek' ? 'toggle-button-active' : ''}`}>Plan a Goal (AI Expert)</button>
            </div>

            {mode === 'calculate' ? (
                <div className="space-y-4">
                    <div>
                         <div className="flex items-center space-x-2 mb-1">
                            <label htmlFor="monthlyInvestment" className="block text-sm font-medium text-on-surface-variant">Monthly Investment ({currencySymbol})</label>
                            <InfoTooltip text="The fixed amount you plan to invest every month." />
                        </div>
                        <input type="number" id="monthlyInvestment" value={monthlyInvestment} onChange={e => setMonthlyInvestment(e.target.value)} className="input-base w-full"/>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                         <div className="flex items-center space-x-2 mb-1">
                            <label htmlFor="targetAmount" className="block text-sm font-medium text-on-surface-variant">I want to have... ({currencySymbol})</label>
                            <InfoTooltip text="Your financial goal amount." />
                        </div>
                        <input type="number" id="targetAmount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="input-base w-full"/>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="returnRate" className="block text-sm font-medium text-on-surface-variant">Expected Return Rate (% p.a.)</label>
                        <InfoTooltip text="The annual rate of return you expect from your investment. This is an estimate." />
                    </div>
                    <input type="number" id="returnRate" value={returnRate} onChange={e => setReturnRate(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="timePeriod" className="block text-sm font-medium text-on-surface-variant">Time Period (Years)</label>
                        <InfoTooltip text="The total duration for which you plan to invest." />
                    </div>
                    <input type="number" id="timePeriod" value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className="input-base w-full"/>
                </div>
            </div>

            {mode === 'calculate' ? (
                 <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-lg text-lg shadow-md">
                    Calculate
                </button>
            ) : (
                <button onClick={() => handleGoalSeekCalculate()} disabled={isGoalSeeking} className="btn-primary w-full font-bold py-3 px-4 rounded-lg text-lg disabled:opacity-50 shadow-md">
                    {isGoalSeeking ? 'Calculating...' : 'Find Monthly SIP'}
                </button>
            )}

            {result && mode === 'calculate' && (
                <div className="result-card p-6 space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Investment Projection</h3>
                    <div id="pdf-pie-chart-sip" className="py-4">
                      <PieChart data={[
                          { label: 'Total Investment', value: result.totalInvestment, color: '#3b82f6' },
                          { label: 'Estimated Returns', value: result.estimatedReturns, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Total Investment:</span>
                        <span className="text-lg font-medium text-on-surface">{formatCurrency(result.totalInvestment)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Estimated Returns:</span>
                        <span className="text-lg font-medium text-on-surface">{formatCurrency(result.estimatedReturns)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant pt-4 mt-4">
                        <span className="text-on-surface-variant">Maturity Value:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.maturityValue)}</span>
                    </div>
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant">
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain Calculation
                        </button>
                         <ShareButton textToShare={shareText} />
                    </div>
                </div>
            )}
            
            {isGoalSeeking && (
                <div className="flex items-center justify-center space-x-2 text-on-surface p-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>AI is planning your goal...</p>
                </div>
            )}
            {goalSeekError && <p className="text-red-500 text-center text-sm">{goalSeekError}</p>}
            {goalSeekResult && mode === 'goalSeek' && (
                <div className="result-card p-6 space-y-4 animate-fade-in text-center">
                    <h3 className="text-lg font-semibold text-on-surface-variant">To Reach Your Goal, You Need to Invest</h3>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(goalSeekResult.monthlyInvestment)}</p>
                    <p className="text-on-surface-variant font-semibold">per month</p>
                    <p className="text-sm text-on-surface pt-4 border-t border-outline-variant mt-4">{goalSeekResult.explanation}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default SIPCalculator;