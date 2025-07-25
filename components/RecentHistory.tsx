import React, { useContext } from 'react';
import { HistoryContext, HistoryEntry } from '../contexts/HistoryContext';

interface RecentHistoryProps {
    onToggleHistoryPanel: () => void;
    onRestore: (entry: HistoryEntry) => void;
}

const RecentHistory: React.FC<RecentHistoryProps> = ({ onToggleHistoryPanel, onRestore }) => {
    const { history } = useContext(HistoryContext);

    const recentItems = history.slice(0, 3);

    if(recentItems.length === 0) {
        return null;
    }

    return (
        <section className="mb-8" aria-labelledby="recent-history-heading">
            <div className="flex justify-between items-center mb-4">
                <h2 id="recent-history-heading" className="text-2xl font-semibold text-theme-primary">Recent History</h2>
                <button 
                    onClick={onToggleHistoryPanel}
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    View All
                </button>
            </div>
            <div className="space-y-3">
                {recentItems.map(entry => (
                     <button 
                        key={entry.id} 
                        onClick={() => onRestore(entry)}
                        className="w-full text-left bg-theme-secondary p-3 rounded-lg shadow hover:bg-theme-tertiary transition-colors"
                     >
                        <p className="text-xs text-primary font-semibold">{entry.calculator}</p>
                        <p className="text-theme-primary break-words text-sm">{entry.calculation}</p>
                     </button>
                ))}
            </div>
        </section>
    )
};

export default RecentHistory;