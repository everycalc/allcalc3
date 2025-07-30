import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import ExplanationModal from './ExplanationModal';
import { useFuel } from '../contexts/FuelContext';
import PdfFuelModal from './PdfFuelModal';
import RewardedAdModal from './RewardedAdModal';
import jsPDF from 'jspdf';

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

const ResultBox: React.FC<{ label: string; value: string; subtext?: string; large?: boolean }> = ({ label, value, subtext, large }) => (
    <div className={`bg-theme-primary p-3 rounded-lg text-center ${large ? 'col-span-2' : ''}`}>
        <p className="text-sm text-theme-secondary">{label}</p>
        <p className={`font-bold ${large ? 'text-4xl' : 'text-2xl'} text-primary`}>{value}</p>
        {subtext && <p className="text-xs text-theme-secondary mt-1">{subtext}</p>}
    </div>
);

interface Result {
    eoq: number;
    rop: number;
    numOrders: number;
    annualOrderingCost: number;
    annualHoldingCost: number;
    totalCost: number;
}

interface InventoryInputs {
    annualDemand: string;
    orderingCost: string;
    holdingCost: string;
    dailyDemand: string;
    leadTime: string;
    safetyStock: string;
}

interface InventoryManagementCalculatorProps {
    isPremium?: boolean;
    initialState?: InventoryInputs;
}

