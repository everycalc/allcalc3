
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';

type GstAction = 'add' | 'remove';

interface Result {
    initialAmount: number;
    finalAmount: number;
    taxAmount: number;
}

interface GSTTaxCalculatorState {
    amount: string;
    rate: string;
    action: GstAction;
}

interface GSTTaxCalculatorProps {
    initialState?: GSTTaxCalculatorState;
}

const GSTTaxCalculator: React.FC<GSTTaxCalculatorProps> = ({initialState}) => {
    const [amount, setAmount] = useState('1000');
    const [rate, setRate] = useState('18');
    const [action, setAction] = useState<GstAction>('add');
    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setAmount(initialState.amount || '1000');
            setRate(initialState.rate || '18');
            setAction(initialState.action || 'add');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const baseAmount = parseFloat(amount);
        const taxRate = parseFloat(rate) / 100;

        if (isNaN(baseAmount) || isNaN(taxRate)) {
            setResult(null);
            return;
        }

        let initialAmount = 0;
        let finalAmount = 0;
        let taxAmount = 0;

        if (action === 'add') {
            initialAmount = baseAmount;
            taxAmount = baseAmount * taxRate;
            finalAmount = baseAmount + taxAmount;
        } else { // remove
            finalAmount = baseAmount;
            initialAmount = baseAmount / (1 + taxRate);
            taxAmount = finalAmount - initialAmount;
        }

        const calculatedResult = { initialAmount, finalAmount, taxAmount };
        
        addHistory({
            calculator: 'GST/Tax Calculator',
            calculation: `${action === 'add' ? 'Add' : 'Remove'} ${rate}% GST on ${formatCurrency(baseAmount)}`,
            inputs: { amount, rate, action }
        });
        
        setShareText(`GST/Tax Calculation:\n- Action: ${action === 'add' ? 'Add' : 'Remove'} GST\n- Amount: ${formatCurrency(baseAmount)}\n- Rate: ${rate}%\n\nResult:\n- Initial Amount: ${formatCurrency(initialAmount)}\n- Tax Amount: ${formatCurrency(taxAmount)}\n- Final Amount: ${formatCurrency(finalAmount)}`);

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

    const handleActionChange = (newAction: GstAction) => {
        setAction(newAction);
        setResult(null);
    };

    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div className="flex justify-center bg-theme-primary p-1 rounded-lg">
                <button onClick={() => handleActionChange('add')} className={`w-1/2 py-2 rounded-md transition ${action === 'add' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Add GST</button>
                <button onClick={() => handleActionChange('remove')} className={`w-1/2 py-2 rounded-md transition ${action === 'remove' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Remove GST</button>
            </div>
            <div className="space-y-4">
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-theme-secondary">{action === 'add' ? 'Initial Amount' : 'Final Amount'} ({currencySymbol})</label>
                        <InfoTooltip text={action === 'add' ? "The price before tax is applied." : "The price after tax has been included."} />
                    </div>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="rate" className="block text-sm font-medium text-theme-secondary mb-1">GST / Tax Rate (%)</label>
                    <input type="number" id="rate" value={rate} onChange={e => setRate(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Tax Calculation</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Initial Amount:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.initialAmount)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">GST/Tax Amount:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Final Amount:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.finalAmount)}</span>
                    </div>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default GSTTaxCalculator;