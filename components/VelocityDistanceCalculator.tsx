import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

type CalculateType = 'speed' | 'distance' | 'time';

const VelocityDistanceCalculator: React.FC<{initialState?: any; isPremium?: boolean}> = ({initialState, isPremium}) => {
    const [calculate, setCalculate] = useState<CalculateType>('speed');
    const [speed, setSpeed] = useState('60');
    const [distance, setDistance] = useState('120');
    const [time, setTime] = useState('2');
    const [result, setResult] = useState<string | null>(null);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);

    useEffect(() => {
        if (initialState) {
            setCalculate(initialState.calculate || 'speed');
            setSpeed(initialState.speed || '60');
            setDistance(initialState.distance || '120');
            setTime(initialState.time || '2');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const s = parseFloat(speed);
        const d = parseFloat(distance);
        const t = parseFloat(time);
        let res: number | null = null;
        let historyCalc = '';

        switch (calculate) {
            case 'speed': if (!isNaN(d) && !isNaN(t) && t !== 0) { res = d / t; historyCalc = `Speed = ${d}km / ${t}h = ${res.toFixed(2)} km per hour`; } break;
            case 'distance': if (!isNaN(s) && !isNaN(t)) { res = s * t; historyCalc = `Distance = ${s} km per hour * ${t}h = ${res.toFixed(2)} km`; } break;
            case 'time': if (!isNaN(d) && !isNaN(s) && s !== 0) { res = d / s; historyCalc = `Time = ${d}km / ${s} km per hour = ${res.toFixed(2)} hours`; } break;
        }

        if (res !== null) {
            addHistory({ calculator: 'Velocity & Distance', calculation: historyCalc, inputs: { calculate, speed, distance, time } });
            setShareText(`Speed, Distance, Time Calculation:\n${historyCalc}`);
            setResult(res.toFixed(4));
        } else {
            setResult(null);
        }
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCalculate(e.target.value as CalculateType);
        setResult(null);
    }
    
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Calculate</label>
                <select value={calculate} onChange={handleSelectChange} className="select-base w-full">
                    <option value="speed">Speed</option>
                    <option value="distance">Distance</option>
                    <option value="time">Time</option>
                </select>
            </div>
            <div className="space-y-4">
                {calculate !== 'speed' && <div><label className="text-sm font-medium text-on-surface-variant mb-1">Speed (km per hour)</label><input type="number" value={speed} onChange={e => setSpeed(e.target.value)} className="input-base w-full"/></div>}
                {calculate !== 'distance' && <div><label className="text-sm font-medium text-on-surface-variant mb-1">Distance (km)</label><input type="number" value={distance} onChange={e => setDistance(e.target.value)} className="input-base w-full"/></div>}
                {calculate !== 'time' && <div><label className="text-sm font-medium text-on-surface-variant mb-1">Time (hours)</label><input type="number" value={time} onChange={e => setTime(e.target.value)} className="input-base w-full"/></div>}
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg">
                Calculate
            </button>
            {result && (
                <div className="result-card p-6 text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-on-surface-variant mb-2 capitalize">{calculate}</h3>
                    <p className="text-4xl font-bold text-primary">{result} <span className="text-2xl">{calculate === 'speed' ? 'km/h' : calculate === 'distance' ? 'km' : 'hours'}</span></p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default VelocityDistanceCalculator;
