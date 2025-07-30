import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';
import { useFuel } from '../contexts/FuelContext';
import InsufficientFuelModal from './InsufficientFuelModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PdfFuelModal from './PdfFuelModal';
import RewardedAdModal from './RewardedAdModal';

const InputField: React.FC<{ name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, unit: string, tooltip: string }> = ({ name, label, value, onChange, unit, tooltip }) => {
    const { currencySymbol } = useTheme();
    const finalUnit = unit.replace('$', currencySymbol);

    return (
        <div>
            <div className="flex items-center space-x-2 mb-1">
                <label htmlFor={name} className="block text-sm font-medium text-theme-secondary">
                    {label} <span className="text-xs">({finalUnit})</span>
                </label>
                <InfoTooltip text={tooltip} />
            </div>
            <input type="number" id={name} name={name} value={value} onChange={onChange} className="w-full bg-theme-primary text-theme-primary border-theme rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition" />
        </div>
    );
}

const ResultBox: React.FC<{ label: string, value: string, highlight?: boolean, subtext?: string }> = ({ label, value, highlight, subtext }) => (
    <div className={`p-3 rounded-lg ${highlight ? 'bg-primary/20 text-primary' : 'bg-theme-primary'}`}>
        <p className={`text-sm ${highlight ? 'text-primary' : 'text-theme-secondary'}`}>{label}</p>
        <p className={`font-bold text-2xl`}>{value}</p>
        {subtext && <p className="text-xs text-theme-secondary mt-1">{subtext}</p>}
    </div>
);


