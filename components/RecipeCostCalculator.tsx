
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';
import InfoTooltip from './InfoTooltip';
import ShareButton from './ShareButton';
import { useAd } from '../contexts/AdContext';
import InterstitialAdModal from './InterstitialAdModal';

interface Ingredient {
  id: string;
  name:string;
  marketPrice: string;
  packageSize: string;
  usedAmount: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

const createNewRecipe = (): Recipe => ({
  id: crypto.randomUUID(),
  name: 'New Recipe',
  ingredients: [{
    id: crypto.randomUUID(),
    name: 'Flour',
    marketPrice: '50',
    packageSize: '1000',
    usedAmount: '500',
  }]
});

const SavedRecipeList: React.FC<{onLoad: (recipe: Recipe) => void}> = ({ onLoad }) => {
    const { history } = useContext(HistoryContext);
    const { formatCurrency } = useTheme();

    const savedRecipes = useMemo(() => {
        return history
            .filter(entry => entry.calculator === 'Recipe Cost Calculator' && entry.inputs?.id)
            .map(entry => entry.inputs as Recipe);
    }, [history]);
    
    if (savedRecipes.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-theme-primary mb-4">Saved Recipes</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {savedRecipes.map(recipe => (
                    <button 
                        key={recipe.id}
                        onClick={() => onLoad(recipe)}
                        className="w-full text-left bg-theme-secondary p-3 rounded-lg hover:bg-theme-tertiary transition-colors"
                    >
                        <p className="font-semibold text-theme-primary">{recipe.name}</p>
                        <p className="text-xs text-primary">{`Cost: ${formatCurrency(parseFloat(history.find(h => h.inputs.id === recipe.id)?.calculation.split(':').pop()?.replace(/[^0-9.]/g, '') || '0'))}`}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};


const RecipeCostCalculator: React.FC<{initialState?: Recipe}> = ({initialState}) => {
    const [recipe, setRecipe] = useState<Recipe>(createNewRecipe());
    const [activeIngredientId, setActiveIngredientId] = useState<string | null>(null);
    
    const { addHistory } = useContext(HistoryContext);
    const { formatCurrency } = useTheme();
    const { shouldShowAd } = useAd();
    const [showAd, setShowAd] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const loadRecipe = (recipeToLoad: Recipe) => {
        setRecipe(recipeToLoad);
        setActiveIngredientId(recipeToLoad.ingredients[0]?.id || null);
        // Scroll to top
        window.scrollTo(0, 0);
    };
    
    useEffect(() => {
        if (initialState && initialState.id) {
            loadRecipe(initialState);
        } else {
            setActiveIngredientId(recipe.ingredients[0]?.id || null);
        }
    }, [initialState]);


    const calculations = useMemo(() => {
        const perIngredientCosts = recipe.ingredients.map(ing => {
            const marketPrice = parseFloat(ing.marketPrice);
            const packageSize = parseFloat(ing.packageSize);
            const usedAmount = parseFloat(ing.usedAmount);
            if (isNaN(marketPrice) || isNaN(packageSize) || isNaN(usedAmount) || packageSize === 0) {
                return { id: ing.id, cost: 0 };
            }
            const cost = (marketPrice / packageSize) * usedAmount;
            return { id: ing.id, cost };
        });

        const totalCost = perIngredientCosts.reduce((sum, item) => sum + item.cost, 0);

        return { perIngredientCosts, totalCost };
    }, [recipe.ingredients]);

    const handleRecipeNameChange = (name: string) => {
        setRecipe(prev => ({...prev, name}));
    };

    const handleAddIngredient = () => {
        const newIngredient: Ingredient = {
            id: crypto.randomUUID(), name: '', marketPrice: '', packageSize: '', usedAmount: '',
        };
        setRecipe(prev => ({...prev, ingredients: [...prev.ingredients, newIngredient]}));
        setActiveIngredientId(newIngredient.id);
    };
    
    const handleRemoveIngredient = (e: React.MouseEvent, ingredientId: string) => {
        e.stopPropagation(); // Prevent the details from toggling
        setRecipe(prev => ({...prev, ingredients: prev.ingredients.filter(i => i.id !== ingredientId)}));
    };
    
    const handleIngredientChange = (ingredientId: string, field: keyof Omit<Ingredient, 'id'>, value: string) => {
        setRecipe(prev => ({
            ...prev,
            ingredients: prev.ingredients.map(i => i.id === ingredientId ? {...i, [field]: value} : i)
        }));
    };
    
    const shareText = useMemo(() => {
        const { totalCost } = calculations;
        let ingredientList = recipe.ingredients.map(ing => {
            const costData = calculations.perIngredientCosts.find(c => c.id === ing.id);
            const cost = costData ? costData.cost : 0;
            return `- ${ing.name || 'Unnamed'}: ${formatCurrency(cost)}`;
        }).join('\n');

        return `Recipe Cost for "${recipe.name}":\n\nIngredients Cost:\n${ingredientList}\n\nTotal Cost: ${formatCurrency(totalCost)}`;
    }, [recipe, calculations, formatCurrency]);

    const saveAction = () => {
        addHistory({
            calculator: 'Recipe Cost Calculator',
            calculation: `Recipe: ${recipe.name}, Cost: ${formatCurrency(calculations.totalCost)}`,
            inputs: recipe // Save the whole recipe object
        });
    }

    const handleSaveToHistory = () => {
        if (shouldShowAd()) {
            setPendingAction(() => saveAction);
            setShowAd(true);
        } else {
            saveAction();
        }
    };

    const handleAdClose = () => {
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
        setShowAd(false);
    };
    
    const itemInputClasses = "w-full bg-theme-primary text-theme-primary border-theme rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition text-sm";
    
    return (
        <div className="space-y-4">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}

            <div className="bg-theme-secondary p-4 rounded-lg space-y-4">
                <input 
                    type="text" 
                    value={recipe.name} 
                    onChange={e => handleRecipeNameChange(e.target.value)} 
                    className="text-xl font-bold bg-transparent focus:outline-none w-full text-theme-primary border-b-2 border-transparent focus:border-primary transition-colors" 
                    placeholder="Recipe Name"
                />
                
                 <div className="space-y-2">
                    {recipe.ingredients.map(ing => {
                       const ingCost = calculations.perIngredientCosts.find(c => c.id === ing.id)?.cost ?? 0;
                       const isActive = activeIngredientId === ing.id;
                       return (
                         <details key={ing.id} open={isActive} className="bg-theme-primary rounded-lg overflow-hidden" onToggle={(e) => { if (e.currentTarget.open) setActiveIngredientId(ing.id); }}>
                            <summary className="p-3 cursor-pointer flex justify-between items-center list-none" onClick={(e) => { e.preventDefault(); setActiveIngredientId(isActive ? null : ing.id); }}>
                                <span className="font-semibold text-theme-primary truncate pr-2">{ing.name || 'New Ingredient'}</span>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <span className="font-semibold text-primary text-sm">{formatCurrency(ingCost)}</span>
                                    <button onClick={(e) => handleRemoveIngredient(e, ing.id)} className="p-1 rounded-full text-red-500 hover:bg-red-500/10 transition-colors z-10" aria-label="Remove item"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-theme-secondary transition-transform ${isActive ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </div>
                            </summary>
                            <div className="p-3 border-t border-theme-secondary space-y-2">
                                <input type="text" placeholder="e.g., Flour" value={ing.name} onChange={e => handleIngredientChange(ing.id, 'name', e.target.value)} className={itemInputClasses} />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div><label className="text-xs text-theme-secondary flex items-center mb-1">Price <InfoTooltip text="Price for the whole package." /></label><input type="number" placeholder="e.g., 50" value={ing.marketPrice} onChange={e => handleIngredientChange(ing.id, 'marketPrice', e.target.value)} className={itemInputClasses} /></div>
                                    <div><label className="text-xs text-theme-secondary flex items-center mb-1">Size <InfoTooltip text="Package size (g, kg, ml, etc)." /></label><input type="number" placeholder="e.g., 1000" value={ing.packageSize} onChange={e => handleIngredientChange(ing.id, 'packageSize', e.target.value)} className={itemInputClasses} /></div>
                                    <div><label className="text-xs text-theme-secondary flex items-center mb-1">Used <InfoTooltip text="Amount used in recipe." /></label><input type="number" placeholder="e.g., 500" value={ing.usedAmount} onChange={e => handleIngredientChange(ing.id, 'usedAmount', e.target.value)} className={itemInputClasses} /></div>
                                </div>
                            </div>
                         </details>
                       )
                    })}
                </div>
                <button onClick={handleAddIngredient} className="w-full border-2 border-dashed border-theme-tertiary text-theme-secondary font-semibold py-2 px-4 rounded-md hover:bg-theme-primary hover:text-theme-primary transition-colors text-sm">+ Add Ingredient</button>

                <div className="flex justify-between items-center border-t border-theme pt-3 mt-3">
                    <div className="text-right flex-grow">
                        <h4 className="text-sm font-semibold text-theme-secondary">Total Recipe Cost</h4>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(calculations.totalCost)}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
                <button onClick={handleSaveToHistory} className="bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors shadow-lg">Save Recipe</button>
                <ShareButton textToShare={shareText} />
            </div>

            <SavedRecipeList onLoad={loadRecipe} />
        </div>
    );
};

export default RecipeCostCalculator;
