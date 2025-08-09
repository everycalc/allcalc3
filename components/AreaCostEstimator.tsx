import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
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
    isPremium?: boolean;
}

const AreaCostEstimator: React.FC<AreaCostEstimatorProps> = ({initialState, isPremium}) => {
    const [area, setArea] = useState('1200');
    const [unit, setUnit] = useState<AreaUnit>('sqft');
    const [costPerUnit, setCostPerUnit] = useState('1500');
    const [result, setResult] = useState<number | null>(null);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
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
        setResult(totalCost);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-on-surface-variant mb-1">Total Area</label>
                        <input type="number" id="area" value={area} onChange={e => setArea(e.target.value)} className="input-base w-full"/>
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-on-surface-variant mb-1">Unit</label>
                        <select id="unit" value={unit} onChange={e => setUnit(e.target.value as AreaUnit)} className="select-base w-full">
                            <option value="sqft">Square Feet</option>
                            <option value="sqm">Square Meters</option>
                        </select>
                    </div>
                </div>
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label htmlFor="costPerUnit" className="block text-sm font-medium text-on-surface-variant">Cost per {unit} ({currencySymbol})</label>
                        <InfoTooltip text="The estimated cost for construction or materials for one square foot or square meter." />
                    </div>
                    <input type="number" id="costPerUnit" value={costPerUnit} onChange={e => setCostPerUnit(e.target.value)} className="input-base w-full"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md shadow-lg">
                Estimate Cost
            </button>
            {result !== null && (
                <div className="result-card p-6 text-center animate-fade-in">
                    <h3 className="text-lg font-semibold text-on-surface-variant mb-2">Total Estimated Cost</h3>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(result)}</p>
                    <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default AreaCostEstimator;
