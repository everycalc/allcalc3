import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

interface Result {
    average: number;
    sum: number;
    count: number;
}

interface AverageCalculatorProps {
    initialState?: any;
    isPremium?: boolean;
}

const AverageCalculator: React.FC<AverageCalculatorProps> = ({initialState, isPremium}) => {
    const [numbers, setNumbers] = useState('10, 20, 30, 40, 50');
    const [result, setResult] = useState<Result | null>(null);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);

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
        setResult(calculatedResult);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="numbers" className="block text-sm font-medium text-on-surface-variant mb-1">Enter numbers, separated by commas</label>
                <textarea id="numbers" value={numbers} onChange={e => setNumbers(e.target.value)} rows={4} className="textarea-base w-full" />
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg">
                Calculate Average
            </button>
            {result && (
                <div className="result-card p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Results</h3>
                    <div className="grid grid-cols-3 text-center divide-x divide-outline-variant">
                        <div><p className="text-on-surface-variant text-sm">Average</p><p className="text-2xl font-bold text-primary">{result.average.toFixed(2)}</p></div>
                        <div><p className="text-on-surface-variant text-sm">Sum</p><p className="text-2xl font-bold text-on-surface">{result.sum.toLocaleString()}</p></div>
                        <div><p className="text-on-surface-variant text-sm">Count</p><p className="text-2xl font-bold text-on-surface">{result.count}</p></div>
                    </div>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default AverageCalculator;
