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

// Interfaces for cost items
interface MaterialItem { id: string; name: string; marketPrice: string; packageSize: string; usedAmount: string; }
interface LaborItem { id: string; name: string; costType: 'perUnit' | 'perHour'; cost: string; timePerUnit: string; }
interface PackagingItem { id: string; name: string; cost: string; }
interface OverheadItem { id: string; name: string; cost: string; }

// Initial state creators
const createMaterial = (): MaterialItem => ({ id: crypto.randomUUID(), name: '', marketPrice: '', packageSize: '', usedAmount: '' });
const createLabor = (): LaborItem => ({ id: crypto.randomUUID(), name: '', costType: 'perUnit', cost: '', timePerUnit: '60' });
const createPackaging = (): PackagingItem => ({ id: crypto.randomUUID(), name: '', cost: '' });
const createOverhead = (): OverheadItem => ({ id: crypto.randomUUID(), name: '', cost: '' });


const ProductCostCalculator: React.FC<{initialState?: any, isPremium?: boolean}> = ({ initialState, isPremium }) => {
    const [activeTab, setActiveTab] = useState('materials');
    
    // State for all costs
    const [productName, setProductName] = useState('My Awesome Product');
    const [materials, setMaterials] = useState<MaterialItem[]>([createMaterial()]);
    const [labor, setLabor] = useState<LaborItem[]>([createLabor()]);
    const [packaging, setPackaging] = useState<PackagingItem[]>([createPackaging()]);
    const [overheads, setOverheads] = useState<OverheadItem[]>([createOverhead()]);

    // State for summary
    const [unitsProduced, setUnitsProduced] = useState('100');
    const [profitMargin, setProfitMargin] = useState('50');
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency } = useTheme();
    const { shouldShowAd } = useAd();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;

    const [showAd, setShowAd] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    useEffect(() => {
        if (initialState) {
            setActiveTab(initialState.activeTab || 'materials');
            setProductName(initialState.productName || 'My Awesome Product');
            setMaterials(initialState.materials || [createMaterial()]);
            setLabor(initialState.labor || [createLabor()]);
            setPackaging(initialState.packaging || [createPackaging()]);
            setOverheads(initialState.overheads || [createOverhead()]);
            setUnitsProduced(initialState.unitsProduced || '100');
            setProfitMargin(initialState.profitMargin || '50');
        }
    }, [initialState]);

    // Generic handler for adding/removing/updating items
    const createHandlers = <T extends {id: string}>(state: T[], setState: React.Dispatch<React.SetStateAction<T[]>>, createFn: () => T) => ({
        add: () => setState(prev => [...prev, createFn()]),
        remove: (id: string) => setState(prev => prev.filter(item => item.id !== id)),
        update: (id: string, field: keyof T, value: any) => setState(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
    });

    const materialHandlers = createHandlers(materials, setMaterials, createMaterial);
    const laborHandlers = createHandlers(labor, setLabor, createLabor);
    const packagingHandlers = createHandlers(packaging, setPackaging, createPackaging);
    const overheadHandlers = createHandlers(overheads, setOverheads, createOverhead);

    const calculations = useMemo(() => {
        const numUnits = parseFloat(unitsProduced) || 1;

        const totalMaterialCost = materials.reduce((sum, item) => {
            const price = parseFloat(item.marketPrice) || 0;
            const size = parseFloat(item.packageSize) || 1;
            const used = parseFloat(item.usedAmount) || 0;
            return sum + (price / size) * used;
        }, 0);

        const totalLaborCost = labor.reduce((sum, item) => {
            const cost = parseFloat(item.cost) || 0;
            if (item.costType === 'perUnit') return sum + cost;
            const time = parseFloat(item.timePerUnit) || 0;
            return sum + (cost / 60) * time; // cost is per hour, time is per minute
        }, 0);

        const totalPackagingCost = packaging.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);

        const totalOverheadCost = overheads.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
        const overheadCostPerUnit = totalOverheadCost / numUnits;

        const totalCostPerUnit = totalMaterialCost + totalLaborCost + totalPackagingCost + overheadCostPerUnit;
        
        const margin = (parseFloat(profitMargin) || 0) / 100;
        const recommendedPrice = margin < 1 ? totalCostPerUnit / (1 - margin) : totalCostPerUnit;
        const profitPerUnit = recommendedPrice - totalCostPerUnit;
        const totalProfit = profitPerUnit * numUnits;

        return {
            totalMaterialCost, totalLaborCost, totalPackagingCost, totalOverheadCost,
            overheadCostPerUnit, totalCostPerUnit, recommendedPrice, profitPerUnit, totalProfit
        };
    }, [materials, labor, packaging, overheads, unitsProduced, profitMargin]);
    
    const saveAction = () => {
        if (fuel < fuelCost) {
            if (shouldShowAd(isPremium)) {
                 setPendingAction(() => saveAction);
                 setShowAd(true);
            }
            return;
        }
        consumeFuel(fuelCost);
        addHistory({
            calculator: 'Product Cost Calculator',
            calculation: `${productName}: Rec. Price ${formatCurrency(calculations.recommendedPrice)}`,
            inputs: {
                activeTab, productName, materials, labor, packaging, overheads,
                unitsProduced, profitMargin
            }
        });
    };

    const handleSaveToHistory = () => {
        saveAction();
    };

    const handleAdClose = () => {
        pendingAction?.();
        setPendingAction(null);
        setShowAd(false);
    };
    
    const shareText = useMemo(() => {
        return `Cost Analysis for "${productName}":\n- Cost Per Unit: ${formatCurrency(calculations.totalCostPerUnit)}\n- Recommended Price (${profitMargin}% Margin): ${formatCurrency(calculations.recommendedPrice)}\n- Profit Per Unit: ${formatCurrency(calculations.profitPerUnit)}`;
    }, [productName, calculations, profitMargin, formatCurrency]);


    const renderCostSection = <T extends {id: string, name: string}>(
        title: string, items: T[], handlers: any, renderInputs: (item: T, update: (field: keyof T, value: any) => void) => React.ReactNode
    ) => (
        <div className="space-y-2">
            {items.map(item => (
                <div key={item.id} className="bg-theme-primary p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <input type="text" placeholder={`New ${title.slice(0, -1)}`} value={item.name} onChange={e => handlers.update(item.id, 'name', e.target.value)} className="font-semibold bg-transparent w-full focus:outline-none focus:border-b border-primary" />
                        <button onClick={() => handlers.remove(item.id)} className="p-1 rounded-full text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0" aria-label={`Remove ${item.name || 'item'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></button>
                    </div>
                    {renderInputs(item, (field, value) => handlers.update(item.id, field, value))}
                </div>
            ))}
            <button onClick={handlers.add} className="w-full border-2 border-dashed border-theme-tertiary text-theme-secondary font-semibold py-2 px-4 rounded-md hover:bg-theme-primary hover:text-theme-primary transition-colors text-sm">+ Add {title.slice(0, -1)}</button>
        </div>
    );
    
    const itemInputClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition text-sm";
    const TabButton: React.FC<{ name: string; label: string }> = ({ name, label }) => (
        <button onClick={() => setActiveTab(name)} className={`w-1/4 py-2 text-center text-sm font-semibold transition-colors rounded-md ${activeTab === name ? 'bg-primary text-on-primary' : 'text-theme-secondary hover:bg-theme-tertiary'}`}>{label}</button>
    );
    const ResultLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-theme"><span className="text-theme-secondary">{label}</span><span className="font-bold text-theme-primary">{value}</span></div>
    );


    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            {isExplainModalOpen && (
                <ExplanationModal
                    isOpen={isExplainModalOpen}
                    onClose={() => setIsExplainModalOpen(false)}
                    calculatorName="Product Cost Calculator"
                    inputs={{ productName, materials, labor, packaging, overheads, unitsProduced, profitMargin }}
                    result={calculations}
                />
            )}
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-theme-secondary mb-1">Product Name</label>
                <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} className={`${itemInputClasses} text-base p-3`} />
            </div>

            <div className="flex justify-around bg-theme-secondary p-1 rounded-lg">
                <TabButton name="materials" label="Materials" />
                <TabButton name="labor" label="Labor" />
                <TabButton name="overheads" label="Overheads" />
                <TabButton name="summary" label="Summary" />
            </div>

            {activeTab === 'materials' && renderCostSection('Materials', materials, materialHandlers, (item, update) => (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div><label className="text-xs text-theme-secondary flex items-center mb-1">Price <InfoTooltip text="Price for the whole package." /></label><input type="number" placeholder="50" value={item.marketPrice} onChange={e => update('marketPrice', e.target.value)} className={itemInputClasses} /></div>
                    <div><label className="text-xs text-theme-secondary flex items-center mb-1">Size <InfoTooltip text="Package size (g, kg, m, etc)." /></label><input type="number" placeholder="1000" value={item.packageSize} onChange={e => update('packageSize', e.target.value)} className={itemInputClasses} /></div>
                    <div><label className="text-xs text-theme-secondary flex items-center mb-1">Used <InfoTooltip text="Amount used per unit." /></label><input type="number" placeholder="200" value={item.usedAmount} onChange={e => update('usedAmount', e.target.value)} className={itemInputClasses} /></div>
                </div>
            ))}
            
            {activeTab === 'labor' && (
                <div className="space-y-4">
                    {renderCostSection('Labor Costs', labor, laborHandlers, (item, update) => (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                           <div className="col-span-2 sm:col-span-1"><label className="text-xs text-theme-secondary mb-1">Cost Type</label>
                                <select value={item.costType} onChange={e => update('costType', e.target.value)} className={itemInputClasses}>
                                    <option value="perUnit">Per Unit</option><option value="perHour">Per Hour</option>
                                </select>
                            </div>
                           <div><label className="text-xs text-theme-secondary mb-1">Cost ({item.costType === 'perUnit' ? 'per Unit' : 'per hr'})</label><input type="number" value={item.cost} onChange={e => update('cost', e.target.value)} className={itemInputClasses}/></div>
                           {item.costType === 'perHour' && <div><label className="text-xs text-theme-secondary mb-1">Time (mins/unit)</label><input type="number" value={item.timePerUnit} onChange={e => update('timePerUnit', e.target.value)} className={itemInputClasses}/></div>}
                        </div>
                    ))}
                     {renderCostSection('Packaging Costs', packaging, packagingHandlers, (item, update) => (
                         <div><label className="text-xs text-theme-secondary mb-1">Cost Per Unit</label><input type="number" value={item.cost} onChange={e => update('cost', e.target.value)} className={itemInputClasses}/></div>
                    ))}
                </div>
            )}
            
             {activeTab === 'overheads' && renderCostSection('Overheads', overheads, overheadHandlers, (item, update) => (
                 <div><label className="text-xs text-theme-secondary mb-1">Cost for Batch</label><input type="number" placeholder="e.g., Rent" value={item.cost} onChange={e => update('cost', e.target.value)} className={itemInputClasses}/></div>
            ))}

            {activeTab === 'summary' && (
                <div className="animate-fade-in space-y-4">
                    <div className="p-4 bg-theme-secondary rounded-lg space-y-4">
                        <h3 className="font-bold text-center text-lg">Summary Inputs</h3>
                        <div><div className="flex items-center space-x-2 mb-1"><label className="text-sm font-medium text-theme-secondary">Units Produced in Batch</label><InfoTooltip text="How many items are produced with the listed overhead costs." /></div><input type="number" value={unitsProduced} onChange={e => setUnitsProduced(e.target.value)} className={`${itemInputClasses} p-3 text-base`} /></div>
                        <div><div className="flex items-center space-x-2 mb-1"><label className="text-sm font-medium text-theme-secondary">Desired Profit Margin (%)</label><InfoTooltip text="The percentage of the selling price that is profit." /></div><input type="number" value={profitMargin} onChange={e => setProfitMargin(e.target.value)} className={`${itemInputClasses} p-3 text-base`} /></div>
                    </div>
                    <div id="product-cost-pie-chart" className="p-4 bg-theme-secondary rounded-lg">
                        <h3 className="font-bold text-center text-lg mb-4">Cost Breakdown</h3>
                        <PieChart data={[
                            { label: 'Materials', value: calculations.totalMaterialCost, color: '#3b82f6' },
                            { label: 'Labor', value: calculations.totalLaborCost, color: '#16a34a' },
                            { label: 'Packaging', value: calculations.totalPackagingCost, color: '#f97316' },
                            { label: 'Overheads', value: calculations.overheadCostPerUnit, color: '#9333ea' }
                        ]}/>
                    </div>
                    <div className="p-4 bg-theme-secondary rounded-lg">
                        <ResultLine label="Material Cost / Unit" value={formatCurrency(calculations.totalMaterialCost)} />
                        <ResultLine label="Labor & Packaging / Unit" value={formatCurrency(calculations.totalLaborCost + calculations.totalPackagingCost)} />
                        <ResultLine label="Overhead Cost / Unit" value={formatCurrency(calculations.overheadCostPerUnit)} />
                        <div className="flex justify-between py-3 border-t-2 border-primary mt-2">
                            <span className="font-bold text-lg text-primary">Total Cost / Unit</span>
                            <span className="font-bold text-lg text-primary">{formatCurrency(calculations.totalCostPerUnit)}</span>
                        </div>
                    </div>
                     <div className="p-4 bg-primary/20 border border-primary/50 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-primary">Recommended Price / Unit</h3>
                        <p className="text-4xl font-extrabold text-primary">{formatCurrency(calculations.recommendedPrice)}</p>
                        <p className="text-xs text-primary/80">To achieve a {profitMargin}% profit margin</p>
                    </div>
                    <div className="p-4 bg-theme-secondary rounded-lg space-y-2">
                        <ResultLine label="Profit / Unit" value={formatCurrency(calculations.profitPerUnit)} />
                        <ResultLine label="Total Profit (for batch)" value={formatCurrency(calculations.totalProfit)} />
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center pt-2">
                <button onClick={handleSaveToHistory} className="bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors shadow-lg">Save Calculation</button>
                 <button onClick={() => setIsExplainModalOpen(true)} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    Explain
                </button>
                <ShareButton textToShare={shareText} />
            </div>
        </div>
    );
};

export default ProductCostCalculator;