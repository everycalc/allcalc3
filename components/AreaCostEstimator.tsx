
import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';

type AreaUnit = 'sqft' | 'sqm';

interface AreaCostEstimatorState {
    area: string;
    unit: AreaUnit;
    costPerUnit: string;
}

interface AreaCostEstimatorProps {
    initialState?: AreaCostEstimatorState;
}

const AreaCostEstimator: React.FC<AreaCostEstimatorProps> = ({initialState}) => {
    const [area, setArea] = useState('1200');
    const [unit, setUnit] = useState<AreaUnit>('sqft');
    const [costPerUnit, setCostPerUnit] = useState('1500');
    const [result, setResult] = useState<number | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setArea(initialState.area || '1200');
            setUnit(initialState.unit || 'sqft');
            setCostPerUnit(initialState.costPerUnit || '1500');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const totalArea = parseFloat(area);
        const cost = parseFloat(costPerUnit);

        if (isNaN(totalArea) || isNaN(cost) || totalArea <= 0 || cost <= 0) {
            setResult(null);
            return;
        }
        
        const totalCost = totalArea * cost;
        addHistory({
            calculator: 'Area Cost Estimator',
            calculation: `${totalArea} ${unit} @ ${formatCurrency(cost)} per ${unit} = ${formatCurrency(totalCost)}`,
            inputs: { area, unit, costPerUnit }
        });
        
        setShareText(`Area Cost Estimation:\n- Total Area: ${totalArea} ${unit}\n- Cost per ${unit}: ${formatCurrency(cost)}\n\nResult:\n- Total Estimated Cost: ${formatCurrency(totalCost)}`);

        if (shouldShowAd()) {
            setPendingResult(totalCost);
            setShowAd(true);
        } else {
            setResult(totalCost);
        }
    };
    
    const handleAdClose = () => {
        if (pendingResult !== null) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };

    const inputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-theme-secondary mb-1">Total Area</label>
                        <input type="number" id="area" value={area} onChange={e => setArea(e.target.value)} className={inputClasses}/>
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-theme-secondary mb-1">Unit</label>
                        <select id="unit" value={unit} onChange={e => setUnit(e.target.value as AreaUnit)} className={inputClasses}>
                            <option value="sqft">Square Feet</option>
                            <option value="sqm">Square Meters</option>
                        </select>
                    </div>
                </div>
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="costPerUnit" className="block text-sm font-medium text-theme-secondary">Cost per {unit} ({currencySymbol})</label>
                        <InfoTooltip text="The estimated cost for construction or materials for one square foot or square meter." />
                    </div>
                    <input type="number" id="costPerUnit" value={costPerUnit} onChange={e => setCostPerUnit(e.target.value)} className={inputClasses}/>
                </div>
            </div>
            <button onClick={handleCalculate} className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                Estimate Cost
            </button>
            {result !== null && (
                <div className="bg-theme-primary/50 p-6 rounded-lg text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-theme-secondary mb-2">Total Estimated Cost</h3>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(result)}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default AreaCostEstimator;