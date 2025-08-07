import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';
import { useFuel } from '../contexts/FuelContext';

const InputField: React.FC<{ label: string; unit?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; tooltip?: string; }> = 
({ label, unit, value, onChange, name, tooltip }) => (
    <div>
        <div className="flex items-center space-x-2 mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-theme-secondary">
                {label} {unit && <span className="text-xs">({unit})</span>}
            </label>
            {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <input type="number" id={name} name={name} value={value} onChange={onChange} className="w-full bg-theme-primary text-theme-primary border-theme rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition" />
    </div>
);

const ResultBox: React.FC<{ label: string; value: string; subtext?: string; highlight?: boolean }> = ({ label, value, subtext, highlight }) => (
    <div className={`bg-theme-primary p-4 rounded-lg text-center`}>
        <p className={`text-sm ${highlight ? 'text-primary' : 'text-theme-secondary'}`}>{label}</p>
        <p className={`font-bold text-3xl ${highlight ? 'text-primary' : 'text-theme-primary'}`}>{value}</p>
        {subtext && <p className="text-xs text-theme-secondary mt-1">{subtext}</p>}
    </div>
);

interface Result {
    clv: number;
    cac: number;
    ratio: number;
}

interface ClvCacInputs {
    aov: string;
    purchaseFrequency: string;
    grossMargin: string;
    customerLifetime: string;
    marketingSpend: string;
    newCustomers: string;
}

interface CLVCACCalculatorProps {
    isPremium?: boolean;
    initialState?: ClvCacInputs;
}

const CLVCACCalculator: React.FC<CLVCACCalculatorProps> = ({ isPremium, initialState }) => {
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;
    
    const [inputs, setInputs] = useState<ClvCacInputs>({
        aov: '150',
        purchaseFrequency: '4',
        grossMargin: '60',
        customerLifetime: '3',
        marketingSpend: '50000',
        newCustomers: '1000'
    });
    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

    useEffect(() => {
        if (initialState) {
            setInputs(initialState);
            setResult(null);
        }
    }, [initialState]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCalculate = () => {
        const performCalculation = () => {
            const aov = parseFloat(inputs.aov) || 0;
            const purchaseFrequency = parseFloat(inputs.purchaseFrequency) || 0;
            const grossMargin = (parseFloat(inputs.grossMargin) || 0) / 100;
            const customerLifetime = parseFloat(inputs.customerLifetime) || 0;
            const marketingSpend = parseFloat(inputs.marketingSpend) || 0;
            const newCustomers = parseFloat(inputs.newCustomers) || 0;
            
            const customerValuePerYear = aov * purchaseFrequency;
            const clv = (customerValuePerYear * grossMargin) * customerLifetime;
            const cac = newCustomers > 0 ? marketingSpend / newCustomers : 0;
            const ratio = cac > 0 ? clv / cac : 0;
            
            const calculatedResult = { clv, cac, ratio };

            addHistory({
                calculator: 'CLV & CAC Calculator',
                calculation: `CLV: ${formatCurrency(clv)}, CAC: ${formatCurrency(cac)} (Ratio: ${ratio.toFixed(2)})`,
                inputs: inputs
            });
            
            setShareText(`CLV & CAC Calculation:\n- AOV: ${formatCurrency(aov)}\n- Purchase Frequency: ${purchaseFrequency}/yr\n- Gross Margin: ${inputs.grossMargin}%\n- Lifetime: ${customerLifetime} yrs\n- Marketing Spend: ${formatCurrency(marketingSpend)}\n- New Customers: ${newCustomers}\n\nResults:\n- CLV: ${formatCurrency(clv)}\n- CAC: ${formatCurrency(cac)}\n- CLV:CAC Ratio: ${ratio.toFixed(2)} : 1`);
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
            {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="CLV & CAC Calculator"
                    inputs={inputs}
                    result={result}
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* INPUTS PANEL */}
                <div className="bg-theme-secondary p-4 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold text-center mb-2">Inputs</h2>
                    <h3 className="font-semibold text-primary">Customer Lifetime Value (CLV)</h3>
                    <InputField label="Average Order Value" name="aov" unit={currencySymbol} value={inputs.aov} onChange={handleInputChange} tooltip="The average amount a customer spends per order." />
                    <InputField label="Purchase Frequency" name="purchaseFrequency" unit="per year" value={inputs.purchaseFrequency} onChange={handleInputChange} tooltip="How many times a customer makes a purchase in a year." />
                    <InputField label="Gross Margin" name="grossMargin" unit="%" value={inputs.grossMargin} onChange={handleInputChange} tooltip="The percentage of revenue left after subtracting the Cost of Goods Sold (COGS)." />
                    <InputField label="Customer Lifetime" name="customerLifetime" unit="years" value={inputs.customerLifetime} onChange={handleInputChange} tooltip="The average number of years a person remains a customer." />
                    
                    <h3 className="font-semibold text-primary pt-4 border-t border-theme">Customer Acquisition Cost (CAC)</h3>
                    <InputField label="Total Marketing Spend" name="marketingSpend" unit={currencySymbol} value={inputs.marketingSpend} onChange={handleInputChange} tooltip="Total amount spent on sales and marketing to acquire new customers." />
                    <InputField label="New Customers Acquired" name="newCustomers" unit="count" value={inputs.newCustomers} onChange={handleInputChange} tooltip="The number of new customers acquired during the period of the marketing spend." />
                </div>

                {/* RESULTS PANEL */}
                <div className="space-y-4">
                    <div className="bg-theme-secondary p-4 rounded-lg text-center space-y-4">
                        <button onClick={handleCalculate} className="w-full bg-primary text-on-primary text-lg font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                            Calculate
                        </button>
                        {result && (
                            <div className="space-y-4 mt-4 animate-fade-in">
                                <h2 className="text-xl font-bold text-center">Results</h2>
                                <ResultBox label="Customer Lifetime Value (CLV)" value={formatCurrency(result.clv)} subtext="The total profit you expect from a customer." />
                                <ResultBox label="Customer Acquisition Cost (CAC)" value={formatCurrency(result.cac)} subtext="How much it costs to get a new customer." />
                                <ResultBox label="CLV to CAC Ratio" value={`${result.ratio.toFixed(2)} : 1`} subtext="A ratio of 3:1 or higher is generally considered good." highlight />
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme-tertiary">
                                     <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                       Explain
                                    </button>
                                    <ShareButton textToShare={shareText} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CLVCACCalculator;