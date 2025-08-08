import React, { useState, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import { useFuel } from '../contexts/FuelContext';

interface Result {
    totalFuel: number;
    totalCost: number;
}

const FuelCostCalculator: React.FC<{initialState?: any; isPremium?: boolean}> = ({initialState, isPremium}) => {
    const [distance, setDistance] = useState('400');
    const [mileage, setMileage] = useState('15');
    const [fuelPrice, setFuelPrice] = useState('100');
    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;

    useEffect(() => {
        if (initialState) {
            setDistance(initialState.distance || '400');
            setMileage(initialState.mileage || '15');
            setFuelPrice(initialState.fuelPrice || '100');
            setResult(null);
        }
    }, [initialState]);

    const handleCalculate = () => {
        const performCalculation = () => {
            const dist = parseFloat(distance);
            const mil = parseFloat(mileage);
            const price = parseFloat(fuelPrice);

            if (isNaN(dist) || isNaN(mil) || isNaN(price) || mil <= 0) {
                return null;
            }

            const totalFuel = dist / mil;
            const totalCost = totalFuel * price;
            
            const calculatedResult = { totalFuel, totalCost };
            
            addHistory({ calculator: 'Fuel Cost Calculator', calculation: `Trip of ${dist}km -> ${formatCurrency(totalCost)}`, inputs: { distance, mileage, fuelPrice } });
            
            setShareText(`Fuel Cost Calculation:\n- Distance: ${dist} km\n- Mileage: ${mil} km per L\n- Fuel Price: ${formatCurrency(price)}/L\n\nResult:\n- Total Fuel: ${totalFuel.toFixed(2)} L\n- Total Cost: ${formatCurrency(totalCost)}`);
            
            return calculatedResult;
        };

        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            const res = performCalculation();
            if (res) setResult(res);
        } else {
            const res = performCalculation();
            if (res) {
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
        if (pendingResult) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <label className="text-sm font-medium text-on-surface-variant">Trip Distance (km)</label>
                        <InfoTooltip text="The total distance of your trip in kilometers." />
                    </div>
                    <input type="number" value={distance} onChange={e => setDistance(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                     <div className="flex items-center space-x-2 mb-1">
                        <label className="text-sm font-medium text-on-surface-variant">Vehicle Mileage (km per L)</label>
                        <InfoTooltip text="Your vehicle's fuel efficiency in kilometers per litre." />
                    </div>
                    <input type="number" value={mileage} onChange={e => setMileage(e.target.value)} className="input-base w-full"/>
                </div>
                <div>
                    <label className="text-sm font-medium text-on-surface-variant mb-1">Fuel Price ({currencySymbol} per Litre)</label>
                    <input type="number" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} className="input-base w-full"/>
                </div>
            </div>
            <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg">
                Calculate Fuel Cost
            </button>
            {result && (
                <div className="result-card p-6 rounded-lg space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface text-center mb-4">Trip Estimate</h3>
                    <div className="flex justify-between items-center text-center">
                        <div className="w-1/2">
                            <span className="text-on-surface-variant block">Total Fuel Required</span>
                            <span className="text-3xl font-bold text-primary">{result.totalFuel.toFixed(2)} L</span>
                        </div>
                        <div className="w-1/2 border-l border-outline-variant">
                             <span className="text-on-surface-variant block">Total Fuel Cost</span>
                            <span className="text-3xl font-bold text-primary">{formatCurrency(result.totalCost)}</span>
                        </div>
                    </div>
                     <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default FuelCostCalculator;