const ECommerceProfitCalculator: React.FC<{initialState?: any, isPremium?: boolean}> = ({ initialState, isPremium }) => {
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
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const [showInsufficientFuelModal, setShowInsufficientFuelModal] = useState(false);
    const [showPdfFuelModal, setShowPdfFuelModal] = useState(false);
    const [showRefuelModal, setShowRefuelModal] = useState(false);
    
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency } = useTheme();
    const { fuel, consumeFuel, setFuel, addFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;
    const PDF_COST = 5;

    useEffect(() => {
        if (initialState) {
            setInputs(initialState);
            setResult(null);
        }
    }, [initialState]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
                { label: 'Packaging', value: blendedPkg, color: '#9333ea' }
            ]
        };
    }, [inputs]);
    
    const scenarioCalculations = useMemo(() => {
        const numOrders = parseFloat(orderScenario) || 0;
        if (numOrders <= 0) return null;

        const { blendedProfit, profitOnDelivered } = calculations;
        const rtoRate = (parseFloat(inputs.rtoRate) || 0) / 100;

        const totalNetProfit = numOrders * blendedProfit;
        const profitFromDeliveredOrders = numOrders * (1 - rtoRate) * profitOnDelivered;
        const totalLossFromRto = totalNetProfit - profitFromDeliveredOrders;

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


    const handleCalculate = (bypassFuelCheck = false) => {
        const performCalculation = () => {
            const historyText = `E-comm Profit for price ${formatCurrency(parseFloat(inputs.sellingPrice))}: Blended Profit ${formatCurrency(calculations.blendedProfit)}`;
            addHistory({
                calculator: 'E-commerce Profit Calculator',
                calculation: historyText,
                inputs: inputs,
            });
            return calculations;
        };
        
        if (bypassFuelCheck) {
            if (shouldShowAd(isPremium)) {
                setPendingResult(calculations);
                setShowAd(true);
            } else {
                setResult(calculations);
            }
            return;
        }

        if (fuel > 0 && fuel < fuelCost) {
            setShowInsufficientFuelModal(true);
            return;
        }

        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            setResult(performCalculation());
        } else {
            const calculatedResult = performCalculation();
            if (shouldShowAd(isPremium)) {
                setPendingResult(calculatedResult);
                setShowAd(true);
            } else {
                setResult(calculatedResult);
            }
        }
    };
    
    const handleAdClose = () => {
        if(pendingResult) {
            setResult(pendingResult);
            setPendingResult(null);
        }
        setShowAd(false);
    };

    const handleContinueAnyway = () => {
        setFuel(0); // Set fuel to 0 to enable ad mode
        setShowInsufficientFuelModal(false);
        handleCalculate(true); // Recalculate, which will now trigger ad logic
    };

    const handleWatchAdToUse = () => {
        setShowInsufficientFuelModal(false);
        setPendingResult(calculations); // The result is ready, just needs to be displayed after ad
        setShowAd(true);
    };
    
    const generatePdf = async () => {
        if (!result) return;
        const doc = new jsPDF();
        let y = 15;
    
        doc.setFontSize(18); doc.text('E-commerce Profit Report', 14, y); y += 10;
        
        doc.setFontSize(12); doc.text('Inputs', 14, y); y += 6;
        doc.setFontSize(10);
        Object.entries(inputs).forEach(([key, value]) => {
            doc.text(`- ${key}: ${value}`, 16, y); y += 5;
        });
    
        y += 5; doc.line(14, y, 196, y); y += 10;
    
        doc.setFontSize(12); doc.text('Results per Order', 14, y); y += 6;
        doc.setFontSize(10);
        doc.text(`- Blended Profit: ${formatCurrency(result.blendedProfit)}`, 16, y); y += 5;
        doc.text(`- Net Margin: ${result.netMargin.toFixed(2)}%`, 16, y); y += 5;
        doc.text(`- Profit on Delivered Order: ${formatCurrency(result.profitOnDelivered)}`, 16, y); y += 5;
        doc.text(`- Loss on RTO Order: ${formatCurrency(result.lossOnRto)}`, 16, y); y += 10;
        
        const pieChartElement = document.getElementById('profit-pie-chart');
        if (pieChartElement) {
            const canvas = await html2canvas(pieChartElement, { backgroundColor: null });
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 14, y, 120, 60);
            y += 70;
        }

        if(scenarioCalculations) {
            doc.setFontSize(12); doc.text(`Scenario: ${scenarioCalculations.numOrders} Orders`, 14, y); y+=6;
            doc.setFontSize(10);
            doc.text(`- Total Net Profit: ${formatCurrency(scenarioCalculations.totalNetProfit)}`, 16, y); y+=5;
            doc.text(`- Profit from Delivered: ${formatCurrency(scenarioCalculations.profitFromDelivered)}`, 16, y); y+=5;
            doc.text(`- Loss from RTO: ${formatCurrency(scenarioCalculations.totalLossFromRto)}`, 16, y); y+=5;
        }

        doc.save(`Ecomm-Profit-Report-${Date.now()}.pdf`);
    };

    const handleDownloadPdfClick = () => {
        if (!result) return;
        if (fuel >= PDF_COST) {
            consumeFuel(PDF_COST);
            generatePdf();
        } else {
            setShowPdfFuelModal(true);
        }
    };

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            {showPdfFuelModal && <PdfFuelModal isOpen={showPdfFuelModal} onClose={() => setShowPdfFuelModal(false)} cost={PDF_COST} onRefuel={() => { setShowPdfFuelModal(false); setShowRefuelModal(true); }} />}
            {showRefuelModal && <RewardedAdModal onClose={() => setShowRefuelModal(false)} onComplete={() => { addFuel(3); setShowRefuelModal(false); }} />}
            {showInsufficientFuelModal && (
                <InsufficientFuelModal
                    isOpen={true}
                    onClose={() => setShowInsufficientFuelModal(false)}
                    onWatchAd={handleWatchAdToUse}
                    onContinue={handleContinueAnyway}
                    onRefuel={() => setShowInsufficientFuelModal(false)}
                />
            )}
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
                <div className="bg-theme-secondary p-4 rounded-lg space-y-3">
                    <h2 className="text-xl font-bold text-center">Inputs</h2>
                    <InputField name="sellingPrice" label="Selling Price" value={inputs.sellingPrice} onChange={handleInputChange} unit="$" tooltip="The final price your customer pays."/>
                    <InputField name="cogs" label="Cost of Goods Sold (COGS)" value={inputs.cogs} onChange={handleInputChange} unit="$" tooltip="The direct cost of one unit of your product."/>
                    <InputField name="packagingCost" label="Packaging Cost" value={inputs.packagingCost} onChange={handleInputChange} unit="$ per order" tooltip="Cost of box, tape, filler etc. per order."/>
                    <InputField name="shippingCost" label="Forward Shipping Cost" value={inputs.shippingCost} onChange={handleInputChange} unit="$ per order" tooltip="Cost to ship an order to the customer."/>
                    <InputField name="pgFeePercent" label="Payment Gateway Fee" value={inputs.pgFeePercent} onChange={handleInputChange} unit="%" tooltip="Percentage fee charged by your payment processor (e.g., Stripe, PayPal)."/>
                    <InputField name="marketplaceFeePercent" label="Marketplace Fee" value={inputs.marketplaceFeePercent} onChange={handleInputChange} unit="%" tooltip="Percentage fee charged by the platform (e.g., Shopify, Amazon, Etsy)."/>
                    <InputField name="rtoRate" label="Return-to-Origin (RTO) Rate" value={inputs.rtoRate} onChange={handleInputChange} unit="%" tooltip="The percentage of shipped orders that are returned to you."/>
                    <InputField name="rtoShippingCost" label="RTO Shipping Cost" value={inputs.rtoShippingCost} onChange={handleInputChange} unit="$ per return" tooltip="The cost you incur for a returned shipment to come back to you."/>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="isCogsLostOnRto" className="text-sm font-medium text-theme-secondary">Product cost lost on RTO?</label>
                            <InfoTooltip text="Is the product a total loss if it's returned (e.g., damaged, perishable)?" />
                        </div>
                        <button onClick={() => setInputs(p => ({...p, isCogsLostOnRto: !p.isCogsLostOnRto}))} className={`w-14 h-7 rounded-full flex items-center transition-colors ${inputs.isCogsLostOnRto ? 'bg-primary' : 'bg-theme-tertiary'}`}>
                            <span className={`inline-block w-5 h-5 bg-white rounded-full transform transition-transform ${inputs.isCogsLostOnRto ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <button onClick={() => handleCalculate(false)} className="w-full bg-primary text-on-primary text-lg font-bold py-3 px-4 rounded-lg hover:bg-primary-light transition-colors duration-200 shadow-lg">
                        Analyze Profitability
                    </button>
                    {result && (
                        <div className="animate-fade-in space-y-4">
                            <div className="bg-theme-secondary p-4 rounded-lg text-center">
                                <h3 className="font-bold text-lg text-primary">Blended Profit Per Order</h3>
                                <p className="text-5xl font-extrabold">{formatCurrency(result.blendedProfit)}</p>
                                <p className="text-sm text-theme-secondary">Net Margin: {result.netMargin.toFixed(2)}%</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <ResultBox label="Profit on Delivered" value={formatCurrency(result.profitOnDelivered)} />
                                <ResultBox label="Loss on RTO" value={formatCurrency(result.lossOnRto)} />
                            </div>
                            <div id="profit-pie-chart" className="bg-theme-secondary p-4 rounded-lg">
                                <h3 className="font-bold text-center text-lg mb-4">Blended Cost Breakdown</h3>
                                <PieChart data={result.pieData} size={128} />
                            </div>

                            {/* Profit Scenario */}
                            <div className="bg-theme-secondary p-4 rounded-lg space-y-3">
                                <h3 className="font-bold text-center text-lg">Profit Scenario</h3>
                                <div>
                                    <label htmlFor="orderScenario" className="block text-sm font-medium text-theme-secondary mb-1">
                                        For a batch of
                                    </label>
                                    <input 
                                        type="number" 
                                        id="orderScenario" 
                                        value={orderScenario} 
                                        onChange={(e) => setOrderScenario(e.target.value)} 
                                        className="w-full bg-theme-primary text-theme-primary border-theme rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition" 
                                    />
                                </div>
                                {scenarioCalculations && (
                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Profit from Delivered Orders:</span>
                                            <span className="font-semibold text-green-500">{formatCurrency(scenarioCalculations.profitFromDelivered)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Loss from RTO Orders:</span>
                                            <span className="font-semibold text-red-500">{formatCurrency(scenarioCalculations.totalLossFromRto)}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold border-t border-theme pt-2 mt-2">
                                            <span>Total Net Profit:</span>
                                            <span className={scenarioCalculations.totalNetProfit >= 0 ? 'text-primary' : 'text-red-500'}>{formatCurrency(scenarioCalculations.totalNetProfit)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-theme-secondary p-4 rounded-lg">
                                {scenarioCalculations && (
                                    <div className="flex justify-between items-center">
                                         <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                           Explain
                                        </button>
                                        <button onClick={handleDownloadPdfClick} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download PDF <span className="ml-1.5 text-xs font-bold text-red-500">(-{PDF_COST} ⛽)</span>
                                        </button>
                                        <ShareButton textToShare={shareText} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ECommerceProfitCalculator;