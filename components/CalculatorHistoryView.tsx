import React, { useContext, useMemo } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';

interface CalculatorHistoryViewProps {
    calculatorName: string;
}

const CalculatorHistoryView: React.FC<CalculatorHistoryViewProps> = ({ calculatorName }) => {
    const { history } = useContext(HistoryContext);

    const filteredHistory = useMemo(() => {
        return history.filter(entry => entry.calculator === calculatorName);
    }, [history, calculatorName]);

    return (
        <div className="calculator-wrapper-card p-4 md:p-6 max-h-[32rem] overflow-y-auto">
            {filteredHistory.length === 0 ? (
                <div className="text-center text-on-surface-variant py-10">
                    <p>No history for this calculator yet.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {filteredHistory.map(entry => (
                        <li key={entry.id} className="history-view-item p-4 rounded-2xl animate-fade-in">
                            <p className="text-on-surface break-words">{entry.calculation}</p>
                            <p className="text-xs text-on-surface-variant text-right mt-2">
                                {new Date(entry.timestamp).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CalculatorHistoryView;