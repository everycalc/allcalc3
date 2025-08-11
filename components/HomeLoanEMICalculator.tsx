import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';
import { GoogleGenAI, Type } from '@google/genai';

interface Result {
    emi: number;
    totalInterest: number;
    totalPayment: number;
    isAffordable?: boolean;
}

interface HomeLoanEMICalculatorState {
    mode: 'emi' | 'affordability';
    amount: string;
    rate: string;
    tenure: string;
    income: string;
    otherEmi: string;
}

interface HomeLoanEMICalculatorProps {
    initialState?: HomeLoanEMICalculatorState;
}

const HomeLoanEMICalculator: React.FC<HomeLoanEMICalculatorProps> = ({ initialState }) => {
    const [mode, setMode] = useState<'emi' | 'affordability'>('emi');
    const [amount, setAmount] = useState('2500000');
    const [rate, setRate] = useState('8.5');
    const [tenure, setTenure] = useState('20');
    const [income, setIncome] = useState('80000');
    const [otherEmi, setOtherEmi] = useState('5000');
    const [result, setResult] = useState<Result | null>(null);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    
    const [aiResult, setAiResult] = useState<{ affordableLoanAmount: number, affordableEmi: number, explanation: string } | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setMode(initialState.mode || 'emi');
            setAmount(initialState.amount || '2500000');
            setRate(initialState.rate || '8.5');
            setTenure(initialState.tenure || '20');
            setIncome(initialState.income || '80000');
            setOtherEmi(initialState.otherEmi || '5000');
            setResult(null);
            setAiResult(null);
        }
    }, [initialState]);

    const handleModeChange = (newMode: 'emi' | 'affordability') => {
        setMode(newMode);
        setResult(null);
        setAiResult(null);
        setAiError('');
    };

    const handleCalculate = () => {
        const P = parseFloat(amount);
        const annualRate = parseFloat(rate);
        const years = parseFloat(tenure);
        const monthlyIncome = parseFloat(income);
        const existingEmi = parseFloat(otherEmi);

        if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate <= 0 || years <= 0) {
            setResult(null);
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;

        const emi = P * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalPayment = emi * numberOfPayments;
        const totalInterest = totalPayment - P;
        
        let isAffordable: boolean | undefined = undefined;
        if (!isNaN(monthlyIncome) && monthlyIncome > 0) {
            const totalEmi = emi + (isNaN(existingEmi) ? 0 : existingEmi);
            isAffordable = totalEmi <= (monthlyIncome * 0.5); // 50% rule
        }

        const calculatedResult = { emi, totalInterest, totalPayment, isAffordable };
        setResult(calculatedResult);
        
        const historyText = `Home Loan: ${formatCurrency(P)} @ ${annualRate}% for ${years} years -> EMI: ${formatCurrency(emi)}`;
        addHistory({
            calculator: 'Home Loan EMI & Affordability',
            calculation: historyText,
            inputs: { mode, amount, rate, tenure, income, otherEmi }
        });
        
        setShareText(`Home Loan Calculation:\n- Loan Amount: ${formatCurrency(P)}\n- Interest Rate: ${annualRate}%\n- Term: ${years} years\n\n- Monthly EMI: ${formatCurrency(emi)}\n- Total Interest: ${formatCurrency(totalInterest)}`);
    };

    const handleAiCalculate = async () => {
        setIsAiLoading(true);
        setAiError('');
        setAiResult(null);

        try {
            if (!process.env.API_KEY) {
                setAiError("AI feature is currently unavailable.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const prompt = `A user wants to know the maximum home loan they can afford. Their net monthly income is ${formatCurrency(parseFloat(income))}, they have other monthly EMIs of ${formatCurrency(parseFloat(otherEmi))}, the annual interest rate is ${rate}%, and they want a loan tenure of ${tenure} years. Banks typically approve loans where total EMIs (new + existing) are up to 50% of net income. Calculate the maximum affordable loan amount and the corresponding EMI. Provide a brief, friendly one-sentence explanation of the result.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            affordableLoanAmount: { type: Type.NUMBER, description: 'The calculated maximum affordable loan amount.' },
                            affordableEmi: { type: Type.NUMBER, description: 'The calculated EMI for the affordable loan amount.' },
                            explanation: { type: Type.STRING, description: 'A brief, one-sentence friendly explanation of the result.' },
                        },
                        required: ['affordableLoanAmount', 'affordableEmi', 'explanation'],
                    },
                },
            });

            const jsonString = response.text.trim();
            const parsedResult = JSON.parse(jsonString);
            setAiResult(parsedResult);
            
            addHistory({
                calculator: 'Home Loan AI Advisor',
                calculation: `For an income of ${formatCurrency(parseFloat(income))}, suggested loan is ${formatCurrency(parsedResult.affordableLoanAmount)}`,
                inputs: { mode: 'affordability', income, otherEmi, rate, tenure }
            });
            setShareText(`AI Home Loan Affordability:\n- Income: ${formatCurrency(parseFloat(income))}\n- Tenure: ${tenure} years\n\nSuggested Loan Amount: ${formatCurrency(parsedResult.affordableLoanAmount)}\nSuggested EMI: ${formatCurrency(parsedResult.affordableEmi)}`);

        } catch (error) {
            console.error("AI Affordability Error:", error);
            setAiError("Sorry, we couldn't generate advice right now. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {isExplainModalOpen && result && mode === 'emi' && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Home Loan EMI & Affordability"
                    inputs={{ amount, rate, tenure, income, otherEmi }}
                    result={result}
                />
            )}
             <div className="toggle-group flex justify-center p-1 rounded-lg">
                <button onClick={() => handleModeChange('emi')} className={`toggle-button w-1/2 py-2 rounded-md transition text-sm ${mode === 'emi' ? 'toggle-button-active' : ''}`}>Calculate EMI</button>
                <button onClick={() => handleModeChange('affordability')} className={`toggle-button w-1/2 py-2 rounded-md transition text-sm ${mode === 'affordability' ? 'toggle-button-active' : ''}`}>AI Affordability Advisor</button>
            </div>

            {mode === 'emi' ? (
                <>
                    <div className="p-4 bg-surface-container rounded-lg space-y-4">
                        <h3 className="font-bold text-lg text-center">Loan Details</h3>
                        <div>
                            <label className="text-sm font-medium text-on-surface-variant mb-1">Loan Amount ({currencySymbol})</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-base w-full"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-on-surface-variant mb-1">Interest Rate (%)</label>
                                <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="input-base w-full"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-on-surface-variant mb-1">Loan Tenure (Yrs)</label>
                                <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="input-base w-full"/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-surface-container rounded-lg space-y-4">
                        <h3 className="font-bold text-lg text-center">Affordability Check (Optional)</h3>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <label className="text-sm font-medium text-on-surface-variant">Your Net Monthly Income ({currencySymbol})</label>
                                <InfoTooltip text="Your take-home salary after all deductions." />
                            </div>
                            <input type="number" value={income} onChange={e => setIncome(e.target.value)} className="input-base w-full"/>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <label className="text-sm font-medium text-on-surface-variant">Other Existing EMIs ({currencySymbol})</label>
                                <InfoTooltip text="Total EMIs you are currently paying for other loans (car, personal, etc.)." />
                            </div>
                            <input type="number" value={otherEmi} onChange={e => setOtherEmi(e.target.value)} className="input-base w-full"/>
                        </div>
                    </div>

                    <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg">
                        Calculate
                    </button>
                </>
            ) : (
                <>
                    <div className="p-4 bg-surface-container rounded-lg space-y-4">
                        <h3 className="font-bold text-lg text-center">Your Financials</h3>
                         <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <label className="text-sm font-medium text-on-surface-variant">Your Net Monthly Income ({currencySymbol})</label>
                                <InfoTooltip text="Your take-home salary after all deductions." />
                            </div>
                            <input type="number" value={income} onChange={e => setIncome(e.target.value)} className="input-base w-full"/>
                        </div>
                         <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <label className="text-sm font-medium text-on-surface-variant">Other Existing EMIs ({currencySymbol})</label>
                                 <InfoTooltip text="Total EMIs you are currently paying for other loans (car, personal, etc.)." />
                            </div>
                            <input type="number" value={otherEmi} onChange={e => setOtherEmi(e.target.value)} className="input-base w-full"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-on-surface-variant mb-1">Interest Rate (%)</label>
                                <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="input-base w-full"/>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-on-surface-variant mb-1">Loan Tenure (Yrs)</label>
                                <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="input-base w-full"/>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleAiCalculate} disabled={isAiLoading} className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg disabled:opacity-50">
                        {isAiLoading ? 'Getting Advice...' : 'Ask AI Advisor'}
                    </button>
                </>
            )}

            {result && mode === 'emi' && (
                <div className="result-card p-6 space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Loan Summary</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Monthly EMI:</span>
                        <span className="text-3xl font-bold text-primary">{formatCurrency(result.emi)}</span>
                    </div>
                     <div className="flex justify-between items-center border-t border-outline-variant pt-4 mt-4">
                        <span className="text-on-surface-variant">Total Interest:</span>
                        <span className="text-lg font-medium text-on-surface">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Total Payment:</span>
                        <span className="text-lg font-medium text-on-surface">{formatCurrency(result.totalPayment)}</span>
                    </div>

                    {result.isAffordable !== undefined && (
                        <div className={`text-center p-3 mt-4 rounded-lg ${result.isAffordable ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            <p className="font-bold">
                                {result.isAffordable ? 'This loan appears affordable.' : 'This loan may stretch your budget.'}
                            </p>
                            <p className="text-xs">{result.isAffordable ? 'Your total EMIs are within 50% of your income.' : 'Your total EMIs exceed 50% of your income.'}</p>
                        </div>
                    )}
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant">
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain
                        </button>
                        <ShareButton textToShare={shareText} />
                    </div>
                </div>
            )}
            {isAiLoading && (
                <div className="flex items-center justify-center space-x-2 text-on-surface p-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>AI is analyzing your profile...</p>
                </div>
            )}
            {aiError && <p className="text-red-500 text-center text-sm">{aiError}</p>}
            {aiResult && mode === 'affordability' && (
                <div className="result-card p-6 space-y-4 animate-fade-in text-center">
                    <h3 className="text-lg font-semibold text-on-surface-variant">AI Recommendation</h3>
                    <p className="text-on-surface">Based on your income, you can afford a loan of up to:</p>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(aiResult.affordableLoanAmount)}</p>
                    <p className="text-on-surface">Your EMI for this loan would be approximately <b className="text-primary">{formatCurrency(aiResult.affordableEmi)}</b> per month.</p>
                    <p className="text-sm text-on-surface-variant pt-4 border-t border-outline-variant mt-4">{aiResult.explanation}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default HomeLoanEMICalculator;