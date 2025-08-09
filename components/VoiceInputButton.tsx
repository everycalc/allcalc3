import React, { useState, useEffect, useRef } from 'react';

// Define the SpeechRecognition interface to satisfy TypeScript
interface SpeechRecognition {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        // No need to set isListening(false) here, onend will handle it
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;

      // Cleanup function to stop recognition and remove listeners on unmount
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
        }
      };
    }
  }, [onTranscript]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Could not start speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  if (!isSupported) {
    return null; // Don't render the button if the browser doesn't support it
  }

  const buttonClasses = `p-2 rounded-full transition-colors ${
    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-theme-secondary text-theme-primary hover:bg-theme-tertiary'
  }`;

  return (
    <button onClick={handleToggleListening} className={buttonClasses} aria-label="Use voice input">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
        <path fillRule="evenodd" d="M10 18a5 5 0 005-5h-2a3 3 0 01-6 0H5a5 5 0 005 5z" clipRule="evenodd" />
      </svg>
    </button>
  );
};

export default VoiceInputButton;