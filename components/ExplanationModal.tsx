import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useTheme } from '../contexts/ThemeContext';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorName: string;
  inputs: any;
  result: any;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({ isOpen, onClose, calculatorName, inputs, result }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { formatCurrency } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const generatePrompt = () => {
    const inputsString = JSON.stringify(inputs);
    const resultString = JSON.stringify(result);

    // *** CRITICAL: Special handling for Break-Even ROAS Calculator to protect the formula ***
    if (calculatorName === 'Break-Even ROAS Calculator') {
      return `
        The user wants to understand their Break-Even ROAS calculation.
        Their inputs were: ${inputsString}
        The calculated result is: Break-Even ROAS of ${result.breakEvenROAS.toFixed(2)}.
        
        Explain what Break-Even ROAS means for a business in simple terms.
        Describe what the calculated value of ${result.breakEvenROAS.toFixed(2)} signifies for their specific situation (e.g., "For every dollar you spend on ads, you need to make back X to break even.").
        
        IMPORTANT: Do NOT reveal or describe the mathematical formula used to calculate this. Focus only on the concept and the interpretation of the result. Keep the response concise and friendly.
      `;
    }
    
    // Actionable insights for profit margin
    if (calculatorName === 'Profit Margin Calculator') {
        const margin = result.profitMargin.toFixed(2);
        return `
            A user calculated their profit margin.
            Inputs: Revenue of ${formatCurrency(parseFloat(inputs.revenue))}, COGS of ${formatCurrency(parseFloat(inputs.cogs))}.
            Result: Gross Profit of ${formatCurrency(result.grossProfit)}, Profit Margin of ${margin}%.
            
            Explain what a ${margin}% profit margin means in simple terms.
            Then, if the profit margin is below 20%, provide one brief, actionable suggestion on how a business could improve it. Keep the entire response friendly and concise.
        `;
    }

    // Default prompt for other calculators
    return `
        A user wants to understand a calculation from a calculator app.
        Calculator Name: ${calculatorName}
        User Inputs: ${inputsString}
        Calculation Result: ${resultString}

        Please provide a simple, step-by-step explanation of how the result was calculated based on the inputs. 
        Start with the formula used, then substitute the input values, and show the final result.
        Keep the explanation clear, concise, and easy for a non-expert to understand. Use Markdown for formatting like bolding and lists.
    `;
  };

  useEffect(() => {
    if (isOpen) {
      const fetchExplanation = async () => {
        setIsLoading(true);
        setError('');
        setExplanation('');
        
        if (!process.env.API_KEY) {
            setError("API key is not configured. This feature is unavailable.");
            setIsLoading(false);
            return;
        }

        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = generatePrompt();

          const genAIResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.4,
            }
          });
          
          // Basic markdown to HTML conversion
          let html = genAIResponse.text
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
              .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
              .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code blocks
              .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
              .replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>') // Lists (simple)
              .replace(/\n/g, '<br />'); // Newlines

          setExplanation(html);

        } catch (err: any) {
          console.error("Gemini API Error:", err);
          setError("Sorry, we couldn't generate an explanation right now. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchExplanation();
    }
  }, [isOpen, calculatorName, inputs, result]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-2xl bg-theme-secondary rounded-xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="explanation-modal-title"
      >
        <header className="flex justify-between items-center p-4 border-b border-theme">
          <h2 id="explanation-modal-title" className="text-xl font-bold text-theme-primary">Calculation Explained</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 text-theme-secondary" aria-label="Close explanation">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        <main className="p-6 max-h-[60vh] overflow-y-auto">
            {isLoading && (
                <div className="flex items-center justify-center space-x-2 text-theme-primary">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Generating explanation with AI...</p>
                </div>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!isLoading && !error && explanation && (
                <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: explanation }} />
            )}
        </main>
      </div>
    </div>
  );
};

export default ExplanationModal;