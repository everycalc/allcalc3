import React, { useContext, useState, useEffect } from 'react';
import { HistoryContext, HistoryEntry } from '../contexts/HistoryContext';
import jsPDF from 'jspdf';
import HistoryExportGuide from './HistoryExportGuide';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (entry: HistoryEntry) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onRestore }) => {
  const { history, clearHistory } = useContext(HistoryContext);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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

    // Add tiled watermark to all pages
    const addWatermark = (pdfDoc: jsPDF) => {
        const totalPages = pdfDoc.internal.pages.length;
        for (let i = 1; i <= totalPages; i++) {
            pdfDoc.setPage(i);
            pdfDoc.setFontSize(50);
            pdfDoc.setTextColor(220, 220, 220);
            pdfDoc.saveGraphicsState();
            // @ts-ignore
            pdfDoc.setGState(new doc.GState({opacity: 0.5}));
            
            const text = 'All Type Calculator';
            const pageWidth = pdfDoc.internal.pageSize.getWidth();
            const pageHeight = pdfDoc.internal.pageSize.getHeight();
            
            const angle = -45;
            for (let yPos = 0; yPos < pageHeight * 1.5; yPos += 80) {
                for (let xPos = -pageWidth * 0.5; xPos < pageWidth * 1.5; xPos += 120) {
                    pdfDoc.text(text, xPos, yPos, { angle: angle, align: 'center' });
                }
            }
            pdfDoc.restoreGraphicsState();
        }
    };

    addWatermark(doc);
    doc.save(`all-type-calculator-history-${new Date().toISOString().split('T')[0]}.pdf`);
    setSelectedIds(new Set());
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
        clearHistory();
    }
  }
  
  const historyCheckboxClasses = "appearance-none bg-surface-container border-2 border-outline w-5 h-5 rounded-md cursor-pointer relative transition-all duration-200 checked:bg-primary checked:border-primary after:content-['✓'] after:absolute after:text-on-primary after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm after:font-bold after:opacity-0 checked:after:opacity-100";

  return (
    <>
      <HistoryExportGuide 
        isOpen={showHistoryExportGuide}
        onClose={() => {
            setShowHistoryExportGuide(false);
            sessionStorage.setItem('hasSeenHistoryExportGuide', 'true');
        }}
      />
      <div 
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`panel-base fixed top-0 left-0 h-full w-full max-w-sm shadow-xl z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-outline-variant">
            <h2 className="text-xl font-bold">History</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <main className="flex-grow overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="text-center text-on-surface-variant h-full flex items-center justify-center">
                <p>No history yet. Your calculations will appear here.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-4">
                    <input 
                        type="checkbox" 
                        id="select-all" 
                        className={historyCheckboxClasses}
                        checked={selectedIds.size === history.length && history.length > 0}
                        onChange={handleToggleAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">Select All</label>
                </div>
                {Object.entries(groupedHistory).map(([date, entries]) => (
                  <div key={date} className="mb-6">
                    <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">{date}</h3>
                    <ul className="space-y-2">
                      {entries.map((entry) => (
                          <li key={entry.id} className="bg-surface-container-low rounded-lg">
                            <div className="flex items-center p-3">
                                <input 
                                    type="checkbox" 
                                    className={`${historyCheckboxClasses} mr-3 mt-1 flex-shrink-0`}
                                    checked={selectedIds.has(entry.id)}
                                    onChange={() => handleToggleSelection(entry.id)}
                                />
                                <div className="flex-grow cursor-pointer" onClick={() => onRestore(entry)}>
                                    <p className="text-xs text-primary font-semibold hover:underline">{entry.calculator}</p>
                                    <p className="text-on-surface break-words">{entry.calculation}</p>
                                </div>
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </main>
          {history.length > 0 && (
            <footer className="p-4 border-t border-outline-variant">
              <div className="flex space-x-2">
                <button id="history-export-button" onClick={generatePdf} disabled={selectedIds.size === 0} className="w-1/2 btn-primary font-bold py-2 px-4 rounded-full hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    Export PDF ({selectedIds.size})
                </button>
                <button onClick={handleClear} className="w-1/2 btn-clear font-bold py-2 px-4 rounded-full hover:shadow-lg transition-shadow">
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