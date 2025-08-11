


import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';
import { GoogleGenAI, Type } from '@google/genai';

const InputField: React.FC<{ name: string, label: string, value: string | boolean, onChange: (e: React.ChangeEvent<HTMLInputElement> | {target: {name: string, value: boolean}}) => void, unit: string, tooltip: string, type?: 'number' | 'checkbox' }> = ({ name, label, value, onChange, unit, tooltip, type = 'number' }) => {
    const { currencySymbol } = useTheme();
    const finalUnit = unit.replace('$', currencySymbol);

    if (type === 'checkbox') {
        return (
             <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                    <label htmlFor={name} className="text-sm font-medium text-on-surface-variant">{label}</label>
                    <InfoTooltip text={tooltip} />
                </div>
                <button onClick={() => onChange({ target: { name, value: !value } } as any)} className={`w-14 h-7 rounded-full flex items-center transition-colors ${value ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                    <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition-transform ${value ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor={name} className="block text-sm font-medium text-on-surface-variant">
                    {label} <span className="text-xs">({finalUnit})</span>
                </label>
                <InfoTooltip text={tooltip} />
            </div>
            <input type="number" id={name} name={name} value={value as string} onChange={onChange} className="input-base w-full" />
        </div>
    );
}

const ResultBox: React.FC<{ label: string, value: string, highlight?: boolean, subtext?: string }> = ({ label, value, highlight, subtext }) => (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-primary/20 text-primary' : 'bg-surface-container-low'}`}>
        <p className={`text-sm ${highlight ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</p>
        <p className={`font-bold text-2xl`}>{value}</p>
        {subtext && <p className="text-xs text-on-surface-variant mt-1">{subtext}</p>}
    </div>
);

const ECommerceProfitCalculator: React.FC<{initialState?: any}> = ({ initialState }) => {
    const [inputs, setInputs] = useState({
        sellingPrice: '500',
        cogs: '150',
        packagingCost: '20',
        shippingCost: '80',
        pgFeePercent: '2.9',
        marketplaceFeePercent: '0',
        rtoRate: '15',
        rtoShippingCost: '120',
        isCogsLostOnRto: true,
    });
    
    const [result, setResult] = useState<any | null>(null);
    const [orderScenario, setOrderScenario] = useState('100');
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    
    const [desiredProfit, setDesiredProfit] = useState('100');
    const [aiResult, setAiResult] = useState<any | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    
    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency, currencySymbol } = useTheme();

    useEffect(() => {
        if (initialState) {
            setInputs(initialState);
            setResult(null);
            setAiResult(null);
        }
    }, [initialState]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | {target: {name: string, value: boolean}}) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const calculations = useMemo(() => {
        const sp = parseFloat(inputs.sellingPrice) || 0;
        const cogs = parseFloat(inputs.cogs) || 0;
        const pkg = parseFloat(inputs.packagingCost) || 0;
        const fwdShip = parseFloat(inputs.shippingCost) || 0;
        const pgFee = (parseFloat(inputs.pgFeePercent) || 0) / 100;
        const mpFee = (parseFloat(inputs.marketplaceFeePercent) || 0) / 100;
        const rtoRate = (parseFloat(inputs.rtoRate) || 0) / 100;
        const rtoShip = parseFloat(inputs.rtoShippingCost) || 0;
        const cogsLost = inputs.isCogsLostOnRto;

        // Delivered Order
        const totalFeesDelivered = sp * (pgFee + mpFee);
        const profitOnDelivered = sp - cogs - pkg - fwdShip - totalFeesDelivered;

        // RTO Order
        const lossOnRto = -1 * ( (cogsLost ? cogs : 0) + pkg + fwdShip + rtoShip );
        
        // Blended (Average) Profit
        const blendedProfit = (profitOnDelivered * (1 - rtoRate)) + (lossOnRto * rtoRate);
        const netMargin = sp > 0 ? (blendedProfit / sp) * 100 : 0;
        
        // Costs for Pie Chart (blended per order)
        const blendedShipping = fwdShip + (rtoShip * rtoRate);
        const blendedFees = totalFeesDelivered * (1-rtoRate);
        const blendedCogs = cogs * (1 - rtoRate) + (cogsLost ? cogs * rtoRate : 0);
        const blendedPkg = pkg;
        
        return {
            profitOnDelivered,
            lossOnRto,
            blendedProfit,
            netMargin,
            pieData: [
                { label: 'COGS', value: blendedCogs, color: '#3b82f6' },
                { label: 'Shipping', value: blendedShipping, color: '#16a34a' },
                { label: 'Fees', value: blendedFees, color: '#f97316' },
                { label: 'Packaging', value: blendedPkg, color: '#9333ea' },
                { label: 'Net Profit', value: blendedProfit > 0 ? blendedProfit : 0, color: '#facc15' }
            ].filter(d => d.value > 0)
        };
    }, [inputs]);
    
    const scenarioCalculations = useMemo(() => {
        const numOrders = parseFloat(orderScenario) || 0;
        if (numOrders <= 0) return null;

        const { blendedProfit, profitOnDelivered, lossOnRto } = calculations;
        const rtoRate = (parseFloat(inputs.rtoRate) || 0) / 100;

        const totalNetProfit = numOrders * blendedProfit;
        const profitFromDeliveredOrders = numOrders * (1 - rtoRate) * profitOnDelivered;
        const totalLossFromRto = numOrders * rtoRate * lossOnRto;

        return {
            numOrders,
            totalNetProfit,
            profitFromDelivered: profitFromDeliveredOrders,
            totalLossFromRto
        };
    }, [orderScenario, calculations, inputs.rtoRate]);

    useEffect(() => {
        if (result && scenarioCalculations) {
            const shareableText = `E-commerce Profit Analysis for ${scenarioCalculations.numOrders} orders:\n- Selling Price: ${formatCurrency(parseFloat(inputs.sellingPrice))}\n\nKey Metrics:\n- Blended Profit/Order: ${formatCurrency(result.blendedProfit)}\n- Total Net Profit: ${formatCurrency(scenarioCalculations.totalNetProfit)}\n- Net Margin: ${result.netMargin.toFixed(2)}%`;
            setShareText(shareableText);
        }
    }, [result, scenarioCalculations, inputs.sellingPrice, formatCurrency]);

    const handleCalculate = () => {
        const historyText = `E-comm Profit for price ${formatCurrency(parseFloat(inputs.sellingPrice))}: Blended Profit ${formatCurrency(calculations.blendedProfit)}`;
        addHistory({
            calculator: 'E-commerce Profit Calculator',
            calculation: historyText,
            inputs: inputs,
        });
        setResult(calculations);
        setAiResult(null); // Clear AI result when main inputs change
    };

    const handleAiGoalSeek = async () => {
        setIsAiLoading(true);
        setAiError('');
        setAiResult(null);

        try {
            if (!process.env.API_KEY) {
                setAiError("AI feature is currently unavailable.");
                return;
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const costInputs = JSON.stringify({
                cogs: inputs.cogs,
                packagingCost: inputs.packagingCost,
                shippingCost: inputs.shippingCost,
                pgFeePercent: inputs.pgFeePercent,
                marketplaceFeePercent: inputs.marketplaceFeePercent,
                rtoRate: inputs.rtoRate,
                rtoShippingCost: inputs.rtoShippingCost,
                isCogsLostOnRto: inputs.isCogsLostOnRto
            });

            const prompt = `Given these e-commerce product costs: ${costInputs}. What selling price should be set to achieve a desired blended net profit of ${formatCurrency(parseFloat(desiredProfit))} per order? Calculate the required selling price. Also, calculate the net margin as a percentage at that price. Provide a brief explanation.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            suggestedSellingPrice: { type: Type.NUMBER },
                            netMarginAtPrice: { type: Type.NUMBER, description: "The net margin as a percentage, e.g., 35.5" },
                            explanation: { type: Type.STRING },
                        },
                        required: ['suggestedSellingPrice', 'netMarginAtPrice', 'explanation'],
                    },
                },
            });

            const jsonString = response.text.trim();
            const parsedResult = JSON.parse(jsonString);
            setAiResult(parsedResult);
            
            addHistory({
                calculator: 'E-commerce AI Pricer',
                calculation: `To make ${formatCurrency(parseFloat(desiredProfit))}/order, sell at ${formatCurrency(parsedResult.suggestedSellingPrice)}`,
                inputs: { ...inputs, desiredProfit }
            });

        } catch (error) {
            console.error("AI Pricing Error:", error);
            setAiError("Sorry, we couldn't generate a price right now. Please check your cost inputs.");
        } finally {
            setIsAiLoading(false);
        }
    };


    return (
        <div className="space-y-6">
             {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="E-commerce Profit Calculator"
                    inputs={inputs}
                    result={result}
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-container p-4 rounded-lg space-y-3">
                    <h2 className="text-xl font-bold text-center">Inputs</h2>
                    <InputField name="sellingPrice" label="Selling Price" value={inputs.sellingPrice} onChange={handleInputChange} unit="$" tooltip="The final price your customer pays."/>
                    <InputField name="cogs" label="Cost of Goods Sold (COGS)" value={inputs.cogs} onChange={handleInputChange} unit="$" tooltip="The direct cost of one unit of your product."/>
                    <InputField name="packagingCost" label="Packaging Cost" value={inputs.packagingCost} onChange={handleInputChange} unit="$ per order" tooltip="Cost of box, tape, filler etc. per order."/>
                    <InputField name="shippingCost" label="Forward Shipping Cost" value={inputs.shippingCost} onChange={handleInputChange} unit="$ per order" tooltip="Cost to ship an order to the customer."/>
                    <InputField name="pgFeePercent" label="Payment Gateway Fee" value={inputs.pgFeePercent} onChange={handleInputChange} unit="%" tooltip="Percentage fee charged by your payment processor (e.g., Stripe, PayPal)."/>
                    <InputField name="marketplaceFeePercent" label="Marketplace Fee" value={inputs.marketplaceFeePercent} onChange={handleInputChange} unit="%" tooltip="Percentage fee charged by the platform (e.g., Shopify, Amazon, Etsy)."/>
                    <InputField name="rtoRate" label="Return-to-Origin (RTO) Rate" value={inputs.rtoRate} onChange={handleInputChange} unit="%" tooltip="The percentage of shipped orders that are returned to you."/>
                    <InputField name="rtoShippingCost" label="RTO Shipping Cost" value={inputs.rtoShippingCost} onChange={handleInputChange} unit="$ per return" tooltip="The cost you incur for a returned shipment to come back to you."/>
                    <InputField name="isCogsLostOnRto" label="Product cost lost on RTO?" value={inputs.isCogsLostOnRto} onChange={handleInputChange} unit="" tooltip="Is the product a total loss if it's returned (e.g., damaged, perishable)?" type="checkbox"/>
                </div>

                <div className="space-y-4">
                    <button onClick={() => handleCalculate()} className="btn-primary w-full text-lg font-bold py-3 px-4 rounded-lg shadow-lg">
                        Analyze Profitability
                    </button>
                    {result && (
                        <div className="animate-fade-in space-y-4">
                            <div className="bg-surface-container p-4 rounded-lg text-center">
                                <h3 className="font-bold text-lg text-primary">Blended Profit Per Order</h3>
                                <p className="text-5xl font-extrabold">{formatCurrency(result.blendedProfit)}</p>
                                <p className="text-sm text-on-surface-variant">Net Margin: {result.netMargin.toFixed(2)}%</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <ResultBox label="Profit on Delivered" value={formatCurrency(result.profitOnDelivered)} />
                                <ResultBox label="Loss on RTO" value={formatCurrency(result.lossOnRto)} />
                            </div>
                            <div id="profit-pie-chart" className="bg-surface-container p-4 rounded-lg">
                                <h3 className="font-bold text-center text-lg mb-4">Blended Breakdown Per Sale</h3>
                                <PieChart data={result.pieData} size={128} />
                            </div>

                            <div className="bg-surface-container p-4 rounded-lg space-y-3">
                                <h3 className="font-bold text-center text-lg">Profit Scenario</h3>
                                <div>
                                    <label htmlFor="orderScenario" className="block text-sm font-medium text-on-surface-variant mb-1">For a batch of</label>
                                    <input type="number" id="orderScenario" value={orderScenario} onChange={(e) => setOrderScenario(e.target.value)} className="input-base w-full" />
                                </div>
                                {scenarioCalculations && (
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm"><span>Profit from Delivered Orders:</span><span className="font-semibold text-green-500">{formatCurrency(scenarioCalculations.profitFromDelivered)}</span></div>
                                        <div className="flex justify-between text-sm"><span>Loss from RTO Orders:</span><span className="font-semibold text-red-500">{formatCurrency(scenarioCalculations.totalLossFromRto)}</span></div>
                                        <div className="flex justify-between text-base font-bold border-t border-outline-variant pt-2 mt-2"><span>Total Net Profit:</span><span className={scenarioCalculations.totalNetProfit >= 0 ? 'text-primary' : 'text-red-500'}>{formatCurrency(scenarioCalculations.totalNetProfit)}</span></div>
                                    </div>
                                )}
                            </div>
                            
                             <div className="bg-surface-container p-4 rounded-lg space-y-3">
                                <h3 className="font-bold text-center text-lg">AI Pricing Assistant</h3>
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-1">To make a profit of ({currencySymbol})</label>
                                    <input type="number" value={desiredProfit} onChange={e => setDesiredProfit(e.target.value)} className="input-base w-full" />
                                </div>
                                <button onClick={handleAiGoalSeek} disabled={isAiLoading} className="btn-secondary w-full font-bold py-2 px-4 rounded-md disabled:opacity-50">
                                    {isAiLoading ? 'Thinking...' : 'Suggest Selling Price'}
                                </button>
                                {isAiLoading && <div className="flex items-center justify-center space-x-2 text-sm text-on-surface-variant"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div><span>AI is calculating...</span></div>}
                                {aiError && <p className="text-red-500 text-center text-sm">{aiError}</p>}
                                {aiResult && (
                                    <div className="bg-surface-container-low p-3 rounded-lg text-center space-y-2">
                                        <p className="text-on-surface-variant text-sm">AI Suggestion:</p>
                                        <p className="font-bold text-2xl text-primary">{formatCurrency(aiResult.suggestedSellingPrice)}</p>
                                        <p className="text-sm">Net Margin: <b>{aiResult.netMarginAtPrice.toFixed(2)}%</b></p>
                                        <p className="text-xs text-on-surface-variant italic pt-2 border-t border-outline-variant mt-2">{aiResult.explanation}</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-surface-container p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>Explain</button>
                                    <ShareButton textToShare={shareText} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ECommerceProfitCalculator;