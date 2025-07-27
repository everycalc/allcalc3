import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

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

  const resetState = () => {
      setFeedback('');
      setIsSubmitting(false);
      setResponse('');
      setError('');
  }

  const handleClose = () => {
    resetState();
    onClose();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please enter your feedback.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const model = 'gemini-2.5-flash';
      
      const genAIResponse = await ai.models.generateContent({
        model: model,
        contents: `A user provided the following feedback for a calculator app: "${feedback}". Acknowledge their feedback in a friendly and helpful tone. If they are requesting a calculator, tell them their request has been noted for future consideration. Keep the response concise.`,
        config: {
            temperature: 0.5,
        }
      });
      
      setResponse(genAIResponse.text);

    } catch (err: any) {
      console.error("Gemini API Error:", err);
      setResponse("Sorry, we couldn't process your feedback at the moment. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-lg bg-theme-secondary rounded-xl shadow-2xl p-6 transform transition-transform animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-theme-primary">Feedback & Requests</h2>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-black/10 text-theme-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {response ? (
            <div className="text-center space-y-4">
                <p className="text-theme-primary">{response}</p>
                <button onClick={handleClose} className="bg-primary text-on-primary font-bold py-2 px-6 rounded-md hover:bg-primary-light transition-colors">Close</button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-theme-secondary mb-1">Have an idea for a new calculator or feedback for us?</label>
                <textarea 
                  id="feedback" 
                  value={feedback} 
                  onChange={e => setFeedback(e.target.value)} 
                  rows={5} 
                  className="w-full bg-theme-primary text-theme-primary border-theme rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
                  placeholder="e.g., 'I'd love a crypto profit/loss calculator!' or 'The history panel is great!'"
                  disabled={isSubmitting}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg disabled:bg-theme-tertiary disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Send Feedback'}
              </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;