const InventoryManagementCalculator: React.FC<InventoryManagementCalculatorProps> = ({ isPremium, initialState }) => {
    const { addHistory } = useContext(HistoryContext);
    const { shouldShowAd } = useAd();
    const { formatCurrency, currencySymbol } = useTheme();
    const { fuel, consumeFuel, addFuel } = useFuel();

    const [inputs, setInputs] = useState<InventoryInputs>({
        annualDemand: '10000',
        orderingCost: '50',
        holdingCost: '5',
        dailyDemand: '28',
        leadTime: '14',
        safetyStock: '100'
    });
    const [result, setResult] = useState<Result | null>(null);
    const [pendingResult, setPendingResult] = useState<any | null>(null);
    const [showAd, setShowAd] = useState(false);
    const [shareText, setShareText] = useState('');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const [showPdfFuelModal, setShowPdfFuelModal] = useState(false);
    const [showRefuelModal, setShowRefuelModal] = useState(false);
    
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

    const handleCalculate = () => {
        const annualDemand = parseFloat(inputs.annualDemand) || 0;
        const orderingCost = parseFloat(inputs.orderingCost) || 0;
        const holdingCost = parseFloat(inputs.holdingCost) || 0;
        const dailyDemand = parseFloat(inputs.dailyDemand) || 0;
        const leadTime = parseFloat(inputs.leadTime) || 0;
        const safetyStock = parseFloat(inputs.safetyStock) || 0;

        const eoq = holdingCost > 0 ? Math.sqrt((2 * annualDemand * orderingCost) / holdingCost) : 0;
        const rop = (dailyDemand * leadTime) + safetyStock;

        const numOrders = eoq > 0 ? annualDemand / eoq : 0;
        const annualOrderingCost = numOrders * orderingCost;
        const annualHoldingCost = eoq > 0 ? (eoq / 2) * holdingCost : 0;
        const totalCost = annualOrderingCost + annualHoldingCost;
        
        const calculatedResult = { eoq, rop, numOrders, annualOrderingCost, annualHoldingCost, totalCost };

        addHistory({
            calculator: 'Inventory Management Calculator',
            calculation: `EOQ: ${eoq.toFixed(0)} units, ROP: ${rop.toFixed(0)} units`,
            inputs: inputs
        });
        
        setShareText(`Inventory Management Calculation:\n- Annual Demand: ${annualDemand} units\n- Ordering Cost: ${formatCurrency(orderingCost)}\n- Holding Cost: ${formatCurrency(holdingCost)}/unit\n\nResults:\n- EOQ: ${eoq.toFixed(0)} units\n- ROP: ${rop.toFixed(0)} units\n- Total Inventory Cost: ${formatCurrency(totalCost)}`);

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

    const generatePdf = () => {
        if (!result) return;
        const doc = new jsPDF();
        let y = 15;
    
        doc.setFontSize(18);
        doc.text('Inventory Management Report', 14, y); y += 10;
    
        doc.setFontSize(12); doc.text('Inputs', 14, y); y += 6;
        doc.setFontSize(10);
        Object.entries(inputs).forEach(([key, value]) => {
            doc.text(`- ${key}: ${value}`, 16, y); y += 5;
        });
    
        y += 5; doc.line(14, y, 196, y); y += 10;
    
        doc.setFontSize(12); doc.text('Key Metrics', 14, y); y += 6;
        doc.setFontSize(10);
        doc.text(`- Economic Order Quantity (EOQ): ${result.eoq.toFixed(0)} units`, 16, y); y += 5;
        doc.text(`- Reorder Point (ROP): ${result.rop.toFixed(0)} units`, 16, y); y += 10;

        doc.setFontSize(12); doc.text('Cost Breakdown', 14, y); y += 6;
        doc.setFontSize(10);
        doc.text(`- Number of Orders/Year: ${result.numOrders.toFixed(2)}`, 16, y); y += 5;
        doc.text(`- Annual Ordering Cost: ${formatCurrency(result.annualOrderingCost)}`, 16, y); y += 5;
        doc.text(`- Annual Holding Cost: ${formatCurrency(result.annualHoldingCost)}`, 16, y); y += 5;
        doc.setFont('helvetica', 'bold');
        doc.text(`- Total Annual Inventory Cost: ${formatCurrency(result.totalCost)}`, 16, y); y += 5;
    
        doc.save(`Inventory-Report-${Date.now()}.pdf`);
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
            {isExplainModalOpen && result && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Inventory Management Calculator"
                    inputs={inputs}
                    result={result}
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* INPUTS PANEL */}
                <div className="bg-theme-secondary p-4 rounded-lg space-y-4">
                    <h2 className="text-xl font-bold text-center mb-2">Inputs</h2>
                    <InputField label="Annual Demand" name="annualDemand" unit="units" value={inputs.annualDemand} onChange={handleInputChange} tooltip="Total number of units you expect to sell in a year." />
                    <InputField label="Ordering Cost" name="orderingCost" unit={`${currencySymbol} per order`} value={inputs.orderingCost} onChange={handleInputChange} tooltip="The fixed cost incurred every time an order is placed (e.g., shipping, handling)." />
                    <InputField label="Holding Cost" name="holdingCost" unit={`${currencySymbol} per unit per year`} value={inputs.holdingCost} onChange={handleInputChange} tooltip="The cost to hold one unit of inventory for a year (e.g., storage, insurance)." />
                    <InputField label="Average Daily Demand" name="dailyDemand" unit="units" value={inputs.dailyDemand} onChange={handleInputChange} tooltip="The average number of units sold per day." />
                    <InputField label="Lead Time" name="leadTime" unit="days" value={inputs.leadTime} onChange={handleInputChange} tooltip="The time it takes from placing an order to receiving the goods." />
                    <InputField label="Safety Stock" name="safetyStock" unit="units" value={inputs.safetyStock} onChange={handleInputChange} tooltip="Extra stock held to mitigate risk of stockouts caused by uncertainties in supply and demand." />
                </div>

                {/* RESULTS PANEL */}
                <div className="space-y-4">
                    <div className="bg-theme-secondary p-4 rounded-lg space-y-4">
                        <button onClick={handleCalculate} className="w-full bg-primary text-on-primary text-lg font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                            Calculate
                        </button>
                        {result && (
                            <div className="space-y-4 mt-4 animate-fade-in">
                                <h2 className="text-xl font-bold text-center">Key Metrics</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <ResultBox label="Economic Order Quantity (EOQ)" value={result.eoq.toFixed(0)} subtext="Ideal order size" large />
                                    <ResultBox label="Reorder Point (ROP)" value={result.rop.toFixed(0)} subtext="Inventory level to re-order" large />
                                </div>
                                <div className="bg-theme-primary p-4 rounded-lg space-y-3">
                                    <h2 className="text-lg font-bold text-center">Cost Breakdown</h2>
                                    <div className="flex justify-between text-sm"><span>Number of Orders/Year:</span> <span className="font-semibold">{result.numOrders.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm"><span>Annual Ordering Cost:</span> <span className="font-semibold">{formatCurrency(result.annualOrderingCost)}</span></div>
                                    <div className="flex justify-between text-sm"><span>Annual Holding Cost:</span> <span className="font-semibold">{formatCurrency(result.annualHoldingCost)}</span></div>
                                    <div className="flex justify-between font-bold text-base border-t border-theme pt-2 mt-2"><span>Total Annual Inventory Cost:</span> <span className="text-primary">{formatCurrency(result.totalCost)}</span></div>
                                </div>
                                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-theme-tertiary">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagementCalculator;