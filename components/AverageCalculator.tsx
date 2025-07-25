
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import ShareButton from './ShareButton';

interface Result {
    average: number;
    sum: number;
    count: number;
}

const AverageCalculator: React.FC<{initialState?: any}> = ({initialState}) => {
    const [numbers, setNumbers] = useState('10, 20, 30, 40, 50');
    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();

    useEffect(() => {
        if (initialState) {
            setNumbers(initialState.numbers || '10, 20, 30, 40, 50');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const numArray = numbers.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        if (numArray.length === 0) {
            setResult(null);
            return;
        }

        const sum = numArray.reduce((acc, val) => acc + val, 0);
        const count = numArray.length;
        const average = sum / count;

        const calculatedResult = { average, sum, count };
        addHistory({ calculator: 'Average Calculator', calculation: `Avg of ${count} numbers = ${average.toFixed(2)}`, inputs: { numbers } });
        
        setShareText(`Average Calculation:\n- Numbers: ${numbers}\n\nResult:\n- Average: ${average.toFixed(2)}\n- Sum: ${sum.toLocaleString()}\n- Count: ${count}`);

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

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div>
                <label htmlFor="numbers" className="block text-sm font-medium text-theme-secondary mb-1">Enter numbers, separated by commas</label>
                <textarea id="numbers" value={numbers} onChange={e => setNumbers(e.target.value)} rows={4} className="w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition" />
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate Average
            </button>
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Results</h3>
                    <div className="grid grid-cols-3 text-center divide-x divide-theme">
                        <div><p className="text-theme-secondary text-sm">Average</p><p className="text-2xl font-bold text-primary">{result.average.toFixed(2)}</p></div>
                        <div><p className="text-theme-secondary text-sm">Sum</p><p className="text-2xl font-bold text-theme-primary">{result.sum.toLocaleString()}</p></div>
                        <div><p className="text-theme-secondary text-sm">Count</p><p className="text-2xl font-bold text-theme-primary">{result.count}</p></div>
                    </div>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default AverageCalculator;