import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useFuel } from '../contexts/FuelContext';

interface ExportControlsProps {
  contentRef: React.RefObject<HTMLDivElement>;
  calculatorName: string;
  onOpenEmbedModal: () => void;
  onShowPdfFuelModal: (cost: number) => void;
  onShowImageFuelModal: (cost: number) => void;
}

const IMAGE_COST = 1;
const PDF_COST = 5;

const ExportControls: React.FC<ExportControlsProps> = ({ contentRef, calculatorName, onOpenEmbedModal, onShowPdfFuelModal, onShowImageFuelModal }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { fuel, consumeFuel } = useFuel();

  const captureElement = async () => {
    if (!contentRef.current) return null;
    const element = contentRef.current;
    
    // Temporarily inject a style tag with all computed CSS variables
    // This allows html2canvas to render them correctly.
    const style = document.createElement('style');
    const rootStyle = getComputedStyle(document.documentElement);
    const cssVariables = [
        '--color-bg-primary', '--color-bg-secondary', '--color-bg-tertiary',
        '--color-text-primary', '--color-text-secondary', '--color-border-glass',
        '--color-primary', '--color-primary-light', '--color-primary-dark',
        '--color-text-on-primary', '--color-accent', '--color-accent-dark'
    ];
    
    const cssOverrides = cssVariables.map(variable => 
        `${variable}: ${rootStyle.getPropertyValue(variable).trim()};`
    ).join(' ');

    style.innerHTML = `:root { ${cssOverrides} }`;
    document.head.appendChild(style);

    try {
        const canvas = await html2canvas(element, {
            useCORS: true,
            // The background color of the element itself should be correct now
            backgroundColor: rootStyle.getPropertyValue('--color-bg-secondary').trim(),
        });
        return canvas;
    } catch (error) {
        console.error("html2canvas error:", error);
        return null; // Return null on error
    } finally {
        // Clean up the injected style tag
        document.head.removeChild(style);
    }
  };


  const handleCopy = async () => {
    setIsProcessing('copy');
    try {
        const canvas = await captureElement();
        if (canvas) {
            canvas.toBlob(async (blob) => {
                if (blob) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    alert('Image copied to clipboard!');
                }
            });
        }
    } catch (error) {
        console.error('Copy failed:', error);
        alert('Failed to copy image.');
    } finally {
        setIsProcessing(null);
    }
  };

  const handleDownloadImage = async () => {
    if (fuel < IMAGE_COST) {
        onShowImageFuelModal(IMAGE_COST);
        return;
    }
    consumeFuel(IMAGE_COST);
    setIsProcessing('image');
    try {
        const canvas = await captureElement();
        if (canvas) {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `${calculatorName.replace(/\s+/g, '_')}-result.png`;
            link.click();
        }
    } catch (error) {
        console.error('Image download failed:', error);
    } finally {
        setIsProcessing(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (fuel < PDF_COST) {
        onShowPdfFuelModal(PDF_COST);
        return;
    }
    consumeFuel(PDF_COST);
    setIsProcessing('pdf');
    try {
        const canvas = await captureElement();
        if (canvas) {
            const imgData = canvas.toDataURL('image/png', 0.95); // Use JPEG for smaller file size in PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
              heightLeft -= pdfHeight;
            }
            pdf.save(`${calculatorName.replace(/\s+/g, '_')}-result.pdf`);
        }
    } catch (error) {
        console.error('PDF download failed:', error);
    } finally {
        setIsProcessing(null);
    }
  };
  
  const ControlButton: React.FC<{onClick: () => void, label: string, icon: React.ReactNode, processingLabel: string, cost?: number}> = ({onClick, label, icon, processingLabel, cost}) => (
      <button 
        onClick={onClick} 
        disabled={!!isProcessing}
        className="flex flex-col items-center justify-center p-3 rounded-lg bg-theme-tertiary hover:bg-primary hover:text-on-primary transition-colors text-theme-secondary w-full text-xs disabled:opacity-50"
      >
        {isProcessing === label.toLowerCase() ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-1">{processingLabel}</span>
          </>
        ) : (
          <>
            <div className="w-6 h-6">{icon}</div>
            <span className="mt-1 font-semibold">{label}</span>
            {cost && <span className="text-xs font-bold text-red-500/80">(-{cost} ⛽)</span>}
          </>
        )}
      </button>
  );

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ControlButton onClick={handleCopy} label="Copy" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} processingLabel="Copying..." />
        <ControlButton onClick={handleDownloadImage} label="Image" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>} processingLabel="Saving..." cost={IMAGE_COST}/>
        <ControlButton onClick={handleDownloadPdf} label="PDF" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} processingLabel="Creating..." cost={PDF_COST}/>
        <ControlButton onClick={onOpenEmbedModal} label="Embed" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} processingLabel="..." />
    </div>
  );
};

export default ExportControls;