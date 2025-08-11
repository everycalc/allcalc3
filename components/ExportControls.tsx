import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportControlsProps {
  contentRef: React.RefObject<HTMLDivElement>;
  calculatorName: string;
  onOpenEmbedModal: () => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({ contentRef, calculatorName, onOpenEmbedModal }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const captureElement = async () => {
    if (!contentRef.current) return null;
    const element = contentRef.current;
    
    // Create a temporary style element to inject computed CSS variables for html2canvas
    const style = document.createElement('style');
    const rootStyle = getComputedStyle(document.documentElement);

    // Explicitly define colors needed for the canvas render
    const cssVariables = [
      '--color-surface-container',
      '--color-on-surface',
      '--color-on-surface-variant',
      '--color-primary',
      '--color-outline-variant',
      '--color-surface-container-low'
    ];
    
    let cssOverrides = cssVariables.map(variable => {
      // Find the actual system color if it's a variable pointing to another variable
      let value = rootStyle.getPropertyValue(variable).trim();
      if (value.startsWith('var(')) {
          const systemVar = value.match(/var\((--sys-color-[a-zA-Z-]+)/);
          if(systemVar && systemVar[1]) {
             value = rootStyle.getPropertyValue(systemVar[1]).trim();
          }
      }
      return `${variable}: ${value};`;
    }).join(' ');

    style.innerHTML = `
      :root { ${cssOverrides} }
      .result-card { background-color: var(--color-surface-container-low) !important; color: var(--color-on-surface) !important; }
      .text-primary { color: var(--color-primary) !important; }
      .text-on-surface { color: var(--color-on-surface) !important; }
      .text-on-surface-variant { color: var(--color-on-surface-variant) !important; }
      .border-outline-variant { border-color: var(--color-outline-variant) !important; }
    `;
    element.appendChild(style);

    try {
        const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: rootStyle.getPropertyValue('--color-surface-container').trim(),
            scale: 2 // Increase resolution for better quality
        });

        // Add tiled watermark to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const watermarkText = 'All Type Calculator';
            const fontSize = canvas.width * 0.05; // Responsive font size
            ctx.font = `bold ${fontSize}px Poppins`;
            ctx.fillStyle = 'rgba(128, 128, 128, 0.15)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const angle = -Math.PI / 4; // -45 degrees
            const textMetrics = ctx.measureText(watermarkText);
            const patternWidth = Math.abs(textMetrics.width * Math.cos(angle)) + Math.abs(fontSize * Math.sin(angle));
            const patternHeight = Math.abs(textMetrics.width * Math.sin(angle)) + Math.abs(fontSize * Math.cos(angle));
            const horizontalSpacing = patternWidth * 1.5;
            const verticalSpacing = patternHeight * 2.5;

            ctx.save();
            for (let x = -canvas.width; x < canvas.width * 2; x += horizontalSpacing) {
                for (let y = -canvas.height; y < canvas.height * 2; y += verticalSpacing) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.fillText(watermarkText, 0, 0);
                    ctx.restore();
                }
            }
            ctx.restore();
        }

        return canvas;
    } catch (error) {
        console.error("html2canvas error:", error);
        return null;
    } finally {
        element.removeChild(style);
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
                }
            });
        }
    } catch (error) {
        console.error('Copy failed:', error);
    } finally {
        setIsProcessing(null);
    }
  };

  const handleDownloadImage = async () => {
    setIsProcessing('image');
    try {
        const canvas = await captureElement();
        if (canvas) {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `all-type-calculator-${calculatorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
            link.click();
        }
    } catch (error) {
        console.error('Image download failed:', error);
    } finally {
        setIsProcessing(null);
    }
  };

  const handleDownloadPdf = async () => {
    setIsProcessing('pdf');
    try {
        const canvas = await captureElement();
        if (canvas) {
            const imgData = canvas.toDataURL('image/png', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            pdf.setProperties({
                title: `All Type Calculator - ${calculatorName} Result`,
                subject: `Calculation result from the ${calculatorName}.`,
                author: 'All Type Calculator',
                keywords: `all type calculator, free online calculator, ${calculatorName.toLowerCase()}, calculation result`,
                creator: 'All Type Calculator'
            });

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
            pdf.save(`all-type-calculator-${calculatorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-result.pdf`);
        }
    } catch (error) {
        console.error('PDF download failed:', error);
    } finally {
        setIsProcessing(null);
    }
  };
  
  const ControlButton: React.FC<{onClick: () => void, label: string, icon: React.ReactNode, processingLabel: string}> = ({onClick, label, icon, processingLabel}) => (
      <button 
        onClick={onClick} 
        disabled={!!isProcessing}
        className="flex flex-col items-center justify-center p-3 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary transition-colors text-on-surface-variant w-full text-xs disabled:opacity-50"
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
          </>
        )}
      </button>
  );

  return (
    <div id="export-controls-container" className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ControlButton onClick={handleCopy} label="Copy" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} processingLabel="Copying..." />
        <ControlButton onClick={handleDownloadImage} label="Image" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>} processingLabel="Saving..." />
        <ControlButton onClick={handleDownloadPdf} label="PDF" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} processingLabel="Creating..." />
        <ControlButton onClick={onOpenEmbedModal} label="Embed" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} processingLabel="..." />
    </div>
  );
};

export default ExportControls;