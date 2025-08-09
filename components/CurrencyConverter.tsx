import React, { useState, useEffect, useContext } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

// NOTE: This is a placeholder with static rates.
// For a real app, you would fetch these rates from an API.
const staticRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.3,
  JPY: 157.0,
  AUD: 1.5,
  CAD: 1.37,
};

type Currency = keyof typeof staticRates;

const CurrencyConverter: React.FC<{initialState?: any; isPremium?: boolean}> = ({initialState, isPremium}) => {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('INR');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState('');
  const [shareText, setShareText] = useState('');
  const { addHistory } = useContext(HistoryContext);

  useEffect(() => {
    if (initialState) {
        setFromCurrency(initialState.fromCurrency || 'USD');
        setToCurrency(initialState.toCurrency || 'INR');
        setAmount(initialState.amount || '100');
        setResult('');
    }
  }, [initialState]);

  const handleConvert = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      setResult('');
      return;
    }
    const rateFrom = staticRates[fromCurrency];
    const rateTo = staticRates[toCurrency];
    const convertedAmount = (amt / rateFrom) * rateTo;
    const finalResult = convertedAmount.toFixed(2);
    
    setShareText(`Currency Conversion:\n${amt} ${fromCurrency} = ${finalResult} ${toCurrency}`);
    addHistory({
        calculator: 'Currency Converter',
        calculation: `${amount} ${fromCurrency} = ${finalResult} ${toCurrency}`,
        inputs: { fromCurrency, toCurrency, amount }
    });
    setResult(finalResult);
  };

  const handleSwap = () => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm">
        <strong>Note:</strong> Currency rates are static placeholders. For live rates, you would need to integrate a currency API service.
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-full space-y-2">
            <label className="text-sm font-medium text-on-surface-variant mb-1">From</label>
            <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value as Currency)} className="select-base w-full">
                {Object.keys(staticRates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
            </select>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-base w-full" />
        </div>
        <button onClick={handleSwap} className="btn-secondary mt-8 p-2 rounded-full transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>
        <div className="w-full space-y-2">
            <label className="text-sm font-medium text-on-surface-variant mb-1">To</label>
            <select value={toCurrency} onChange={e => setToCurrency(e.target.value as Currency)} className="select-base w-full">
                {Object.keys(staticRates).map(curr => <option key={curr} value={curr}>{curr}</option>)}
            </select>
            <input type="text" value={result} readOnly className="input-base w-full bg-surface-container cursor-not-allowed" placeholder="Result" />
        </div>
      </div>
      <div className="text-center">
        <button onClick={handleConvert} className="btn-primary font-bold py-2 px-4 rounded-md shadow-lg">
            Convert
        </button>
      </div>
      {result && <ShareButton textToShare={shareText} />}
    </div>
  );
};

export default CurrencyConverter;
