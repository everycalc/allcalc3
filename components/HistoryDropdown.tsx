import React, { useContext, useEffect, useRef } from 'react';
import { HistoryContext, HistoryEntry } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryDropdownProps {
  onToggleHistoryPanel: () => void;
  onClose: () => void;
  onRestore: (entry: HistoryEntry) => void;
}

const HistoryDropdown: React.FC<HistoryDropdownProps> = ({ onToggleHistoryPanel, onClose, onRestore }) => {
  const { history } = useContext(HistoryContext);
  const { sidebarPosition } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const recentHistory = history.slice(0, 3);

  const handleViewAll = () => {
    onClose();
    onToggleHistoryPanel();
  };
  
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const positionClass = sidebarPosition === 'left' ? 'right-0' : 'left-0';

  return (
    <div 
        ref={dropdownRef}
        className={`absolute top-full mt-2 w-72 ${positionClass} panel-base rounded-lg shadow-2xl z-30 p-4 animate-fade-in-down`}
    >
        <h3 className="text-lg font-bold text-on-surface mb-3">Recent Activity</h3>
        {recentHistory.length > 0 ? (
            <div className="space-y-2">
                {recentHistory.map(entry => (
                    <button 
                        key={entry.id} 
                        onClick={() => { onRestore(entry); onClose(); }}
                        className="w-full text-left bg-surface-container p-2 rounded-md text-sm hover:bg-surface-container-high transition-colors"
                    >
                        <p className="text-xs text-primary font-semibold">{entry.calculator}</p>
                        <p className="text-on-surface break-words">{entry.calculation}</p>
                    </button>
                ))}
            </div>
        ) : (
            <p className="text-on-surface-variant text-sm text-center py-4">No history yet.</p>
        )}
        <button 
            onClick={handleViewAll}
            className="w-full mt-4 btn-primary font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
            View All History
        </button>
    </div>
  );
};

export default HistoryDropdown;