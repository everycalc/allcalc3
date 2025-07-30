
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';

interface Result {
    totalWithTip: number;
    perPersonCost: number;
    tipAmount: number;
}

const TripExpenseSplitter: React.FC<{initialState?: any}> = ({initialState}) => {
    const [billAmount, setBillAmount] = useState('2500');
    const [people, setPeople] = useState('4');
    const [tipPercent, setTipPercent] = useState('10');
    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setBillAmount(initialState.billAmount || '2500');
            setPeople(initialState.people || '4');
            setTipPercent(initialState.tipPercent || '10');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const bill = parseFloat(billAmount);
        const numPeople = parseInt(people, 10);
        const tip = parseFloat(tipPercent) / 100;

        if (isNaN(bill) || isNaN(numPeople) || isNaN(tip) || bill <= 0 || numPeople <= 0) {
            setResult(null);
            return;
        }

        const tipAmount = bill * tip;
        const totalWithTip = bill + tipAmount;
        const perPersonCost = totalWithTip / numPeople;
        
        const calculatedResult = { totalWithTip, perPersonCost, tipAmount };
        
        addHistory({ calculator: 'Trip Expense Splitter', calculation: `${formatCurrency(totalWithTip)} split among ${numPeople} people`, inputs: { billAmount, people, tipPercent } });
        
        setShareText(`Expense Split:\n- Total Bill: ${formatCurrency(bill)}\n- People: ${numPeople}\n- Tip: ${tipPercent}%\n\nResult:\n- Cost per Person: ${formatCurrency(perPersonCost)}\n- Total with Tip: ${formatCurrency(totalWithTip)}`);

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

    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div className="space-y-4">
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label className="text-sm font-medium text-theme-secondary">Total Bill Amount ({currencySymbol})</label>
                        <InfoTooltip text="The total amount of the bill before adding any tip." />
                    </div>
                    <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label className="text-sm font-medium text-theme-secondary mb-1">Number of People</label>
                    <input type="number" value={people} onChange={e => setPeople(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label className="text-sm font-medium text-theme-secondary mb-1">Tip (%)</label>
                    <input type="number" value={tipPercent} onChange={e => setTipPercent(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Split Expense
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Expense Split</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Cost per Person:</span>
                        <span className="text-3xl font-bold text-primary">{formatCurrency(result.perPersonCost)}</span>
                    </div>
                     <div className="flex justify-between items-center border-t border-theme pt-4 mt-4">
                        <span className="text-theme-secondary">Total Bill + Tip:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.totalWithTip)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Tip Amount:</span>
                        <span className="text-lg font-medium text-theme-primary">{formatCurrency(result.tipAmount)}</span>
                    </div>
                     <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default TripExpenseSplitter;