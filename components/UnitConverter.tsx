import React, { useState, useEffect, useMemo, useContext } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

const conversionFactors = {
  Length: {
    Meter: 1,
    Kilometer: 1000,
    Centimeter: 0.01,
    Millimeter: 0.001,
    Mile: 1609.34,
    Yard: 0.9144,
    Foot: 0.3048,
    Inch: 0.0254,
  },
  Mass: {
    Gram: 1,
    Kilogram: 1000,
    Milligram: 0.001,
    Pound: 453.592,
    Ounce: 28.3495,
  },
  Temperature: {
    Celsius: 'Celsius',
    Fahrenheit: 'Fahrenheit',
    Kelvin: 'Kelvin',
  },
};

type Category = keyof typeof conversionFactors;
type Unit<C extends Category> = keyof (typeof conversionFactors)[C];

interface UnitConverterState {
    category: Category;
    fromUnit: string;
    toUnit: string;
    inputValue: string;
}

interface UnitConverterProps {
    initialState?: UnitConverterState;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ initialState }) => {
  const [category, setCategory] = useState<Category>('Length');
  const [fromUnit, setFromUnit] = useState<string>('Meter');
  const [toUnit, setToUnit] = useState<string>('Foot');
  const [inputValue, setInputValue] = useState('1');
  const [outputValue, setOutputValue] = useState('');
  const [shareText, setShareText] = useState('');
  const { addHistory } = useContext(HistoryContext);

  const units = useMemo(() => Object.keys(conversionFactors[category]), [category]);

  useEffect(() => {
    if (initialState) {
        setCategory(initialState.category || 'Length');
        setFromUnit(initialState.fromUnit || 'Meter');
        setToUnit(initialState.toUnit || 'Foot');
        setInputValue(initialState.inputValue || '1');
    }
  }, [initialState]);

  useEffect(() => {
    if (!initialState) { // Avoid resetting units if we are restoring state
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
    }
  }, [category, units, initialState]);
  
  useEffect(() => {
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
        setOutputValue('');
        return;
    }

    let result: number;
    if (category === 'Temperature') {
        let celsius: number;
        switch (fromUnit) {
            case 'Fahrenheit': celsius = (input - 32) * 5/9; break;
            case 'Kelvin': celsius = input - 273.15; break;
            default: celsius = input;
        }

        switch (toUnit) {
            case 'Fahrenheit': result = (celsius * 9/5) + 32; break;
            case 'Kelvin': result = celsius + 273.15; break;
            default: result = celsius;
        }
    } else {
        const fromFactor = conversionFactors[category][fromUnit] as number;
        const toFactor = conversionFactors[category][toUnit] as number;
        result = (input * fromFactor) / toFactor;
    }
    
    const finalOutput = parseFloat(result.toPrecision(6)).toString();
    setOutputValue(finalOutput);
    setShareText(`Unit Conversion:\n${input} ${fromUnit} = ${finalOutput} ${toUnit}`);
  }, [inputValue, fromUnit, toUnit, category]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };
  
  const handleSaveHistory = () => {
    if (inputValue && outputValue) {
      addHistory({
        calculator: 'Unit Converter',
        calculation: `${inputValue} ${fromUnit} = ${outputValue} ${toUnit}`,
        inputs: { category, fromUnit, toUnit, inputValue }
      });
    }
  };

  const commonSelectClasses = "w-full bg-theme-secondary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition";

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-theme-secondary mb-1">Category</label>
        <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className={commonSelectClasses}>
          {Object.keys(conversionFactors).map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-full">
          <label htmlFor="fromUnit" className="block text-sm font-medium text-theme-secondary mb-1">From</label>
          <select id="fromUnit" value={fromUnit} onChange={e => setFromUnit(e.target.value)} className={commonSelectClasses}>
            {units.map(unit => <option key={unit}>{unit}</option>)}
          </select>
          <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className={`${commonSelectClasses} mt-2`} />
        </div>

        <button onClick={handleSwap} className="mt-8 p-2 rounded-full bg-theme-tertiary hover:bg-primary transition text-theme-primary hover:text-on-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        </button>

        <div className="w-full">
          <label htmlFor="toUnit" className="block text-sm font-medium text-theme-secondary mb-1">To</label>
          <select id="toUnit" value={toUnit} onChange={e => setToUnit(e.target.value)} className={commonSelectClasses}>
            {units.map(unit => <option key={unit}>{unit}</option>)}
          </select>
          <input type="text" value={outputValue} readOnly className={`${commonSelectClasses} mt-2 bg-theme-primary cursor-not-allowed`} placeholder="Result" />
        </div>
      </div>
      <div className="text-center">
        <button onClick={handleSaveHistory} className="bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-primary ring-primary">
            Save to History
        </button>
      </div>
       <ShareButton textToShare={shareText} />
    </div>
  );
};

export default UnitConverter;