
import React, { useContext, useMemo } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import AdsensePlaceholder from './AdsensePlaceholder';

interface CalculatorHistoryViewProps {
    calculatorName: string;
}

const CalculatorHistoryView: React.FC<CalculatorHistoryViewProps> = ({ calculatorName }) => {
    const { history } = useContext(HistoryContext);

    const filteredHistory = useMemo(() => {
        return history.filter(entry => entry.calculator === calculatorName);
    }, [history, calculatorName]);

    return (
        <div className="max-h-96 overflow-y-auto pr-2">
            {filteredHistory.length === 0 ? (
                <div className="text-center text-theme-secondary py-10">
                    <p>No history for this calculator yet.</p>
                </div>
            ) : (
                <>
                    <ul className="space-y-3">
                        {filteredHistory.map(entry => (
                            <li key={entry.id} className="bg-theme-primary p-3 rounded-lg animate-fade-in">
                                <p className="text-theme-primary break-words">{entry.calculation}</p>
                                <p className="text-xs text-theme-secondary text-right">
                                    {new Date(entry.timestamp).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                        <AdsensePlaceholder />
                    </div>
                </>
            )}
        </div>
    );
}

export default CalculatorHistoryView;
