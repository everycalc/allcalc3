import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';

const InputField: React.FC<{ label: string; unit?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; }> = 
({ label, unit, value, onChange, name }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-on-surface-variant mb-1">
            {label} {unit && <span className="text-xs">({unit})</span>}
        </label>
        <input type="number" id={name} name={name} value={value} onChange={onChange} className="input-base w-full" />
    </div>
);

const ResultBox: React.FC<{ label: string; value: string; large?: boolean; highlight?: boolean }> = ({ label, value, large = false, highlight = false }) => (
    <div className={`result-card p-3 rounded-lg text-center ${large ? 'col-span-2' : ''}`}>
        <p className={`text-sm ${highlight ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</p>
        <p className={`font-bold ${large ? 'text-3xl' : 'text-xl'} ${highlight ? 'text-primary' : 'text-on-surface'}`}>{value}</p>
    </div>
);

const BreakdownBox: React.FC<{ title: string; revenue: string; cost: string; profitLoss: string; orders: string }> = ({ title, revenue, cost, profitLoss, orders }) => (
    <div className="result-card p-4 rounded-lg">
        <h3 className="text-lg font-bold text-primary text-center mb-2">{title}</h3>
        <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Orders:</span> <span className="font-semibold">{orders}</span></div>
            <div className="flex justify-between"><span>Revenue:</span> <span className="font-semibold">{revenue}</span></div>
            <div className="flex justify-between"><span>Cost:</span> <span className="font-semibold">{cost}</span></div>
            <div className="flex justify-between font-bold"><span>Profit/Loss:</span> <span>{profitLoss}</span></div>
        </div>
    </div>
);

interface RoasInputs {
    adSpend: string;
    aov: string;
    cogsPercent: string;
    shippingCost: string;
    prepaidSalesMix: string;
    prepaidDiscountPercent: string;
    prepaidPgPercent: string;
    codCharges: string;
    rtoPercent: string;
    rtoShippingCost: string;
}

interface BreakEvenROASCalculatorProps {
    initialState?: RoasInputs;
}

const BreakEvenROASCalculator: React.FC<BreakEvenROASCalculatorProps> = ({ initialState }) => {
    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency, currencySymbol } = useTheme();
    
    const [inputs, setInputs] = useState<RoasInputs>({
        adSpend: '3000',
        aov: '500',
        cogsPercent: '30',
        shippingCost: '100',
        prepaidSalesMix: '50',
        prepaidDiscountPercent: '8',
        prepaidPgPercent: '2',
        codCharges: '50',
        rtoPercent: '15',
        rtoShippingCost: '120',
    });
    const [results, setResults] = useState<any | null>(null);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

    useEffect(() => {
        if (initialState) {
            setInputs(initialState);
            setResults(null);
        }
    }, [initialState]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCalculate = () => {
        const adSpend = parseFloat(inputs.adSpend) || 0;
        const aov = parseFloat(inputs.aov) || 0;
        const cogsPercent = (parseFloat(inputs.cogsPercent) || 0) / 100;
        const shippingCost = parseFloat(inputs.shippingCost) || 0;
        const prepaidSalesMix = (parseFloat(inputs.prepaidSalesMix) || 0) / 100;
        const codSalesMix = 1 - prepaidSalesMix;
        const prepaidDiscountPercent = (parseFloat(inputs.prepaidDiscountPercent) || 0) / 100;
        const prepaidPgPercent = (parseFloat(inputs.prepaidPgPercent) || 0) / 100;
        const codCharges = parseFloat(inputs.codCharges) || 0;
        const rtoPercent = (parseFloat(inputs.rtoPercent) || 0) / 100;
        const rtoShippingCost = parseFloat(inputs.rtoShippingCost) || 0;

        // Calculate Net Profit Per Order (PPO) for each type, before ad spend
        const ppo_prepaid = 
            (aov * (1 - prepaidDiscountPercent)) * (1 - prepaidPgPercent) // Net Revenue
            - (aov * cogsPercent) // COGS Cost
            - shippingCost; // Shipping Cost

        const ppo_cod = 
            (aov * (1 - rtoPercent)) // Revenue from delivered orders
            - (aov * cogsPercent) // COGS for ALL shipped orders
            - shippingCost // Shipping cost for ALL shipped orders
            - (codCharges * (1 - rtoPercent)) // COD charges for delivered orders
            - (rtoShippingCost * rtoPercent); // RTO cost for returned orders

        const blendedPPO = (ppo_prepaid * prepaidSalesMix) + (ppo_cod * codSalesMix);
        const breakEvenROAS = blendedPPO > 0 ? aov / blendedPPO : Infinity;

        // Now calculate all metrics at the break-even ROAS
        const totalSales = adSpend * breakEvenROAS;
        const totalOrders = aov > 0 ? totalSales / aov : 0;
        
        const prepaidOrders = totalOrders * prepaidSalesMix;
        const prepaidGrossRevenue = prepaidOrders * aov;
        const prepaidDiscountValue = prepaidGrossRevenue * prepaidDiscountPercent;
        const prepaidNetBeforePg = prepaidGrossRevenue - prepaidDiscountValue;
        const prepaidPgFee = prepaidNetBeforePg * prepaidPgPercent;
        const prepaidFinalRevenue = prepaidNetBeforePg - prepaidPgFee;
        const prepaidCogs = prepaidGrossRevenue * cogsPercent;
        const prepaidShipping = prepaidOrders * shippingCost;
        const prepaidTotalCost = prepaidCogs + prepaidShipping + prepaidPgFee;
        const prepaidProfit = prepaidFinalRevenue - prepaidTotalCost;

        const codOrders = totalOrders * codSalesMix;
        const rtoOrders = codOrders * rtoPercent;
        const deliveredCodOrders = codOrders * (1-rtoPercent);
        const codGrossRevenueShipped = codOrders * aov;
        const codFinalRevenue = deliveredCodOrders * aov;
        const codCogs = codGrossRevenueShipped * cogsPercent;
        const codShipping = codOrders * shippingCost;
        const codChargesValue = deliveredCodOrders * codCharges;
        const rtoCostValue = rtoOrders * rtoShippingCost;
        const codTotalCost = codCogs + codShipping + codChargesValue + rtoCostValue;
        const codProfit = codFinalRevenue - codTotalCost;

        const overallTotalRevenue = prepaidFinalRevenue + codFinalRevenue;
        const overallTotalCost = adSpend + prepaidTotalCost + codTotalCost;
        const overallProfit = overallTotalRevenue - overallTotalCost;
        
        const calculatedResults = {
            breakEvenROAS,
            totalSales,
            totalOrders,
            prepaidOrders, prepaidFinalRevenue, prepaidTotalCost, prepaidProfit,
            codOrders, codFinalRevenue, codTotalCost, codProfit,
            overallTotalRevenue, overallTotalCost, overallProfit
        };

        setResults(calculatedResults);

        addHistory({
            calculator: 'Break-Even ROAS Calculator',
            calculation: `For AOV ${formatCurrency(parseFloat(inputs.aov))}, Break-Even ROAS is ${breakEvenROAS.toFixed(2)}`,
            inputs: inputs
        });
        
        setShareText(`Break-Even ROAS Calculation:\n- Ad Spend: ${formatCurrency(adSpend)}\n- AOV: ${formatCurrency(aov)}\n- COGS: ${inputs.cogsPercent}%\n- Prepaid Mix: ${inputs.prepaidSalesMix}%\n\nResult:\n- Break-Even ROAS: ${isFinite(breakEvenROAS) ? breakEvenROAS.toFixed(2) : 'N/A'}\n- Total Sales: ${formatCurrency(totalSales)}\n- Total Profit/Loss: ${formatCurrency(overallProfit)}`);
    };

    return (
        <div className="space-y-6">
             {isExplainModalOpen && results && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Break-Even ROAS Calculator"
                    inputs={inputs}
                    result={results}
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* INPUTS PANEL */}
                <div className="bg-surface-container p-4 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold text-center">Inputs</h2>
                    <InputField label="Ad Spend" name="adSpend" unit={currencySymbol} value={inputs.adSpend} onChange={handleInputChange} />
                    <InputField label="Average Order Value" name="aov" unit={currencySymbol} value={inputs.aov} onChange={handleInputChange} />
                    <InputField label="Cost of Goods Sold (COGS)" name="cogsPercent" unit="%" value={inputs.cogsPercent} onChange={handleInputChange} />
                    <InputField label="Shipping Cost" name="shippingCost" unit={`${currencySymbol} per order`} value={inputs.shippingCost} onChange={handleInputChange} />
                    <InputField label="Prepaid Sales Mix" name="prepaidSalesMix" unit="%" value={inputs.prepaidSalesMix} onChange={handleInputChange} />
                    <InputField label="Prepaid Discount" name="prepaidDiscountPercent" unit="%" value={inputs.prepaidDiscountPercent} onChange={handleInputChange} />
                    <InputField label="Prepaid Payment Gateway Fee" name="prepaidPgPercent" unit="%" value={inputs.prepaidPgPercent} onChange={handleInputChange} />
                    <InputField label="COD Charges" name="codCharges" unit={`${currencySymbol} per order`} value={inputs.codCharges} onChange={handleInputChange} />
                    <InputField label="COD Return To Origin (RTO) Rate" name="rtoPercent" unit="%" value={inputs.rtoPercent} onChange={handleInputChange} />
                    <InputField label="COD RTO Shipping Cost" name="rtoShippingCost" unit={`${currencySymbol} per return`} value={inputs.rtoShippingCost} onChange={handleInputChange} />
                    <button onClick={handleCalculate} className="btn-primary w-full mt-4 text-lg font-bold py-3 px-4 rounded-md shadow-lg">
                        View Results
                    </button>
                </div>

                {/* RESULTS PANEL */}
                {results && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="result-card p-4 rounded-lg text-center">
                            <h2 className="text-lg font-bold text-on-surface">Break-Even ROAS</h2>
                            <p className="text-5xl font-extrabold text-primary my-2">{isFinite(results.breakEvenROAS) ? results.breakEvenROAS.toFixed(2) : 'N/A'}</p>
                            <p className="text-xs text-on-surface-variant">The ROAS required to have zero profit/loss.</p>
                             <button onClick={() => setIsExplainModalOpen(true)} className="mt-2 inline-flex items-center text-xs font-semibold text-primary hover:underline">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                What does this mean?
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BreakdownBox title="Prepaid" orders={results.prepaidOrders.toFixed(2)} revenue={formatCurrency(results.prepaidFinalRevenue)} cost={formatCurrency(results.prepaidTotalCost)} profitLoss={formatCurrency(results.prepaidProfit)} />
                            <BreakdownBox title="COD" orders={results.codOrders.toFixed(2)} revenue={formatCurrency(results.codFinalRevenue)} cost={formatCurrency(results.codTotalCost)} profitLoss={formatCurrency(results.codProfit)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <ResultBox label="Total Sales" value={formatCurrency(results.totalSales)} large />
                            <ResultBox label="Total No. of Orders" value={results.totalOrders.toFixed(2)} large />
                            <ResultBox label="Total Cost" value={formatCurrency(results.overallTotalCost)} />
                            <ResultBox label="Total Revenue" value={formatCurrency(results.overallTotalRevenue)} />
                            <ResultBox label="Profit / Loss" value={formatCurrency(results.overallProfit)} large highlight />
                        </div>
                         <div className="flex justify-end items-center mt-4 pt-4 border-t border-outline-variant">
                            <ShareButton textToShare={shareText} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BreakEvenROASCalculator;