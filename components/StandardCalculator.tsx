import React, { useState, useContext } from 'react';
import Display from './Display';
import CalculatorButton from './CalculatorButton';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';
import VoiceInputButton from './VoiceInputButton';
import { useAd } from '../contexts/AdContext';
import { useFuel } from '../contexts/FuelContext';
import InterstitialAdModal from './InterstitialAdModal';

const StandardCalculator: React.FC<{ isPremium?: boolean }> = ({ isPremium }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<null | number>(null);
  const [operator, setOperator] = useState<null | string>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [subDisplay, setSubDisplay] = useState('');
  const [shareText, setShareText] = useState('');

  const [pendingCalculation, setPendingCalculation] = useState<(() => void) | null>(null);
  const [showAd, setShowAd] = useState(false);

  const { addHistory } = useContext(HistoryContext);
  const { shouldShowAd } = useAd();
  const { fuel, consumeFuel } = useFuel();
  const fuelCost = isPremium ? 2 : 1;

  const handleAdClose = () => {
    setShowAd(false);
    if (pendingCalculation) {
      pendingCalculation();
      setPendingCalculation(null);
    }
  };

  const withAdCheck = (calculationFn: () => void) => {
    if (fuel >= fuelCost) {
      consumeFuel(fuelCost);
      calculationFn();
    } else {
      if (shouldShowAd(isPremium)) {
        setPendingCalculation(() => calculationFn);
        setShowAd(true);
      } else {
        calculationFn();
      }
    }
  };

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const performCalculation = (nextOperator?: string) => {
    const inputValue = parseFloat(displayValue);

    if (previousValue === null || operator === null) {
      if (nextOperator) {
        setPreviousValue(inputValue);
        setWaitingForOperand(true);
        setOperator(nextOperator);
        setSubDisplay(`${inputValue} ${nextOperator}`);
      }
      return;
    };
    
    const calculations: {[key: string]: (a: number, b: number) => number} = {
      '/': (a, b) => a / b,
      '*': (a, b) => a * b,
      '-': (a, b) => a - b,
      '+': (a, b) => a + b,
    };

    if(!calculations[operator]) return;

    const result = calculations[operator](previousValue, inputValue);
    const resultString = String(parseFloat(result.toPrecision(15)));
    
    if (nextOperator !== '=') {
        setSubDisplay(`${result} ${nextOperator}`);
        setPreviousValue(result);
        setOperator(nextOperator);
        setShareText('');
    } else {
        const calculationText = `${previousValue} ${operator} ${inputValue} = ${resultString}`;
        addHistory({
          calculator: 'Standard Calculator',
          calculation: calculationText,
          inputs: null
        });
        setShareText(`Standard Calculation:\n${calculationText}`);
        setSubDisplay('');
        setPreviousValue(null);
        setOperator(null);
    }
    
    setDisplayValue(resultString);
    setWaitingForOperand(true);
  };

  const handleOperator = (nextOperator: string) => {
    if (operator && waitingForOperand) {
      setOperator(nextOperator);
      if (previousValue !== null) {
        setSubDisplay(`${previousValue} ${nextOperator}`);
      }
      return;
    }
    
    const calculationFn = () => performCalculation(nextOperator);

    if (previousValue !== null && !waitingForOperand) {
        withAdCheck(calculationFn);
    } else {
        const inputValue = parseFloat(displayValue);
        setPreviousValue(inputValue);
        setWaitingForOperand(true);
        setOperator(nextOperator);
        setSubDisplay(`${inputValue} ${nextOperator}`);
    }
  };
  
  const handleEquals = () => {
    if (operator && previousValue !== null && !waitingForOperand) {
        withAdCheck(() => performCalculation('='));
    }
  }

  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setSubDisplay('');
    setShareText('');
  };

  const handlePlusMinus = () => {
    setDisplayValue(String(parseFloat(displayValue) * -1));
  };
  
  const handlePercent = () => {
    const calculationFn = () => {
        const currentValue = parseFloat(displayValue);
        let result;
        if (previousValue !== null && (operator === '+' || operator === '-')) {
            result = previousValue * (currentValue / 100);
        } else if (previousValue !== null && (operator === '*' || operator === '/')) {
            result = currentValue / 100;
        } else {
            result = currentValue / 100;
        }
        setDisplayValue(String(result));
    };
    withAdCheck(calculationFn);
  };

  const handleClick = (label: string) => {
    if ('0123456789'.includes(label)) {
      handleDigit(label);
    } else if (label === '.') {
      handleDecimal();
    } else if (label === 'C') {
      handleClear();
    } else if (label === '+/-') {
      handlePlusMinus();
    } else if (label === '%') {
      handlePercent();
    } else if (label === '=') {
        handleEquals();
    } else if ('/*-+'.includes(label)) {
      handleOperator(label);
    }
  };

  const handleVoiceInput = (transcript: string) => {
      const cleaned = transcript.toLowerCase().replace(/point/g, '.').replace(/x/g, '*').trim();
      
      // Simple command parsing
      if (cleaned.includes('clear')) return handleClear();
      if (cleaned.includes('equals') || cleaned.includes('equal')) return handleEquals();
      if (cleaned.includes('plus')) return handleOperator('+');
      if (cleaned.includes('minus')) return handleOperator('-');
      if (cleaned.includes('times')) return handleOperator('*');
      if (cleaned.includes('divided by')) return handleOperator('/');

      // Number parsing
      const numbers = cleaned.match(/[\d.]+/g);
      if (numbers) {
          const spokenNumber = numbers.join('');
          if (waitingForOperand) {
              setDisplayValue(spokenNumber);
              setWaitingForOperand(false);
          } else {
              setDisplayValue(displayValue === '0' ? spokenNumber : displayValue + spokenNumber);
          }
      }
  };

  return (
    <div>
      {showAd && <InterstitialAdModal onClose={handleAdClose} />}
      <Display value={displayValue} subValue={subDisplay} />
      <div className="grid grid-cols-4 gap-4">
        <CalculatorButton label="C" onClick={handleClick} className="btn-action" />
        <CalculatorButton label="+/-" onClick={handleClick} className="btn-action" />
        <CalculatorButton label="%" onClick={handleClick} className="btn-action" />
        <CalculatorButton label="/" onClick={handleClick} className="btn-operator" />
        
        <CalculatorButton label="7" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="8" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="9" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="*" onClick={handleClick} className="btn-operator" />

        <CalculatorButton label="4" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="5" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="6" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="-" onClick={handleClick} className="btn-operator" />
        
        <CalculatorButton label="1" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="2" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="3" onClick={handleClick} className="btn-number" />
        <CalculatorButton label="+" onClick={handleClick} className="btn-operator" />

        <div className="col-span-2 grid grid-cols-2 gap-4">
            <CalculatorButton label="0" onClick={handleClick} className="col-span-1 btn-number" />
            <VoiceInputButton onTranscript={handleVoiceInput} />
        </div>
        <CalculatorButton label="." onClick={handleClick} className="btn-number" />
        <CalculatorButton label="=" onClick={handleClick} className="btn-equals" />
      </div>
      {shareText && <ShareButton textToShare={shareText} />}
    </div>
  );
};

export default StandardCalculator;