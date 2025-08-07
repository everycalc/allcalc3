import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';
import { useFuel } from '../contexts/FuelContext';

type Shape = 'Circle' | 'Square' | 'Rectangle' | 'Triangle';

interface AreaCalculatorState {
    shape: Shape;
    inputs: {
        radius: string;
        side: string;
        length: string;
        width: string;
        base: string;
        height: string;
    };
}

interface AreaCalculatorProps {
    isPremium?: boolean;
    initialState?: AreaCalculatorState;
}

const AreaCalculator: React.FC<AreaCalculatorProps> = ({ isPremium, initialState }) => {
    const [shape, setShape] = useState<Shape>('Circle');
    const [inputs, setInputs] = useState({
        radius: '10',
        side: '10',
        length: '10',
        width: '8',
        base: '10',
        height: '5',
    });
    const [result, setResult] = useState<number | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;

    useEffect(() => {
        if (initialState) {
            setShape(initialState.shape || 'Circle');
            setInputs(initialState.inputs || { radius: '10', side: '10', length: '10', width: '8', base: '10', height: '5' });
            setResult(null);
        }
    }, [initialState]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setResult(null); // Clear previous result on input change
    };

    const calculateArea = () => {
        const performCalculation = () => {
            const getNum = (val: string) => {
                const num = parseFloat(val);
                return isNaN(num) || num < 0 ? 0 : num;
            };

            let calculatedArea = 0;
            let details = '';
            let shareDetails = '';
            
            switch (shape) {
                case 'Circle':
                    const radius = getNum(inputs.radius);
                    calculatedArea = Math.PI * Math.pow(radius, 2);
                    details = `(r=${radius})`;
                    shareDetails = `Shape: Circle\nRadius: ${radius}`;
                    break;
                case 'Square':
                    const side = getNum(inputs.side);
                    calculatedArea = Math.pow(side, 2);
                    details = `(side=${side})`;
                    shareDetails = `Shape: Square\nSide: ${side}`;
                    break;
                case 'Rectangle':
                    const length = getNum(inputs.length);
                    const width = getNum(inputs.width);
                    calculatedArea = length * width;
                    details = `(l=${length}, w=${width})`;
                    shareDetails = `Shape: Rectangle\nLength: ${length}\nWidth: ${width}`;
                    break;
                case 'Triangle':
                    const base = getNum(inputs.base);
                    const height = getNum(inputs.height);
                    calculatedArea = 0.5 * base * height;
                    details = `(b=${base}, h=${height})`;
                    shareDetails = `Shape: Triangle\nBase: ${base}\nHeight: ${height}`;
                    break;
            }

            const historyText = `Area ${shape} ${details} = ${calculatedArea.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
            addHistory({
                calculator: 'All Shapes Area Calculator',
                calculation: historyText,
                inputs: { shape, inputs }
            });
            
            setShareText(`Area Calculation:\n${shareDetails}\n\nResult:\nArea = ${calculatedArea.toLocaleString(undefined, { maximumFractionDigits: 4 })}`);
            return calculatedArea;
        };

        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            const res = performCalculation();
            if (res !== null) setResult(res);
        } else {
            const res = performCalculation();
            if (res !== null) {
                if (shouldShowAd(isPremium)) {
                    setPendingResult(res);
                    setShowAd(true);
                } else {
                    setResult(res);
                }
            }
        }
    };
    
    const handleAdClose = () => {
        if (pendingResult !== null) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };

    const commonInputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition text-lg";

    const renderInputs = () => {
        // ... (input rendering logic remains the same)
        switch (shape) {
            case 'Circle':
                return (
                    <div>
                        <label htmlFor="radius" className="block text-sm font-medium text-theme-secondary mb-2">Radius</label>
                        <input type="number" id="radius" name="radius" value={inputs.radius} onChange={handleInputChange} className={commonInputClasses} />
                    </div>
                );
            case 'Square':
                 return (
                    <div>
                        <label htmlFor="side" className="block text-sm font-medium text-theme-secondary mb-2">Side</label>
                        <input type="number" id="side" name="side" value={inputs.side} onChange={handleInputChange} className={commonInputClasses} />
                    </div>
                );
            case 'Rectangle':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="length" className="block text-sm font-medium text-theme-secondary mb-2">Length</label>
                            <input type="number" id="length" name="length" value={inputs.length} onChange={handleInputChange} className={commonInputClasses} />
                        </div>
                        <div>
                            <label htmlFor="width" className="block text-sm font-medium text-theme-secondary mb-2">Width</label>
                            <input type="number" id="width" name="width" value={inputs.width} onChange={handleInputChange} className={commonInputClasses} />
                        </div>
                    </div>
                );
            case 'Triangle':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="base" className="block text-sm font-medium text-theme-secondary mb-2">Base</label>
                            <input type="number" id="base" name="base" value={inputs.base} onChange={handleInputChange} className={commonInputClasses} />
                        </div>
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-theme-secondary mb-2">Height</label>
                            <input type="number" id="height" name="height" value={inputs.height} onChange={handleInputChange} className={commonInputClasses} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            {isExplainModalOpen && result !== null && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName={`Area Calculator (${shape})`}
                    inputs={inputs}
                    result={{ area: result }}
                />
            )}
             <div>
                <label htmlFor="shape" className="block text-sm font-medium text-theme-secondary mb-2">Shape</label>
                <select id="shape" value={shape} onChange={(e) => { setShape(e.target.value as Shape); setResult(null); }} className={commonInputClasses}>
                    <option>Circle</option>
                    <option>Square</option>
                    <option>Rectangle</option>
                    <option>Triangle</option>
                </select>
             </div>
            
            {renderInputs()}

            <button onClick={calculateArea} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate Area
            </button>
            
            {result !== null && (
                 <div className="bg-theme-primary/50 p-6 rounded-lg text-center animate-fade-in">
                     <h3 className="text-lg font-semibold text-theme-secondary mb-2">Area</h3>
                     <p className="text-4xl font-bold text-primary">{result.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                     <div className="flex justify-between items-center mt-4">
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

export default AreaCalculator;