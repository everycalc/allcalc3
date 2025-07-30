import React, { useState, useContext } from 'react';
import Display from './Display';
import CalculatorButton from './CalculatorButton';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

const StandardCalculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<null | number>(null);
  const [operator, setOperator] = useState<null | string>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [subDisplay, setSubDisplay] = useState('');
  const [shareText, setShareText] = useState('');
  const { addHistory } = useContext(HistoryContext);

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
    
    if (previousValue !== null && !waitingForOperand) {
        performCalculation(nextOperator);
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
        performCalculation('=');
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

  return (
    <div>
      <Display value={displayValue} subValue={subDisplay} />
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        <CalculatorButton label="C" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="+/-" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="%" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="/" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />
        
        <CalculatorButton label="7" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="8" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="9" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="*" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />

        <CalculatorButton label="4" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="5" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="6" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="-" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />
        
        <CalculatorButton label="1" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="2" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="3" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="+" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />

        <CalculatorButton label="0" onClick={handleClick} className="col-span-2 bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="." onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="=" onClick={handleClick} className="bg-primary text-on-primary hover:bg-primary-light" />
      </div>
      {shareText && <ShareButton textToShare={shareText} />}
    </div>
  );
};

export default StandardCalculator;