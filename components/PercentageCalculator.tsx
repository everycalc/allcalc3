import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

type Mode = 'percentOf' | 'isWhatPercent' | 'percentChange';

interface PercentageCalculatorProps {
    initialState?: any;
    isPremium?: boolean;
}

const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({initialState, isPremium}) => {
    const [mode, setMode] = useState<Mode>('percentOf');
    const [inputs, setInputs] = useState({ val1: '20', val2: '500' });
    const [result, setResult] = useState<string | null>(null);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);

    useEffect(() => {
        if (initialState) {
            setMode(initialState.mode || 'percentOf');
            setInputs(initialState.inputs || { val1: '20', val2: '500' });
            setResult(null);
        }
    }, [initialState]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCalculate = () => {
        const v1 = parseFloat(inputs.val1);
        const v2 = parseFloat(inputs.val2);
        if (isNaN(v1) || isNaN(v2)) {
            setResult(null);
            return;
        }

        let res = '';
        let historyCalc = '';

        switch (mode) {
            case 'percentOf':
                res = ((v1 / 100) * v2).toLocaleString();
                historyCalc = `${v1}% of ${v2} = ${res}`;
                break;
            case 'isWhatPercent':
                res = v2 !== 0 ? ((v1 / v2) * 100).toFixed(2) + '%' : 'N/A';
                historyCalc = `${v1} is what % of ${v2}? ${res}`;
                break;
            case 'percentChange':
                const change = v2 - v1;
                res = v1 !== 0 ? ((change / v1) * 100).toFixed(2) + '%' : 'N/A';
                historyCalc = `% change from ${v1} to ${v2} is ${res}`;
                break;
        }
        
        addHistory({ calculator: 'Percentage Calculator', calculation: historyCalc, inputs: { mode, ...inputs } });
        setShareText(`Percentage Calculation:\n- Calculation: ${historyCalc}`);
        setResult(res);
    };

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
        setResult(null);
    };

    const renderInputs = () => {
        switch (mode) {
            case 'percentOf': return (<>
                <div><label className="text-sm font-medium text-on-surface-variant mb-1">What is</label><input type="number" name="val1" value={inputs.val1} onChange={handleInputChange} className="input-base w-full"/></div>
                <div><label className="text-sm font-medium text-on-surface-variant mb-1">% of</label><input type="number" name="val2" value={inputs.val2} onChange={handleInputChange} className="input-base w-full"/></div>
            </>);
            case 'isWhatPercent': return (<>
                <div><label className="text-sm font-medium text-on-surface-variant mb-1">Value</label><input type="number" name="val1" value={inputs.val1} onChange={handleInputChange} className="input-base w-full"/></div>
                <div><label className="text-sm font-medium text-on-surface-variant mb-1">is what % of</label><input type="number" name="val2" value={inputs.val2} onChange={handleInputChange} className="input-base w-full"/></div>
            </>);
            case 'percentChange': return (<>
                <div><label className="text-sm font-medium text-on-surface-variant mb-1">From</label><input type="number" name="val1" value={inputs.val1} onChange={handleInputChange} className="input-base w-full"/></div>
                <div><label className="text-sm font-medium text-on-surface-variant mb-1">To</label><input type="number" name="val2" value={inputs.val2} onChange={handleInputChange} className="input-base w-full"/></div>
            </>);
        }
    };

    return (
        <div className="space-y-6">
            <div className="toggle-group flex justify-center p-1 rounded-lg">
                <button onClick={() => handleModeChange('percentOf')} className={`toggle-button w-1/3 py-2 rounded-md transition text-sm ${mode === 'percentOf' ? 'toggle-button-active' : ''}`}>% of a Number</button>
                <button onClick={() => handleModeChange('isWhatPercent')} className={`toggle-button w-1/3 py-2 rounded-md transition text-sm ${mode === 'isWhatPercent' ? 'toggle-button-active' : ''}`}>X is what % of Y</button>
                <button onClick={() => handleModeChange('percentChange')} className={`toggle-button w-1/3 py-2 rounded-md transition text-sm ${mode === 'percentChange' ? 'toggle-button-active' : ''}`}>% Change</button>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
                {renderInputs()}
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            {result && (
                <div className="result-card p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-on-surface-variant mb-2">Result</h3>
                    <p className="text-4xl font-bold text-primary">{result}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default PercentageCalculator;
