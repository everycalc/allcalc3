import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

const LogTrigCalculator: React.FC<{initialState?: any, isPremium?: boolean}> = ({initialState, isPremium}) => {
    const [input, setInput] = useState('90');
    const [result, setResult] = useState<string | null>(null);
    const [operation, setOperation] = useState('');
    const [isDeg, setIsDeg] = useState(true);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);

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
        if (isNaN(value)) {
            setResult(null);
            return;
        }

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
        setOperation(op);
        setResult(finalResult);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="input" className="block text-sm font-medium text-on-surface-variant mb-1 text-center">Enter Value</label>
                <input type="number" id="input" value={input} onChange={e => setInput(e.target.value)} className="input-base w-full text-center text-2xl font-bold" />
            </div>
             <div className="toggle-group flex justify-center p-1 rounded-lg">
                <button onClick={() => setIsDeg(true)} className={`toggle-button w-1/2 py-2 rounded-md transition ${isDeg ? 'toggle-button-active' : ''}`}>Degrees</button>
                <button onClick={() => setIsDeg(false)} className={`toggle-button w-1/2 py-2 rounded-md transition ${!isDeg ? 'toggle-button-active' : ''}`}>Radians</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleCalculate('sin')} className="btn-secondary p-4 rounded-lg font-semibold">sin</button>
                <button onClick={() => handleCalculate('cos')} className="btn-secondary p-4 rounded-lg font-semibold">cos</button>
                <button onClick={() => handleCalculate('tan')} className="btn-secondary p-4 rounded-lg font-semibold">tan</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => handleCalculate('log')} className="btn-secondary p-4 rounded-lg font-semibold">log₁₀</button>
                 <button onClick={() => handleCalculate('ln')} className="btn-secondary p-4 rounded-lg font-semibold">ln</button>
            </div>
            {result && (
                <div className="result-card p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-on-surface-variant mb-2">Result</h3>
                    <p className="text-4xl font-bold text-primary break-all">{result}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default LogTrigCalculator;
