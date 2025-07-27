import React, { useContext, useState, useEffect } from 'react';
import { HistoryContext, HistoryEntry } from '../contexts/HistoryContext';
import jsPDF from 'jspdf';
import UnskippableAdModal from './UnskippableAdModal';
import HistoryExportGuide from './HistoryExportGuide';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (entry: HistoryEntry) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onRestore }) => {
  const { history, clearHistory } = useContext(HistoryContext);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showHistoryExportGuide, setShowHistoryExportGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const hasSeenGuide = sessionStorage.getItem('hasSeenHistoryExportGuide');
      if (!hasSeenGuide && history.length > 0) {
          setShowHistoryExportGuide(true);
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, history.length]);

  const groupedHistory = history.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof history>);

  const handleToggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleToggleAll = () => {
    if (selectedIds.size === history.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(history.map(h => h.id)));
    }
  };

  const generatePdf = () => {
    setShowAdModal(false);
    if (selectedIds.size === 0) return;

    const selectedHistory = history.filter(h => selectedIds.has(h.id));
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text('Calculation History Report', 14, y);
    y += 10;

    selectedHistory.forEach((entry, index) => {
        if (y > 270) {
            doc.addPage();
            y = 15;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${entry.calculator}`, 14, y);
        y += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(entry.timestamp).toLocaleString()}`, 14, y);
        y += 6;
        
        doc.text(`Result: ${entry.calculation}`, 14, y);
        y += 6;

        if (entry.inputs && Object.keys(entry.inputs).length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Inputs:', 14, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            
            Object.entries(entry.inputs).forEach(([key, value]) => {
                if (y > 280) { doc.addPage(); y = 15; }
                const valueString = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
                const splitText = doc.splitTextToSize(`- ${key}: ${valueString}`, 180);
                doc.text(splitText, 16, y);
                y += (splitText.length * 4);
            });
        }
        
        y += 5;
        if (index < selectedHistory.length - 1) {
            doc.line(14, y, 196, y); // Separator line
            y += 5;
        }
    });

    doc.save(`calculator-history-${new Date().toISOString().split('T')[0]}.pdf`);
    setSelectedIds(new Set()); // Clear selection after export
  };

  const handleExportClick = () => {
    if (selectedIds.size > 0) {
      setShowAdModal(true);
    }
  };
  
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
        clearHistory();
    }
  }

  return (
    <>
      <HistoryExportGuide 
        isOpen={showHistoryExportGuide}
        onClose={() => {
            setShowHistoryExportGuide(false);
            sessionStorage.setItem('hasSeenHistoryExportGuide', 'true');
        }}
      />
      {showAdModal && <UnskippableAdModal onComplete={generatePdf} />}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-theme-secondary text-theme-primary shadow-xl z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-theme">
            <h2 className="text-xl font-bold">History</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <main className="flex-grow overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="text-center text-theme-secondary h-full flex items-center justify-center">
                <p>No history yet. Your calculations will appear here.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-4">
                    <input 
                        type="checkbox" 
                        id="select-all" 
                        className="history-checkbox"
                        checked={selectedIds.size === history.length && history.length > 0}
                        onChange={handleToggleAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">Select All</label>
                </div>
                {Object.entries(groupedHistory).map(([date, entries]) => (
                  <div key={date} className="mb-6">
                    <h3 className="text-sm font-semibold text-theme-secondary uppercase tracking-wider mb-2">{date}</h3>
                    <ul className="space-y-2">
                      {entries.map((entry) => (
                        <li key={entry.id} className="bg-theme-primary rounded-lg overflow-hidden">
                          <div className="flex items-start p-3">
                              <input 
                                  type="checkbox" 
                                  className="history-checkbox mr-3 mt-1"
                                  checked={selectedIds.has(entry.id)}
                                  onChange={() => handleToggleSelection(entry.id)}
                              />
                              <div className="flex-grow" onClick={() => onRestore(entry)}>
                                  <p className="text-xs text-primary font-semibold cursor-pointer hover:underline">{entry.calculator}</p>
                                  <p className="text-theme-primary break-words cursor-pointer">{entry.calculation}</p>
                              </div>
                              <button onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)} className="p-1 text-theme-secondary hover:text-primary">
                                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              </button>
                          </div>
                          {expandedId === entry.id && (
                            <div className="bg-theme-secondary/50 p-3 text-xs space-y-1 border-t border-theme">
                                <h4 className="font-bold text-theme-primary">Inputs:</h4>
                                {entry.inputs && Object.keys(entry.inputs).length > 0 ? (
                                    Object.entries(entry.inputs).map(([key, value]) => (
                                        <div key={key} className="flex text-theme-secondary break-all">
                                            <strong className="mr-2 flex-shrink-0">{key}:</strong> 
                                            <span className="truncate">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                        </div>
                                    ))
                                ) : <p className="text-theme-secondary">Not available.</p>}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </main>
          {history.length > 0 && (
            <footer className="p-4 border-t border-theme">
              <div className="flex space-x-2">
                <button id="history-export-button" onClick={handleExportClick} disabled={selectedIds.size === 0} className="w-1/2 bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors disabled:bg-theme-tertiary disabled:text-theme-secondary disabled:cursor-not-allowed">
                    Export PDF ({selectedIds.size})
                </button>
                <button onClick={handleClear} className="w-1/2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500 transition-colors">
                    Clear All
                </button>
              </div>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;