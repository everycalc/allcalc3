import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';

interface BMICalculatorState {
    unit: 'metric' | 'imperial';
    weight: string;
    height: string;
}

interface BMICalculatorProps {
    initialState?: BMICalculatorState;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ initialState }) => {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
    const [weight, setWeight] = useState(unit === 'metric' ? '70' : '154');
    const [height, setHeight] = useState(unit === 'metric' ? '175' : '69');
    const [result, setResult] = useState<{ bmi: number, category: string } | null>(null);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);

    useEffect(() => {
        if (initialState) {
            const initialUnit = initialState.unit || 'metric';
            setUnit(initialUnit);
            setWeight(initialState.weight || (initialUnit === 'metric' ? '70' : '154'));
            setHeight(initialState.height || (initialUnit === 'metric' ? '175' : '69'));
            setResult(null);
        }
    }, [initialState]);
    
    const handleInputChange = () => {
        setResult(null);
    }

    const calculateBmi = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);

        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
            setResult(null);
            return;
        }

        let bmiValue = 0;
        if (unit === 'metric') { // weight in kg, height in cm
            bmiValue = w / Math.pow(h / 100, 2);
        } else { // weight in lbs, height in inches
            bmiValue = (w / Math.pow(h, 2)) * 703;
        }

        let bmiCategory = 'N/A';
        if (bmiValue < 18.5) bmiCategory = 'Underweight';
        else if (bmiValue < 25) bmiCategory = 'Normal weight';
        else if (bmiValue < 30) bmiCategory = 'Overweight';
        else bmiCategory = 'Obesity';

        const calculatedResult = { bmi: bmiValue, category: bmiCategory };
        setResult(calculatedResult);

        addHistory({
            calculator: 'BMI Calculator',
            calculation: `BMI: ${bmiValue.toFixed(1)} (${bmiCategory})`,
            inputs: { unit, weight, height }
        });
        
        setShareText(`BMI Calculation:\n- Weight: ${w} ${unit === 'metric' ? 'kg' : 'lbs'}\n- Height: ${h} ${unit === 'metric' ? 'cm' : 'in'}\n\nResult:\n- BMI: ${bmiValue.toFixed(1)}\n- Category: ${bmiCategory}`);
    };

    const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
        setUnit(newUnit);
        if (newUnit === 'metric') {
            setWeight('70');
            setHeight('175');
        } else {
            setWeight('154');
            setHeight('69');
        }
        setResult(null);
    };
    
    return (
        <div className="space-y-6">
            {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="BMI Calculator"
                    inputs={{ unit, weight, height }}
                    result={result}
                />
            )}
            <div className="toggle-group flex justify-center p-1 rounded-lg">
                <button onClick={() => handleUnitChange('metric')} className={`toggle-button w-1/2 py-2 rounded-md transition ${unit === 'metric' ? 'toggle-button-active' : ''}`}>Metric</button>
                <button onClick={() => handleUnitChange('imperial')} className={`toggle-button w-1/2 py-2 rounded-md transition ${unit === 'imperial' ? 'toggle-button-active' : ''}`}>Imperial</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-on-surface-variant mb-2">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
                    <input type="number" id="weight" value={weight} onChange={(e) => {setWeight(e.target.value); handleInputChange();}} className="input-base w-full text-lg" />
                </div>
                <div>
                    <label htmlFor="height" className="block text-sm font-medium text-on-surface-variant mb-2">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
                    <input type="number" id="height" value={height} onChange={(e) => {setHeight(e.target.value); handleInputChange();}} className="input-base w-full text-lg" />
                </div>
            </div>
             
             <button onClick={calculateBmi} className="btn-primary w-full font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg">
                Calculate BMI
            </button>

             {result && result.bmi > 0 && (
                <div className="result-card p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-on-surface-variant mb-2">Your BMI</h3>
                    <p className="text-4xl font-bold text-primary">{result.bmi.toFixed(1)}</p>
                    <p className="text-xl text-on-surface mt-2">{result.category}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant">
                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                           Explain
                        </button>
                        <ShareButton textToShare={shareText} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;
