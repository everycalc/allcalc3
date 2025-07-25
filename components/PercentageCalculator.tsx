
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import ShareButton from './ShareButton';

type Mode = 'percentOf' | 'isWhatPercent' | 'percentChange';

const PercentageCalculator: React.FC<{initialState?: any}> = ({initialState}) => {
    const [mode, setMode] = useState<Mode>('percentOf');
    const [inputs, setInputs] = useState({ val1: '20', val2: '500' });
    const [result, setResult] = useState<string | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();

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
        if (isNaN(v1) || isNaN(v2)) return;

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

        if (shouldShowAd()) {
            setPendingResult(res);
            setShowAd(true);
        } else {
            setResult(res);
        }
    };
    
    const handleAdClose = () => {
        if (pendingResult) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
        setResult(null);
    };

    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    const renderInputs = () => {
        switch (mode) {
            case 'percentOf': return (<>
                <div><label className="text-sm font-medium text-theme-secondary mb-1">What is</label><input type="number" name="val1" value={inputs.val1} onChange={handleInputChange} className={inputClasses}/></div>
                <div><label className="text-sm font-medium text-theme-secondary mb-1">% of</label><input type="number" name="val2" value={inputs.val2} onChange={handleInputChange} className={inputClasses}/></div>
            </>);
            case 'isWhatPercent': return (<>
                <div><label className="text-sm font-medium text-theme-secondary mb-1">Value</label><input type="number" name="val1" value={inputs.val1} onChange={handleInputChange} className={inputClasses}/></div>
                <div><label className="text-sm font-medium text-theme-secondary mb-1">is what % of</label><input type="number" name="val2" value={inputs.val2} onChange={handleInputChange} className={inputClasses}/></div>
            </>);
            case 'percentChange': return (<>
                <div><label className="text-sm font-medium text-theme-secondary mb-1">From</label><input type="number" name="val1" value={inputs.val1} onChange={handleInputChange} className={inputClasses}/></div>
                <div><label className="text-sm font-medium text-theme-secondary mb-1">To</label><input type="number" name="val2" value={inputs.val2} onChange={handleInputChange} className={inputClasses}/></div>
            </>);
        }
    };

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div className="grid grid-cols-3 text-center bg-theme-primary p-1 rounded-lg">
                <button onClick={() => handleModeChange('percentOf')} className={`py-2 rounded-md transition text-sm ${mode === 'percentOf' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>% of X</button>
                <button onClick={() => handleModeChange('isWhatPercent')} className={`py-2 rounded-md transition text-sm ${mode === 'isWhatPercent' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>X is what %</button>
                <button onClick={() => handleModeChange('percentChange')} className={`py-2 rounded-md transition text-sm ${mode === 'percentChange' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>% Change</button>
            </div>
            <div className="grid grid-cols-2 gap-4">{renderInputs()}</div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            {result !== null && (
                <div className="bg-theme-primary/50 p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-theme-secondary mb-2">Result</h3>
                    <p className="text-4xl font-bold text-primary">{result}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default PercentageCalculator;