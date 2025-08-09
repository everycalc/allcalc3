import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';

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
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

    const { addHistory } = useContext(HistoryContext);
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
        setResult(calculatedResult);
        
        addHistory({
            calculator: 'Profit Margin Calculator',
            calculation: `Revenue: ${formatCurrency(rev)}, COGS: ${formatCurrency(cost)} -> Margin: ${margin.toFixed(2)}%`,
            inputs: { revenue, cogs }
        });
        
        setShareText(`Profit Margin Calculation:\n- Total Revenue: ${formatCurrency(rev)}\n- COGS: ${formatCurrency(cost)}\n\nResult:\n- Gross Profit: ${formatCurrency(gp)}\n- Profit Margin: ${margin.toFixed(2)}%`);
    };
    
    return (
        <div className="space-y-6">
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
                        <label htmlFor="revenue" className="block text-sm font-medium text-on-surface-variant">Total Revenue ({currencySymbol})</label>
                        <InfoTooltip text="The total amount of money generated from sales." />
                    </div>
                    <input type="number" id="revenue" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="cogs" className="block text-sm font-medium text-on-surface-variant">Cost of Goods Sold (COGS) ({currencySymbol})</label>
                         <InfoTooltip text="The direct costs of producing the goods sold by a company. This includes the cost of the materials and labor directly used to create the good." />
                    </div>
                    <input type="number" id="cogs" value={cogs} onChange={(e) => setCogs(e.target.value)} className="input-base w-full"/>
                </div>
            </div>
            
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg">
                Calculate
            </button>

            {result && (
                <div className="result-card p-6 space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Results</h3>
                    <div id="pdf-pie-chart-profit" className="py-4">
                      <PieChart data={[
                          { label: 'COGS', value: parseFloat(cogs), color: '#f97316' },
                          { label: 'Gross Profit', value: result.grossProfit, color: '#16a34a' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Gross Profit:</span>
                        <span className="text-2xl font-bold text-on-surface">{formatCurrency(result.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant pt-4 mt-4">
                        <span className="text-on-surface-variant">Profit Margin:</span>
                        <span className="text-2xl font-bold text-primary">{result.profitMargin.toFixed(2)}%</span>
                    </div>
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant">
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain & Get Insights
                        </button>
                         <ShareButton textToShare={shareText} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfitMarginCalculator;