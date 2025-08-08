import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';
import { useAd } from '../contexts/AdContext';
import { useFuel } from '../contexts/FuelContext';
import InterstitialAdModal from './InterstitialAdModal';

type Shape = 'Sphere' | 'Cube' | 'Cylinder' | 'Cone';

interface VolumeCalculatorState {
    shape: Shape;
    inputs: {
        radius: string;
        side: string;
        height: string;
    };
}

interface VolumeCalculatorProps {
    initialState?: VolumeCalculatorState;
    isPremium?: boolean;
}

const VolumeCalculator: React.FC<VolumeCalculatorProps> = ({ initialState, isPremium }) => {
    const [shape, setShape] = useState<Shape>('Sphere');
    const [inputs, setInputs] = useState({
        radius: '5',
        side: '5',
        height: '10',
    });
    const [result, setResult] = useState<number | null>(null);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const { addHistory } = useContext(HistoryContext);

    const [pendingCalculation, setPendingCalculation] = useState<(() => void) | null>(null);
    const [showAd, setShowAd] = useState(false);
    const { shouldShowAd } = useAd();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;


    useEffect(() => {
        if (initialState) {
            setShape(initialState.shape || 'Sphere');
            setInputs(initialState.inputs || { radius: '5', side: '5', height: '10' });
            setResult(null);
        }
    }, [initialState]);

    const handleAdClose = () => {
        setShowAd(false);
        if (pendingCalculation) {
            pendingCalculation();
            setPendingCalculation(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setResult(null);
    };

    const calculateVolume = () => {
        const performCalculation = () => {
            const getNum = (val: string) => {
                const num = parseFloat(val);
                return isNaN(num) || num < 0 ? 0 : num;
            };

            const r = getNum(inputs.radius);
            const s = getNum(inputs.side);
            const h = getNum(inputs.height);

            let calculatedVolume = 0;
            let details = '';
            let shareDetails = '';
            
            switch (shape) {
                case 'Sphere':
                    calculatedVolume = (4 / 3) * Math.PI * Math.pow(r, 3);
                    details = `(r=${r})`;
                    shareDetails = `Shape: Sphere\nRadius: ${r}`;
                    break;
                case 'Cube':
                    calculatedVolume = Math.pow(s, 3);
                    details = `(side=${s})`;
                    shareDetails = `Shape: Cube\nSide Length: ${s}`;
                    break;
                case 'Cylinder':
                    calculatedVolume = Math.PI * Math.pow(r, 2) * h;
                    details = `(r=${r}, h=${h})`;
                    shareDetails = `Shape: Cylinder\nRadius: ${r}\nHeight: ${h}`;
                    break;
                case 'Cone':
                    calculatedVolume = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
                    details = `(r=${r}, h=${h})`;
                    shareDetails = `Shape: Cone\nRadius: ${r}\nHeight: ${h}`;
                    break;
            }
            
            const historyText = `Volume ${shape} ${details} = ${calculatedVolume.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
            addHistory({
                calculator: 'All Shapes Volume Calculator',
                calculation: historyText,
                inputs: { shape, inputs }
            });
            
            setShareText(`Volume Calculation:\n${shareDetails}\n\nResult:\nVolume = ${calculatedVolume.toLocaleString(undefined, { maximumFractionDigits: 4 })}`);
            setResult(calculatedVolume);
        };
        
        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            performCalculation();
        } else {
            if (shouldShowAd(isPremium)) {
                setPendingCalculation(() => performCalculation);
                setShowAd(true);
            } else {
                performCalculation();
            }
        }
    };
    
    const renderInputs = () => {
        switch (shape) {
            case 'Sphere':
                return (
                    <div>
                        <label htmlFor="radius" className="block text-sm font-medium text-on-surface-variant mb-2">Radius</label>
                        <input type="number" id="radius" name="radius" value={inputs.radius} onChange={handleInputChange} className="input-base w-full text-lg" />
                    </div>
                );
            case 'Cube':
                return (
                    <div>
                        <label htmlFor="side" className="block text-sm font-medium text-on-surface-variant mb-2">Side Length</label>
                        <input type="number" id="side" name="side" value={inputs.side} onChange={handleInputChange} className="input-base w-full text-lg" />
                    </div>
                );
            case 'Cylinder':
            case 'Cone':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="radius" className="block text-sm font-medium text-on-surface-variant mb-2">Radius</label>
                            <input type="number" id="radius" name="radius" value={inputs.radius} onChange={handleInputChange} className="input-base w-full text-lg" />
                        </div>
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-on-surface-variant mb-2">Height</label>
                            <input type="number" id="height" name="height" value={inputs.height} onChange={handleInputChange} className="input-base w-full text-lg" />
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
                    calculatorName={`Volume Calculator (${shape})`}
                    inputs={inputs}
                    result={{ volume: result }}
                />
            )}
            <div>
                <label htmlFor="shape" className="block text-sm font-medium text-on-surface-variant mb-2">Shape</label>
                <select id="shape" value={shape} onChange={(e) => { setShape(e.target.value as Shape); setResult(null); }} className="select-base w-full text-lg">
                    <option>Sphere</option>
                    <option>Cube</option>
                    <option>Cylinder</option>
                    <option>Cone</option>
                </select>
             </div>

            {renderInputs()}

            <button onClick={calculateVolume} className="btn-primary w-full font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg">
                Calculate Volume
            </button>
            
            {result !== null && (
                <div className="result-card p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-on-surface-variant mb-2">Volume</h3>
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

export default VolumeCalculator;