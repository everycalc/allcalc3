import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GoogleGenAI, Type } from '@google/genai';
import { useFuel } from '../contexts/FuelContext';
import InsufficientFuelModal from './InsufficientFuelModal';
import RewardedAdModal from './RewardedAdModal';

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
    isPremium?: boolean;
}

const SIPCalculator: React.FC<SIPCalculatorProps> = ({ initialState, isPremium }) => {
    const [mode, setMode] = useState<'calculate' | 'goalSeek'>('calculate');
    const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
    const [returnRate, setReturnRate] = useState('12');
    const [timePeriod, setTimePeriod] = useState('10');
    
    const [targetAmount, setTargetAmount] = useState('10000000');
    const [goalSeekResult, setGoalSeekResult] = useState<{monthlyInvestment: number, explanation: string} | null>(null);
    const [isGoalSeeking, setIsGoalSeeking] = useState(false);
    const [goalSeekError, setGoalSeekError] = useState('');

    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [showRewardedAd, setShowRewardedAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const [showInsufficientFuelModal, setShowInsufficientFuelModal] = useState(false);
    
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();
    const { fuel, consumeFuel, setFuel } = useFuel();
    
    const isExpertTool = mode === 'goalSeek';
    const fuelCost = isExpertTool ? 2 : 1;

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
        const performCalculation = () => {
            const P = parseFloat(monthlyInvestment);
            const annualRate = parseFloat(returnRate);
            const years = parseFloat(timePeriod);

            if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate <= 0 || years <= 0) {
                return null;
            }

            const n = years * 12;
            const i = annualRate / 100 / 12;

            const maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
            const totalInvestment = P * n;
            const estimatedReturns = maturityValue - totalInvestment;
            const calculatedResult = { totalInvestment, estimatedReturns, maturityValue };

            addHistory({
                calculator: 'SIP Calculator',
                calculation: `SIP of ${formatCurrency(P)}/mo @ ${annualRate}% for ${years} yrs -> ${formatCurrency(maturityValue)}`,
                inputs: { mode, monthlyInvestment, returnRate, timePeriod }
            });
            setShareText(`SIP Calculation:\n- Monthly Investment: ${formatCurrency(P)}\n- Return Rate: ${annualRate}% p.a.\n- Time Period: ${years} years\n\nResult:\n- Total Investment: ${formatCurrency(totalInvestment)}\n- Estimated Returns: ${formatCurrency(estimatedReturns)}\n- Maturity Value: ${formatCurrency(maturityValue)}`);
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
    
    const handleGoalSeekCalculate = async (bypassFuelCheck = false) => {
        if (!bypassFuelCheck) {
            if (fuel > 0 && fuel < fuelCost) {
                setShowInsufficientFuelModal(true);
                return;
            }
            if (fuel >= fuelCost) {
                consumeFuel(fuelCost);
            } else { // fuel is 0, now check for ads
                 if (shouldShowAd(true)) { // Expert tools always show ad when out of fuel
                    setPendingResult('goalSeek'); // special flag
                    setShowAd(true);
                    return;
                }
            }
        }
        
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

    const handleAdClose = () => {
        if (pendingResult === 'goalSeek') {
            handleGoalSeekCalculate(true); // Bypass checks as ad has been shown
        } else if (pendingResult) {
            setResult(pendingResult);
        }
        setPendingResult(null);
        setShowAd(false);
    };

    const handleContinueAnyway = () => {
        setFuel(0); // This activates ad mode
        setShowInsufficientFuelModal(false);
        handleGoalSeekCalculate(true); // Now we can proceed
    };
    
    const handleWatchAdToUse = () => {
        setShowInsufficientFuelModal(false);
        setPendingResult('goalSeek');
        setShowRewardedAd(true);
    };

    const handleRewardedAdComplete = () => {
        setShowRewardedAd(false);
        handleGoalSeekCalculate(true);
    }

    const handleDownloadPdf = async () => {
        if (!result) return;
        
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.text('SIP Investment Report', 14, 22);
        pdf.line(14, 32, 196, 32);
        pdf.setFontSize(12);
        pdf.text('Inputs:', 14, 40);
        pdf.setFontSize(10);
        pdf.text(`Monthly Investment: ${formatCurrency(parseFloat(monthlyInvestment))}`, 20, 48);
        pdf.text(`Expected Return Rate: ${returnRate}% p.a.`, 20, 54);
        pdf.text(`Time Period: ${timePeriod} years`, 20, 60);
        pdf.line(14, 70, 196, 70);
        pdf.setFontSize(12);
        pdf.text('Results:', 14, 78);
        pdf.setFontSize(10);
        pdf.text(`Total Investment: ${formatCurrency(result.totalInvestment)}`, 20, 86);
        pdf.text(`Estimated Returns: ${formatCurrency(result.estimatedReturns)}`, 20, 92);
        pdf.text(`Maturity Value: ${formatCurrency(result.maturityValue)}`, 20, 98);
        
        const pieChartElement = document.getElementById('pdf-pie-chart-sip');
        if (pieChartElement) {
            const canvas = await html2canvas(pieChartElement, { backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 14, 110, 80, 80);
        }
        
        pdf.save(`SIP-Report-${Date.now()}.pdf`);
    };

    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            {showRewardedAd && <RewardedAdModal duration={5} rewardAmount={0} onClose={() => setShowRewardedAd(false)} onComplete={handleRewardedAdComplete}/>}
            {showInsufficientFuelModal && (
                 <InsufficientFuelModal
                    isOpen={true}
                    onClose={() => setShowInsufficientFuelModal(false)}
                    onWatchAd={handleWatchAdToUse}
                    onContinue={handleContinueAnyway}
                    onRefuel={() => setShowInsufficientFuelModal(false)}
                />
            )}
            {isExplainModalOpen && result && mode === 'calculate' && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="SIP Calculator"
                    inputs={{ monthlyInvestment, returnRate, timePeriod }}
                    result={result}
                />
            )}
            <div className="flex justify-center bg-theme-primary p-1 rounded-lg">
                <button onClick={() => handleModeChange('calculate')} className={`w-1/2 py-2 rounded-md transition text-sm ${mode === 'calculate' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Calculate Future Value</button>
                <button onClick={() => handleModeChange('goalSeek')} className={`w-1/2 py-2 rounded-md transition text-sm ${mode === 'goalSeek' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Plan a Goal (AI Expert)</button>
            </div>

            {mode === 'calculate' ? (
                <div className="space-y-4">
                    <div>
                         <div className="flex items-center space-x-2 mb-1">
                            <label htmlFor="monthlyInvestment" className="block text-sm font-medium text-theme-secondary">Monthly Investment ({currencySymbol})</label>
                            <InfoTooltip text="The fixed amount you plan to invest every month." />
                        </div>
                        <input type="number" id="monthlyInvestment" value={monthlyInvestment} onChange={e => setMonthlyInvestment(e.target.value)} className={inputClasses}/>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                         <div className="flex items-center space-x-2 mb-1">
                            <label htmlFor="targetAmount" className="block text-sm font-medium text-theme-secondary">I want to have... ({currencySymbol})</label>
                            <InfoTooltip text="Your financial goal amount." />
                        </div>
                        <input type="number" id="targetAmount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className={inputClasses}/>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="returnRate" className="block text-sm font-medium text-theme-secondary">Expected Return Rate (% p.a.)</label>
                        <InfoTooltip text="The annual rate of return you expect from your investment. This is an estimate." />
                    </div>
                    <input type="number" id="returnRate" value={returnRate} onChange={e => setReturnRate(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="timePeriod" className="block text-sm font-medium text-theme-secondary">Time Period (Years)</label>
                        <InfoTooltip text="The total duration for which you plan to invest." />
                    </div>
                    <input type="number" id="timePeriod" value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className={inputClasses}/>
                </div>
            </div>

            {mode === 'calculate' ? (
                 <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors duration-200 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Calculate
                </button>
            ) : (
                <button onClick={() => handleGoalSeekCalculate(false)} disabled={isGoalSeeking} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors duration-200 text-lg disabled:bg-theme-tertiary shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    {isGoalSeeking ? 'Calculating...' : 'Find Monthly SIP'}
                </button>
            )}

            {result && mode === 'calculate' && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Investment Projection</h3>
                    <div id="pdf-pie-chart-sip" className="py-4 bg-theme-secondary">
                      <PieChart data={[
                          { label: 'Total Investment', value: result.totalInvestment, color: '#3b82f6' },
                          { label: 'Estimated Returns', value: result.estimatedReturns, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Total Investment:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalInvestment)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Estimated Returns:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.estimatedReturns)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Maturity Value:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.maturityValue)}</span>
                    </div>
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme">
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain Calculation
                        </button>
                         <button onClick={handleDownloadPdf} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download PDF
                        </button>
                    </div>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
            
            {isGoalSeeking && (
                <div className="flex items-center justify-center space-x-2 text-theme-primary p-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>AI is planning your goal...</p>
                </div>
            )}
            {goalSeekError && <p className="text-red-500 text-center text-sm">{goalSeekError}</p>}
            {goalSeekResult && mode === 'goalSeek' && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in text-center">
                    <h3 className="text-lg font-semibold text-theme-secondary">To Reach Your Goal, You Need to Invest</h3>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(goalSeekResult.monthlyInvestment)}</p>
                    <p className="text-theme-secondary font-semibold">per month</p>
                    <p className="text-sm text-theme-primary pt-4 border-t border-theme mt-4">{goalSeekResult.explanation}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default SIPCalculator;