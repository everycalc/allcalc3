
import React, { useState, useContext } from 'react';
import Display from './Display';
import CalculatorButton from './CalculatorButton';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';

const ScientificCalculator: React.FC = () => {
    const [displayValue, setDisplayValue] = useState('0');
    const [previousValue, setPreviousValue] = useState<null | number>(null);
    const [operator, setOperator] = useState<null | string>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [subDisplay, setSubDisplay] = useState('');
    const [isDeg, setIsDeg] = useState(true);
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
    
    const performCalculation = (isEquals: boolean = false) => {
        const inputValue = parseFloat(displayValue);
        if (previousValue === null || operator === null) return;
    
        const calculations: { [key: string]: (a: number, b: number) => number } = {
            '/': (a, b) => a / b,
            '*': (a, b) => a * b,
            '-': (a, b) => a - b,
            '+': (a, b) => a + b,
            'y^x': (a, b) => Math.pow(a, b),
        };
    
        if (operator in calculations) {
            const result = calculations[operator](previousValue, inputValue);
            const resultString = String(parseFloat(result.toPrecision(15)));
            const calculationText = `${previousValue} ${operator === 'y^x' ? '^' : operator} ${inputValue} = ${resultString}`;

            if (isEquals) {
                addHistory({
                    calculator: 'Scientific Calculator',
                    calculation: calculationText,
                    inputs: null
                });
                setShareText(`Scientific Calculation:\n${calculationText}`);
                setSubDisplay('');
                setPreviousValue(null);
                setOperator(null);
            } else {
                setSubDisplay(`${resultString} ${operator}`);
                setPreviousValue(result);
                setShareText('');
            }
            setDisplayValue(resultString);
        }
    };

    const handleOperator = (nextOperator: string) => {
        const inputValue = parseFloat(displayValue);
    
        if (operator && waitingForOperand) {
            setOperator(nextOperator);
            setSubDisplay(`${previousValue} ${nextOperator}`);
            return;
        }
    
        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            performCalculation();
        }
    
        setWaitingForOperand(true);
        setOperator(nextOperator);
        setSubDisplay(`${displayValue} ${nextOperator}`);
    };

    const handleEquals = () => {
        if (operator && previousValue !== null && !waitingForOperand) {
            performCalculation(true);
            setWaitingForOperand(true);
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

    const handleUnary = (operation: (a: number) => number, opString?: string) => {
        const value = parseFloat(displayValue);
        const result = operation(value);
        const resultString = String(parseFloat(result.toPrecision(15)));
        const calculationString = `${opString || ''}(${displayValue}) = ${resultString}`;
        
        addHistory({
          calculator: 'Scientific Calculator',
          calculation: calculationString,
          inputs: null
        });
        setShareText(`Scientific Calculation:\n${calculationString}`);

        setSubDisplay(calculationString);
        setDisplayValue(resultString);
        setWaitingForOperand(true);
    };
    
    const handleClick = (label: string) => {
        if ('0123456789'.includes(label)) handleDigit(label);
        else if (label === '.') handleDecimal();
        else if (label === 'AC') handleClear();
        else if (label === '=') handleEquals();
        else if ('/*-+y^x'.includes(label)) handleOperator(label);
        else if (label === 'x²') handleUnary(x => x * x, `sqr`);
        else if (label === '√x') handleUnary(x => Math.sqrt(x), `√`);
        else if (label === 'sin') handleUnary(x => isDeg ? Math.sin(x * Math.PI / 180) : Math.sin(x), 'sin');
        else if (label === 'cos') handleUnary(x => isDeg ? Math.cos(x * Math.PI / 180) : Math.cos(x), 'cos');
        else if (label === 'tan') handleUnary(x => isDeg ? Math.tan(x * Math.PI / 180) : Math.tan(x), 'tan');
        else if (label === 'log') handleUnary(x => Math.log10(x), 'log');
        else if (label === 'ln') handleUnary(x => Math.log(x), 'ln');
        else if (label === 'π') { setDisplayValue(String(Math.PI)); setWaitingForOperand(false); }
        else if (label === 'e') { setDisplayValue(String(Math.E)); setWaitingForOperand(false); }
        else if (label === 'Deg/Rad') setIsDeg(!isDeg);
    };

  return (
    <div>
      <Display value={displayValue} subValue={subDisplay} />
      <div className="grid grid-cols-5 gap-2">
        <CalculatorButton label={isDeg ? 'Deg' : 'Rad'} onClick={() => setIsDeg(!isDeg)} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="sin" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="cos" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="tan" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="AC" onClick={handleClick} className="bg-red-500 text-white hover:bg-red-400" />
        
        <CalculatorButton label="ln" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="log" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="π" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="e" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="/" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />

        <CalculatorButton label="x²" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="7" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="8" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="9" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="*" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />

        <CalculatorButton label="√x" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="4" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="5" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="6" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="-" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />

        <CalculatorButton label="y^x" onClick={handleClick} className="bg-theme-tertiary text-theme-primary hover:bg-opacity-80" />
        <CalculatorButton label="1" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="2" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="3" onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="+" onClick={handleClick} className="bg-accent text-white hover:bg-accent-dark" />

        <CalculatorButton label="0" onClick={handleClick} className="col-span-2 bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="." onClick={handleClick} className="bg-theme-secondary text-theme-primary hover:bg-theme-tertiary" />
        <CalculatorButton label="=" onClick={handleClick} className="col-span-2 bg-primary text-on-primary hover:bg-primary-light" />
      </div>
      {shareText && <ShareButton textToShare={shareText} />}
    </div>
  );
};

export default ScientificCalculator;