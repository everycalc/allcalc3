

import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import PieChart from './PieChart';
import ExplanationModal from './ExplanationModal';

// --- TYPE DEFINITIONS ---
interface CostItem {
  id: string;
  name: string;
}

interface Material extends CostItem {
  marketPrice: string;
  packageSize: string;
  usedAmount: string;
}

interface Labor extends CostItem {
  costType: 'perUnit' | 'perHour';
  cost: string;
  timePerUnit: string; // in minutes
}

interface Packaging extends CostItem {
  cost: string;
}

interface Overhead extends CostItem {
  cost: string;
}

// --- HOOK FOR MANAGING COST ITEMS ---
const useCostItemManagement = <T extends CostItem>(initialState: T[], createNewItem: () => T) => {
    const [items, setItems] = useState<T[]>(initialState);

    const addItem = () => setItems(prev => [...prev, createNewItem()]);
    const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
    const updateItem = (id: string, field: keyof Omit<T, 'id'>, value: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
    };
    
    return { items, setItems, addItem, removeItem, updateItem };
};

// --- COMPONENT ---
const ProductCostCalculator: React.FC<{initialState?: any, isPremium?: boolean}> = ({ initialState, isPremium }) => {
    const [productName, setProductName] = useState('My Awesome Product');
    const [unitsProduced, setUnitsProduced] = useState('1000');
    const [profitMargin, setProfitMargin] = useState('50');
    const [activeTab, setActiveTab] = useState('materials');

    const materialHandlers = useCostItemManagement<Material>([], () => ({ id: crypto.randomUUID(), name: '', marketPrice: '', packageSize: '', usedAmount: '' }));
    const laborHandlers = useCostItemManagement<Labor>([], () => ({ id: crypto.randomUUID(), name: '', costType: 'perHour', cost: '', timePerUnit: '' }));
    const packagingHandlers = useCostItemManagement<Packaging>([], () => ({ id: crypto.randomUUID(), name: '', cost: '' }));
    const overheadHandlers = useCostItemManagement<Overhead>([], () => ({ id: crypto.randomUUID(), name: '', cost: '' }));

    const { items: materials, setItems: setMaterials } = materialHandlers;
    const { items: labor, setItems: setLabor } = laborHandlers;
    const { items: packaging, setItems: setPackaging } = packagingHandlers;
    const { items: overheads, setItems: setOverheads } = overheadHandlers;

    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency } = useTheme();
    const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
    const [shareText, setShareText] = useState('');

    useEffect(() => {
        if (initialState) {
            setProductName(initialState.productName || 'My Awesome Product');
            setUnitsProduced(initialState.unitsProduced || '1000');
            setProfitMargin(initialState.profitMargin || '50');
            setMaterials(initialState.materials || []);
            setLabor(initialState.labor || []);
            setPackaging(initialState.packaging || []);
            setOverheads(initialState.overheads || []);
        } else {
             // Set default values for a new instance
            setMaterials([{ id: crypto.randomUUID(), name: 'Raw Material 1', marketPrice: '100', packageSize: '1000', usedAmount: '50' }]);
            setLabor([{ id: crypto.randomUUID(), name: 'Assembly Labor', costType: 'perHour', cost: '200', timePerUnit: '15' }]);
            setPackaging([{ id: crypto.randomUUID(), name: 'Box', cost: '10' }]);
            setOverheads([{ id: crypto.randomUUID(), name: 'Monthly Rent', cost: '20000' }]);
        }
    }, [initialState, setMaterials, setLabor, setPackaging, setOverheads]);

    const calculations = useMemo(() => {
        const numUnits = parseFloat(unitsProduced) || 1;
        const margin = (parseFloat(profitMargin) || 0) / 100;

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
            return sum + (cost / 60) * time; // cost is per hour, time is in minutes
        }, 0);

        const totalPackagingCost = packaging.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
        
        const totalOverheadCost = overheads.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
        const overheadCostPerUnit = totalOverheadCost / numUnits;
        
        const totalCostPerUnit = totalMaterialCost + totalLaborCost + totalPackagingCost + overheadCostPerUnit;
        const recommendedPrice = margin < 1 ? totalCostPerUnit / (1 - margin) : totalCostPerUnit;
        const profitPerUnit = recommendedPrice - totalCostPerUnit;
        const totalProfit = profitPerUnit * numUnits;

        return { totalMaterialCost, totalLaborCost, totalPackagingCost, overheadCostPerUnit, totalCostPerUnit, recommendedPrice, profitPerUnit, totalProfit };
    }, [materials, labor, packaging, overheads, unitsProduced, profitMargin]);

    useEffect(() => {
        const { recommendedPrice, totalProfit, totalCostPerUnit } = calculations;
        setShareText(`Product Cost for "${productName}":\n- Total Cost/Unit: ${formatCurrency(totalCostPerUnit)}\n- Recommended Price/Unit: ${formatCurrency(recommendedPrice)} (for ${profitMargin}% margin)\n- Total Profit for Batch: ${formatCurrency(totalProfit)}`);
    }, [calculations, productName, profitMargin, formatCurrency]);
    
    const handleSaveToHistory = () => {
        addHistory({
            calculator: 'Product Cost Calculator',
            calculation: `Cost for ${productName}: ${formatCurrency(calculations.recommendedPrice)}/unit`,
            inputs: { productName, materials, labor, packaging, overheads, unitsProduced, profitMargin }
        });
    };

    const renderCostSection = <T extends CostItem>(
        title: string,
        items: T[],
        handlers: ReturnType<typeof useCostItemManagement<T>>,
        renderInputs: (item: T, update: (field: keyof Omit<T, 'id'>, value: string) => void) => React.ReactNode
    ) => (
        <div className="animate-fade-in space-y-4">
            <div className="bg-surface-container p-4 rounded-lg space-y-3">
                <h3 className="font-bold text-lg text-center">{title}</h3>
                {items.map(item => (
                    <div key={item.id} className="bg-surface-container-low p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <input
                                type="text"
                                placeholder={`e.g., ${title.slice(0, -1)} Name`}
                                value={item.name}
                                onChange={e => handlers.updateItem(item.id, 'name' as any, e.target.value)}
                                className="font-semibold bg-transparent focus:outline-none w-full"
                            />
                            <button onClick={() => handlers.removeItem(item.id)} className="p-1 rounded-full text-red-500 hover:bg-red-500/10 transition-colors" aria-label="Remove item"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></button>
                        </div>
                        {renderInputs(item, (field, value) => handlers.updateItem(item.id, field, value))}
                    </div>
                ))}
                 <button onClick={handlers.addItem} className="w-full border-2 border-dashed border-outline-variant text-on-surface-variant font-semibold py-2 px-4 rounded-md hover:bg-surface-container-high hover:text-on-surface transition-colors text-sm">+ Add Item</button>
            </div>
        </div>
    );

    const itemInputClasses = "input-base w-full text-sm";
    const TabButton: React.FC<{ name: string; label: string }> = ({ name, label }) => (
        <button onClick={() => setActiveTab(name)} className={`w-1/4 py-2 font-semibold text-sm rounded-md transition-colors ${activeTab === name ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>{label}</button>
    );
    const ResultLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-outline-variant"><span className="text-on-surface-variant">{label}</span><span className="font-bold text-on-surface">{value}</span></div>
    );


    return (
        <div className="space-y-6">
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
                <label htmlFor="productName" className="block text-sm font-medium text-on-surface-variant mb-1">Product Name</label>
                <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} className="input-base w-full text-base p-3" />
            </div>

            <div className="flex space-x-2 bg-surface-container p-1 rounded-lg">
                <TabButton name="materials" label="Materials" />
                <TabButton name="labor" label="Labor" />
                <TabButton name="overheads" label="Overheads" />
                <TabButton name="summary" label="Summary" />
            </div>

            {activeTab === 'materials' && renderCostSection('Materials', materials, materialHandlers, (item, update) => (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div><label className="text-xs text-on-surface-variant flex items-center mb-1">Price <InfoTooltip text="Price for the whole package." /></label><input type="number" placeholder="50" value={item.marketPrice} onChange={e => update('marketPrice', e.target.value)} className={itemInputClasses} /></div>
                    <div><label className="text-xs text-on-surface-variant flex items-center mb-1">Size <InfoTooltip text="Package size (g, kg, m, etc)." /></label><input type="number" placeholder="1000" value={item.packageSize} onChange={e => update('packageSize', e.target.value)} className={itemInputClasses} /></div>
                    <div><label className="text-xs text-on-surface-variant flex items-center mb-1">Used <InfoTooltip text="Amount used per unit." /></label><input type="number" placeholder="200" value={item.usedAmount} onChange={e => update('usedAmount', e.target.value)} className={itemInputClasses} /></div>
                </div>
            ))}
            
            {activeTab === 'labor' && (
                <div className="space-y-4">
                    {renderCostSection('Labor Costs', labor, laborHandlers, (item, update) => (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                           <div className="col-span-2 sm:col-span-1"><label className="text-xs text-on-surface-variant mb-1">Cost Type</label>
                                <select value={item.costType} onChange={e => update('costType', e.target.value)} className={`${itemInputClasses} select-base`}>
                                    <option value="perUnit">Per Unit</option><option value="perHour">Per Hour</option>
                                </select>
                            </div>
                           <div><label className="text-xs text-on-surface-variant mb-1">Cost ({item.costType === 'perUnit' ? 'per Unit' : 'per hr'})</label><input type="number" value={item.cost} onChange={e => update('cost', e.target.value)} className={itemInputClasses}/></div>
                           {item.costType === 'perHour' && <div><label className="text-xs text-on-surface-variant mb-1">Time (mins/unit)</label><input type="number" value={item.timePerUnit} onChange={e => update('timePerUnit', e.target.value)} className={itemInputClasses}/></div>}
                        </div>
                    ))}
                     {renderCostSection('Packaging Costs', packaging, packagingHandlers, (item, update) => (
                         <div><label className="text-xs text-on-surface-variant mb-1">Cost Per Unit</label><input type="number" value={item.cost} onChange={e => update('cost', e.target.value)} className={itemInputClasses}/></div>
                    ))}
                </div>
            )}
            
             {activeTab === 'overheads' && renderCostSection('Overheads', overheads, overheadHandlers, (item, update) => (
                 <div><label className="text-xs text-on-surface-variant mb-1">Cost for Batch</label><input type="number" placeholder="e.g., Rent" value={item.cost} onChange={e => update('cost', e.target.value)} className={itemInputClasses}/></div>
            ))}

            {activeTab === 'summary' && (
                <div className="animate-fade-in space-y-4">
                    <div className="p-4 bg-surface-container rounded-lg space-y-4">
                        <h3 className="font-bold text-center text-lg">Summary Inputs</h3>
                        <div><div className="flex items-center space-x-2 mb-1"><label className="text-sm font-medium text-on-surface-variant">Units Produced in Batch</label><InfoTooltip text="How many items are produced with the listed overhead costs." /></div><input type="number" value={unitsProduced} onChange={e => setUnitsProduced(e.target.value)} className={`${itemInputClasses} p-3 text-base`} /></div>
                        <div><div className="flex items-center space-x-2 mb-1"><label className="text-sm font-medium text-on-surface-variant">Desired Profit Margin (%)</label><InfoTooltip text="The percentage of the selling price that is profit." /></div><input type="number" value={profitMargin} onChange={e => setProfitMargin(e.target.value)} className={`${itemInputClasses} p-3 text-base`} /></div>
                    </div>
                    <div id="product-cost-pie-chart" className="p-4 bg-surface-container rounded-lg">
                        <h3 className="font-bold text-center text-lg mb-4">Cost Breakdown</h3>
                        <PieChart data={[
                            { label: 'Materials', value: calculations.totalMaterialCost, color: '#3b82f6' },
                            { label: 'Labor', value: calculations.totalLaborCost, color: '#16a34a' },
                            { label: 'Packaging', value: calculations.totalPackagingCost, color: '#f97316' },
                            { label: 'Overheads', value: calculations.overheadCostPerUnit, color: '#9333ea' }
                        ]}/>
                    </div>
                    <div className="p-4 bg-surface-container rounded-lg">
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
                    <div className="p-4 bg-surface-container rounded-lg space-y-2">
                        <ResultLine label="Profit / Unit" value={formatCurrency(calculations.profitPerUnit)} />
                        <ResultLine label="Total Profit (for batch)" value={formatCurrency(calculations.totalProfit)} />
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center pt-2">
                <button onClick={handleSaveToHistory} className="btn-primary font-bold py-2 px-4 rounded-md shadow-lg">Save Calculation</button>
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
