import React, { useState, useCallback, useContext, useMemo, useEffect } from 'react';
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
import { useFuel } from '../contexts/FuelContext';
import PdfFuelModal from './PdfFuelModal';
import RewardedAdModal from './RewardedAdModal';

interface LoanCalculatorState {
    principal: string;
    interestRate: string;
    loanTerm: string;
}

interface LoanCalculatorProps {
    initialState?: LoanCalculatorState;
    isPremium?: boolean;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ initialState, isPremium }) => {
    const [principal, setPrincipal] = useState('100000');
    const [interestRate, setInterestRate] = useState('5');
    const [loanTerm, setLoanTerm] = useState('30');
    const [result, setResult] = useState<{ monthlyPayment: number; totalInterest: number; totalPayment: number } | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showPdfFuelModal, setShowPdfFuelModal] = useState(false);
    const [showRefuelModal, setShowRefuelModal] = useState(false);


    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();
    const { fuel, consumeFuel, addFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;

    useEffect(() => {
        if (initialState) {
            setPrincipal(initialState.principal || '100000');
            setInterestRate(initialState.interestRate || '5');
            setLoanTerm(initialState.loanTerm || '30');
            setResult(null); // Clear previous result when restoring
            setShowSchedule(false);
        }
    }, [initialState]);

    const amortizationSchedule = useMemo(() => {
        if (!result) return [];
        const p = parseFloat(principal);
        const monthlyRate = parseFloat(interestRate) / 100 / 12;
        const numberOfPayments = parseFloat(loanTerm) * 12;

        let schedule = [];
        let balance = p;
        for (let i = 1; i <= numberOfPayments; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = result.monthlyPayment - interestPayment;
            balance -= principalPayment;
            schedule.push({
                month: i,
                interest: interestPayment,
                principal: principalPayment,
                balance: balance > 0 ? balance : 0,
            });
        }
        return schedule;
    }, [result, principal, interestRate, loanTerm]);

    const calculateLoan = useCallback(() => {
        const performCalculation = () => {
            setShowSchedule(false);
            const p = parseFloat(principal);
            const annualRate = parseFloat(interestRate);
            const years = parseFloat(loanTerm);

            if (p > 0 && annualRate > 0 && years > 0) {
                const monthlyRate = annualRate / 100 / 12;
                const numberOfPayments = years * 12;

                const monthlyPayment = p * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
                const totalPayment = monthlyPayment * numberOfPayments;
                const totalInterest = totalPayment - p;

                const calculatedResult = { monthlyPayment, totalInterest, totalPayment };
                
                const historyText = `Loan: ${formatCurrency(p)} @ ${annualRate}% for ${years} years -> ${formatCurrency(monthlyPayment)}/mo`;
                addHistory({
                    calculator: 'Loan Calculator',
                    calculation: historyText,
                    inputs: { principal, interestRate, loanTerm }
                });
                
                setShareText(`Loan Calculation:\n- Loan Amount: ${formatCurrency(p)}\n- Interest Rate: ${annualRate}%\n- Term: ${years} years\n\n- Monthly Payment: ${formatCurrency(monthlyPayment)}\n- Total Interest: ${formatCurrency(totalInterest)}`);
                return calculatedResult;
            }
            return null;
        };
        
        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            const calculatedResult = performCalculation();
            if (calculatedResult) {
                setResult(calculatedResult);
            }
        } else {
            const calculatedResult = performCalculation();
            if (calculatedResult) {
                if (shouldShowAd(isPremium)) {
                    setPendingResult(calculatedResult);
                    setShowAd(true);
                } else {
                    setResult(calculatedResult);
                }
            }
        }

    }, [principal, interestRate, loanTerm, addHistory, shouldShowAd, formatCurrency, fuel, consumeFuel, fuelCost, isPremium]);

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
            {showPdfFuelModal && <PdfFuelModal isOpen={showPdfFuelModal} onClose={() => setShowPdfFuelModal(false)} cost={5} onRefuel={() => { setShowPdfFuelModal(false); setShowRefuelModal(true); }} />}
            {showRefuelModal && <RewardedAdModal onClose={() => setShowRefuelModal(false)} onComplete={() => { addFuel(3); setShowRefuelModal(false); }} />}
            {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Loan Calculator"
                    inputs={{ principal, interestRate, loanTerm }}
                    result={result}
                />
            )}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="principal" className="block text-sm font-medium text-theme-secondary">Loan Amount ({currencySymbol})</label>
                        <InfoTooltip text="The total amount of money you are borrowing." />
                    </div>
                    <input type="number" id="principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="interestRate" className="block text-sm font-medium text-theme-secondary">Annual Interest Rate (%)</label>
                         <InfoTooltip text="The yearly interest rate for the loan." />
                    </div>
                    <input type="number" id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="loanTerm" className="block text-sm font-medium text-theme-secondary">Loan Term (Years)</label>
                        <InfoTooltip text="The number of years you have to repay the loan." />
                    </div>
                    <input type="number" id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            <button onClick={calculateLoan} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-primary ring-primary text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Calculate
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Results</h3>
                    <div id="pdf-pie-chart" className="py-4 bg-theme-secondary">
                      <PieChart data={[
                          { label: 'Principal', value: parseFloat(principal), color: '#3b82f6' },
                          { label: 'Total Interest', value: result.totalInterest, color: '#ef4444' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Monthly Payment:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyPayment)}</span>
                    </div>
                     <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Total Payment:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Total Interest Paid:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme">
                        <button onClick={() => setShowSchedule(s => !s)} className="text-sm font-semibold text-primary hover:underline">
                             {showSchedule ? 'Hide' : 'View'} Schedule
                        </button>
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain
                        </button>
                    </div>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
             {result && showSchedule && (
                <div className="bg-theme-secondary p-4 rounded-lg animate-fade-in mt-4">
                    <h4 className="text-lg font-semibold text-center mb-2">Amortization Schedule</h4>
                    <div className="max-h-60 overflow-y-auto text-sm amortization-table">
                        <table className="w-full text-left">
                           <thead>
                                <tr className="border-b border-theme">
                                    <th className="p-2">Month</th>
                                    <th className="p-2 text-right">Principal</th>
                                    <th className="p-2 text-right">Interest</th>
                                    <th className="p-2 text-right">Balance</th>
                                </tr>
                           </thead>
                           <tbody>
                               {amortizationSchedule.map(row => (
                                   <tr key={row.month} className="border-b border-theme-primary/10">
                                       <td className="p-2">{row.month}</td>
                                       <td className="p-2 text-right">{formatCurrency(row.principal)}</td>
                                       <td className="p-2 text-right">{formatCurrency(row.interest)}</td>
                                       <td className="p-2 text-right">{formatCurrency(row.balance)}</td>
                                   </tr>
                               ))}
                           </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanCalculator;