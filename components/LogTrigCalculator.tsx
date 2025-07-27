
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import ShareButton from './ShareButton';

const LogTrigCalculator: React.FC<{initialState?: any}> = ({initialState}) => {
    const [input, setInput] = useState('90');
    const [result, setResult] = useState<string | null>(null);
    const [operation, setOperation] = useState('');
    const [isDeg, setIsDeg] = useState(true);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();

    useEffect(() => {
        if (initialState) {
            setInput(initialState.input || '90');
            setIsDeg(initialState.isDeg === false ? false : true); // handle boolean
            setResult(null);
            setOperation('');
        }
    }, [initialState]);

    const handleCalculate = (op: string) => {
        const value = parseFloat(input);
        if (isNaN(value)) return;

        let res: number = 0;
        let calcString = '';

        const trigValue = isDeg ? value * Math.PI / 180 : value;

        switch(op) {
            case 'sin': res = Math.sin(trigValue); calcString = `sin(${input}${isDeg ? '°':''}) = ${parseFloat(res.toPrecision(10))}`; break;
            case 'cos': res = Math.cos(trigValue); calcString = `cos(${input}${isDeg ? '°':''}) = ${parseFloat(res.toPrecision(10))}`; break;
            case 'tan': res = Math.tan(trigValue); calcString = `tan(${input}${isDeg ? '°':''}) = ${parseFloat(res.toPrecision(10))}`; break;
            case 'log': res = Math.log10(value); calcString = `log(${input}) = ${parseFloat(res.toPrecision(10))}`; break;
            case 'ln': res = Math.log(value); calcString = `ln(${input}) = ${parseFloat(res.toPrecision(10))}`; break;
        }

        const finalResult = parseFloat(res.toPrecision(10)).toString();
        addHistory({ calculator: 'Logarithm & Trigonometry', calculation: calcString, inputs: { input, isDeg } });
        setShareText(`Log/Trig Calculation:\n${calcString}`);
        
        if (shouldShowAd()) {
            setOperation(op);
            setPendingResult(finalResult);
            setShowAd(true);
        } else {
            setOperation(op);
            setResult(finalResult);
        }
    };
    
    const handleAdClose = () => {
        if (pendingResult) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };

    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 text-center text-2xl font-bold focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div>
                <label htmlFor="input" className="block text-sm font-medium text-theme-secondary mb-1 text-center">Enter Value</label>
                <input type="number" id="input" value={input} onChange={e => setInput(e.target.value)} className={inputClasses} />
            </div>
             <div className="flex justify-center bg-theme-secondary p-1 rounded-lg">
                <button onClick={() => setIsDeg(true)} className={`w-1/2 py-2 rounded-md transition ${isDeg ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Degrees</button>
                <button onClick={() => setIsDeg(false)} className={`w-1/2 py-2 rounded-md transition ${!isDeg ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Radians</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleCalculate('sin')} className="p-4 bg-theme-tertiary rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition">sin</button>
                <button onClick={() => handleCalculate('cos')} className="p-4 bg-theme-tertiary rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition">cos</button>
                <button onClick={() => handleCalculate('tan')} className="p-4 bg-theme-tertiary rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition">tan</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => handleCalculate('log')} className="p-4 bg-theme-tertiary rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition">log₁₀</button>
                 <button onClick={() => handleCalculate('ln')} className="p-4 bg-theme-tertiary rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition">ln</button>
            </div>
            {result && (
                <div className="bg-theme-primary/50 p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-theme-secondary mb-2">Result</h3>
                    <p className="text-4xl font-bold text-primary break-all">{result}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default LogTrigCalculator;