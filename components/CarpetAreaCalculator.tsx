
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';

type Mode = 'builtUpToCarpet' | 'carpetToBuiltUp';

interface Result {
    carpetArea: number;
    builtUpArea: number;
    otherArea: number;
}

interface CarpetAreaCalculatorState {
    mode: Mode;
    area: string;
    nonCarpetPercent: string;
}

const CarpetAreaCalculator: React.FC<{initialState?: CarpetAreaCalculatorState, isPremium?: boolean}> = ({initialState, isPremium}) => {
    const [mode, setMode] = useState<Mode>('builtUpToCarpet');
    const [area, setArea] = useState('1200');
    const [nonCarpetPercent, setNonCarpetPercent] = useState('20');
    const [result, setResult] = useState<Result | null>(null);
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();

    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');

    useEffect(() => {
        if (initialState) {
            setMode(initialState.mode || 'builtUpToCarpet');
            setArea(initialState.area || '1200');
            setNonCarpetPercent(initialState.nonCarpetPercent || '20');
            setResult(null);
        }
    }, [initialState]);
    
    const handleCalculate = () => {
        const areaInput = parseFloat(area);
        const percent = parseFloat(nonCarpetPercent) / 100;

        if (isNaN(areaInput) || isNaN(percent) || areaInput <= 0) {
            setResult(null);
            return;
        }

        let calculatedResult: Result;

        if (mode === 'builtUpToCarpet') {
            const builtUpArea = areaInput;
            const otherArea = builtUpArea * percent;
            const carpetArea = builtUpArea - otherArea;
            calculatedResult = { builtUpArea, carpetArea, otherArea };
        } else { // carpetToBuiltUp
            const carpetArea = areaInput;
            const builtUpArea = carpetArea / (1 - percent);
            const otherArea = builtUpArea - carpetArea;
            calculatedResult = { builtUpArea, carpetArea, otherArea };
        }

        addHistory({
            calculator: 'Carpet Area vs Built-up Area',
            calculation: `Carpet: ${calculatedResult.carpetArea.toFixed(2)} sq.unit, Built-up: ${calculatedResult.builtUpArea.toFixed(2)} sq.unit`,
            inputs: { mode, area, nonCarpetPercent }
        });

        setShareText(`Carpet Area Calculation:\n- Input: ${areaInput.toFixed(2)} ${mode === 'builtUpToCarpet' ? 'Built-up Area' : 'Carpet Area'}\n- Result:\n- Carpet Area: ${calculatedResult.carpetArea.toFixed(2)} sq.unit\n- Built-up Area: ${calculatedResult.builtUpArea.toFixed(2)} sq.unit`);
        
        if (shouldShowAd(isPremium)) {
            setPendingResult(calculatedResult);
            setShowAd(true);
        } else {
            setResult(calculatedResult);
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
        if (result) {
            setArea(newMode === 'builtUpToCarpet' ? result.builtUpArea.toFixed(2) : result.carpetArea.toFixed(2));
        }
    };
    
    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
             {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Carpet Area vs Built-up Area"
                    inputs={{ mode, area, nonCarpetPercent }}
                    result={result}
                />
            )}

            <div className="flex justify-center bg-theme-primary p-1 rounded-lg">
                <button onClick={() => handleModeChange('builtUpToCarpet')} className={`w-1/2 py-2 rounded-md transition text-sm ${mode === 'builtUpToCarpet' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Built-up to Carpet</button>
                <button onClick={() => handleModeChange('carpetToBuiltUp')} className={`w-1/2 py-2 rounded-md transition text-sm ${mode === 'carpetToBuiltUp' ? 'bg-primary text-on-primary' : 'hover:bg-theme-tertiary'}`}>Carpet to Built-up</button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">
                        {mode === 'builtUpToCarpet' ? 'Built-up Area' : 'Carpet Area'} (sq. ft / sq. m)
                    </label>
                    <input type="number" value={area} onChange={e => setArea(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label className="text-sm font-medium text-theme-secondary">Wall & Other Area Percentage (%)</label>
                        <InfoTooltip text="The percentage of the built-up area occupied by walls, balconies, etc. Typically 15-25%." />
                    </div>
                    <input type="number" value={nonCarpetPercent} onChange={e => setNonCarpetPercent(e.target.value)} className={inputClasses}/>
                </div>
            </div>

            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Calculate
            </button>
            
            {result && (
                <div className="bg-theme-secondary p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-theme-primary text-center mb-4">Area Breakdown</h3>
                    <div className="py-4">
                      <PieChart data={[
                          { label: 'Carpet Area', value: result.carpetArea, color: '#3b82f6' },
                          { label: 'Other Area', value: result.otherArea, color: '#ef4444' }
                      ]} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Carpet Area:</span>
                        <span className="text-lg font-medium text-theme-primary">{result.carpetArea.toFixed(2)} sq. unit</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Built-up Area:</span>
                        <span className="text-2xl font-bold text-primary">{result.builtUpArea.toFixed(2)} sq. unit</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme">
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

export default CarpetAreaCalculator;
