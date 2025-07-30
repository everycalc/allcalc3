
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import ShareButton from './ShareButton';

type CalculateType = 'force' | 'mass' | 'acceleration';

const ForceAccelerationCalculator: React.FC<{initialState?: any}> = ({initialState}) => {
    const [calculate, setCalculate] = useState<CalculateType>('force');
    const [force, setForce] = useState('100');
    const [mass, setMass] = useState('10');
    const [acceleration, setAcceleration] = useState('10');
    const [result, setResult] = useState<string | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();

    useEffect(() => {
        if (initialState) {
            setCalculate(initialState.calculate || 'force');
            setForce(initialState.force || '100');
            setMass(initialState.mass || '10');
            setAcceleration(initialState.acceleration || '10');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const f = parseFloat(force);
        const m = parseFloat(mass);
        const a = parseFloat(acceleration);
        let res: number | null = null;
        let historyCalc = '';

        switch (calculate) {
            case 'force':
                if (!isNaN(m) && !isNaN(a)) {
                    res = m * a;
                    historyCalc = `Force = ${m}kg * ${a}m/s² = ${res.toFixed(2)} N`;
                } break;
            case 'mass':
                if (!isNaN(f) && !isNaN(a) && a !== 0) {
                    res = f / a;
                    historyCalc = `Mass = ${f}N / ${a}m/s² = ${res.toFixed(2)} kg`;
                } break;
            case 'acceleration':
                if (!isNaN(f) && !isNaN(m) && m !== 0) {
                    res = f / m;
                    historyCalc = `Acceleration = ${f}N / ${m}kg = ${res.toFixed(2)} m/s²`;
                } break;
        }

        if (res !== null) {
            addHistory({ calculator: 'Force & Acceleration', calculation: historyCalc, inputs: { calculate, force, mass, acceleration } });
            setShareText(`Physics Calculation (F=ma):\n${historyCalc}`);
            if (shouldShowAd()) {
                setPendingResult(res);
                setShowAd(true);
            } else {
                setResult(res.toFixed(4));
            }
        } else {
            setResult(null);
        }
    };
    
    const handleAdClose = () => {
        if (pendingResult !== null) {
            setResult(pendingResult.toFixed(4));
            setPendingResult(null);
        }
        setShowAd(false);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCalculate(e.target.value as CalculateType);
        setResult(null);
    }
    
    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div>
                <label htmlFor="calculate" className="block text-sm font-medium text-theme-secondary mb-1">Calculate</label>
                <select id="calculate" value={calculate} onChange={handleSelectChange} className={inputClasses}>
                    <option value="force">Force (F)</option>
                    <option value="mass">Mass (m)</option>
                    <option value="acceleration">Acceleration (a)</option>
                </select>
            </div>
            <div className="space-y-4">
                {calculate !== 'force' && <div><label className="text-sm font-medium text-theme-secondary mb-1">Force (Newtons)</label><input type="number" value={force} onChange={e => setForce(e.target.value)} className={inputClasses}/></div>}
                {calculate !== 'mass' && <div><label className="text-sm font-medium text-theme-secondary mb-1">Mass (kg)</label><input type="number" value={mass} onChange={e => setMass(e.target.value)} className={inputClasses}/></div>}
                {calculate !== 'acceleration' && <div><label className="text-sm font-medium text-theme-secondary mb-1">Acceleration (m/s²)</label><input type="number" value={acceleration} onChange={e => setAcceleration(e.target.value)} className={inputClasses}/></div>}
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            {result && (
                <div className="bg-theme-primary/50 p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-theme-secondary mb-2 capitalize">{calculate}</h3>
                    <p className="text-4xl font-bold text-primary">{result} <span className="text-2xl">{calculate === 'force' ? 'N' : calculate === 'mass' ? 'kg' : 'm/s²'}</span></p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default ForceAccelerationCalculator;