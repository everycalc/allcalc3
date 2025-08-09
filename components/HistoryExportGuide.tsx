import React from 'react';
import JustInTimeGuide from './JustInTimeGuide';

interface HistoryExportGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryExportGuide: React.FC<HistoryExportGuideProps> = ({ isOpen, onClose }) => {
  return (
    <JustInTimeGuide
      isOpen={isOpen}
      onClose={onClose}
      targetId="history-export-button"
      content="Select calculations and export them as a PDF for your records."
      position="top"
    />
  );
};

export default HistoryExportGuide;
