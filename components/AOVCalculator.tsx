
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';

interface AOVCalculatorState {
    revenue: string;
    orders: string;
}

interface AOVCalculatorProps {
    isPremium?: boolean;
    initialState?: AOVCalculatorState;
}

const AOVCalculator: React.FC<AOVCalculatorProps> = ({ isPremium, initialState }) => {
    const [revenue, setRevenue] = useState('10000');
    const [orders, setOrders] = useState('200');
    const [result, setResult] = useState<number | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setRevenue(initialState.revenue || '10000');
            setOrders(initialState.orders || '200');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const rev = parseFloat(revenue);
        const ord = parseFloat(orders);

        if (isNaN(rev) || isNaN(ord) || ord <= 0) {
            setResult(null);
            return;
        }

        const aov = rev / ord;
        addHistory({
            calculator: 'AOV Calculator',
            calculation: `AOV: ${formatCurrency(rev)} / ${ord} = ${formatCurrency(aov)}`,
            inputs: { revenue, orders }
        });
        
        setShareText(`AOV Calculation:\n- Total Revenue: ${formatCurrency(rev)}\n- Total Orders: ${ord}\n\nResult:\n- Average Order Value (AOV): ${formatCurrency(aov)}`);

        if (shouldShowAd(isPremium)) {
            setPendingResult(aov);
            setShowAd(true);
        } else {
            setResult(aov);
        }
    };
    
    const handleAdClose = () => {
        if (pendingResult !== null) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };
    
    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
             {isExplainModalOpen && result !== null && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="AOV Calculator"
                    inputs={{ revenue, orders }}
                    result={{ aov: result }}
                />
            )}
            <div className="space-y-4">
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="revenue" className="block text-sm font-medium text-theme-secondary">Total Revenue ({currencySymbol})</label>
                        <InfoTooltip text="The total revenue generated from all orders over a specific period." />
                    </div>
                    <input type="number" id="revenue" value={revenue} onChange={e => setRevenue(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="orders" className="block text-sm font-medium text-theme-secondary">Total Number of Orders</label>
                        <InfoTooltip text="The total count of orders placed during the same period." />
                    </div>
                    <input type="number" id="orders" value={orders} onChange={e => setOrders(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            {result !== null && (
                <div className="bg-theme-primary/50 p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-theme-secondary mb-2">Average Order Value (AOV)</h3>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(result)}</p>
                    <div className="flex justify-between items-center mt-4">
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

export default AOVCalculator;
