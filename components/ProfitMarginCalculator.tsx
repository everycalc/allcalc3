
import React, { useState, useMemo, useContext, useEffect } from 'react';
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

interface Result {
    grossProfit: number;
    profitMargin: number;
}

interface ProfitMarginCalculatorState {
    revenue: string;
    cogs: string;
}

interface ProfitMarginCalculatorProps {
    initialState?: ProfitMarginCalculatorState;
}

const ProfitMarginCalculator: React.FC<ProfitMarginCalculatorProps> = ({ initialState }) => {
    const [revenue, setRevenue] = useState('1000');
    const [cogs, setCogs] = useState('600');
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
            setRevenue(initialState.revenue || '1000');
            setCogs(initialState.cogs || '600');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const rev = parseFloat(revenue);
        const cost = parseFloat(cogs);

        if (isNaN(rev) || isNaN(cost) || rev <= 0) {
            setResult(null);
            return;
        }

        const gp = rev - cost;
        const margin = (gp / rev) * 100;
        
        const calculatedResult = { grossProfit: gp, profitMargin: margin };
        
        addHistory({
            calculator: 'Profit Margin Calculator',
            calculation: `Revenue: ${formatCurrency(rev)}, COGS: ${formatCurrency(cost)} -> Margin: ${margin.toFixed(2)}%`,
            inputs: { revenue, cogs }
        });
        
        setShareText(`Profit Margin Calculation:\n- Total Revenue: ${formatCurrency(rev)}\n- COGS: ${formatCurrency(cost)}\n\nResult:\n- Gross Profit: ${formatCurrency(gp)}\n- Profit Margin: ${margin.toFixed(2)}%`);

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

    const handleDownloadPdf = async () => {
        if (!result) return;
        
        const pdf = new jsPDF();
        
        pdf.setFontSize(18);
        pdf.text('Profit Margin Report', 14, 22);
        
        pdf.line(14, 32, 196, 32);

        pdf.setFontSize(12);
        pdf.text('Inputs:', 14, 40);
        pdf.setFontSize(10);
        pdf.text(`Total Revenue: ${formatCurrency(parseFloat(revenue))}`, 20, 48);
        pdf.text(`Cost of Goods Sold (COGS): ${formatCurrency(parseFloat(cogs))}`, 20, 54);

        pdf.line(14, 64, 196, 64);

        pdf.setFontSize(12);
        pdf.text('Results:', 14, 72);
        pdf.setFontSize(10);
        pdf.text(`Gross Profit: ${formatCurrency(result.grossProfit)}`, 20, 80);
        pdf.text(`Profit Margin: ${result.profitMargin.toFixed(2)}%`, 20, 86);
        
        const pieChartElement = document.getElementById('pdf-pie-chart-profit');
        if (pieChartElement) {
            const canvas = await html2canvas(pieChartElement, { backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 14, 100, 80, 80);
        }
        
        pdf.save(`Profit-Margin-Report-${Date.now()}.pdf`);
    };
    
    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Profit Margin Calculator"
                    inputs={{ revenue, cogs }}
                    result={result}
                />
            )}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="revenue" className="block text-sm font-medium text-theme-secondary">Total Revenue ({currencySymbol})</label>
                        <InfoTooltip text="The total amount of money generated from sales." />
                    </div>
                    <input type="number" id="revenue" value={revenue} onChange={(e) => setRevenue(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="cogs" className="block text-sm font-medium text-theme-secondary">Cost of Goods Sold (COGS) ({currencySymbol})</label>
                         <InfoTooltip text="The direct costs of producing the goods sold by a company. This includes the cost of the materials and labor directly used to create the good." />
                    </div>
                    <input type="number" id="cogs" value={cogs} onChange={(e) => setCogs(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>

            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Results</h3>
                    <div id="pdf-pie-chart-profit" className="py-4 bg-theme-secondary">
                      <PieChart data={[
                          { label: 'COGS', value: parseFloat(cogs), color: '#f97316' },
                          { label: 'Gross Profit', value: result.grossProfit, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Gross Profit:</span>
                        <span className="text-2xl font-bold text-theme-primary">{formatCurrency(result.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Profit Margin:</span>
                        <span className="text-2xl font-bold text-primary">{result.profitMargin.toFixed(2)}%</span>
                    </div>
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme">
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain & Get Insights
                        </button>
                         <button onClick={handleDownloadPdf} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download PDF
                        </button>
                    </div>
                     <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default ProfitMarginCalculator;
