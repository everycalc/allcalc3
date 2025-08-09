import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

interface Result {
    median: number;
    mode: number[] | string;
}

interface MedianModeCalculatorProps {
    initialState?: any;
    isPremium?: boolean;
}

const MedianModeCalculator: React.FC<MedianModeCalculatorProps> = ({initialState, isPremium}) => {
    const [numbers, setNumbers] = useState('1, 2, 2, 3, 4, 5, 5, 5, 6');
    const [result, setResult] = useState<Result | null>(null);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);

    useEffect(() => {
        if (initialState) {
            setNumbers(initialState.numbers || '1, 2, 2, 3, 4, 5, 5, 5, 6');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const numArray = numbers.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)).sort((a, b) => a - b);
        if (numArray.length === 0) {
            setResult(null);
            return;
        }

        // Median
        const mid = Math.floor(numArray.length / 2);
        const median = numArray.length % 2 !== 0 ? numArray[mid] : (numArray[mid - 1] + numArray[mid]) / 2;

        // Mode
        const frequency: {[key: number]: number} = {};
        let maxFreq = 0;
        numArray.forEach(n => {
            frequency[n] = (frequency[n] || 0) + 1;
            if (frequency[n] > maxFreq) maxFreq = frequency[n];
        });

        let mode: number[] | string;
        if (maxFreq > 1) {
            mode = Object.keys(frequency).map(Number).filter(n => frequency[n] === maxFreq);
        } else {
            mode = 'No mode';
        }
        
        const modeString = Array.isArray(mode) ? mode.join(', ') : mode;
        const calculatedResult = { median, mode };
        addHistory({ calculator: 'Median & Mode Calculator', calculation: `Median: ${median}, Mode: ${modeString}`, inputs: { numbers } });

        setShareText(`Median & Mode Calculation:\n- Numbers: ${numbers}\n\nResult:\n- Median: ${median}\n- Mode: ${modeString}`);
        setResult(calculatedResult);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="numbers" className="block text-sm font-medium text-on-surface-variant mb-1">Enter numbers, separated by commas</label>
                <textarea id="numbers" value={numbers} onChange={e => setNumbers(e.target.value)} rows={4} className="textarea-base w-full" />
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            {result && (
                <div className="result-card p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Results</h3>
                    <div className="grid grid-cols-2 text-center divide-x divide-outline-variant">
                        <div><p className="text-on-surface-variant text-sm">Median</p><p className="text-3xl font-bold text-primary">{result.median}</p></div>
                        <div><p className="text-on-surface-variant text-sm">Mode</p><p className="text-3xl font-bold text-primary">{Array.isArray(result.mode) ? result.mode.join(', ') : result.mode}</p></div>
                    </div>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default MedianModeCalculator;
