import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useDateTracker, SavedDate } from '../contexts/DateTrackerContext';
import { HistoryContext } from '../contexts/HistoryContext';
import ShareButton from './ShareButton';
import SaveDatesModal from './SaveDatesModal';
import AgeCalculatorOnboarding from './AgeCalculatorOnboarding';
import { useAd } from '../contexts/AdContext';
import { useFuel } from '../contexts/FuelContext';
import InterstitialAdModal from './InterstitialAdModal';

interface AgeResult {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface AgeCalculatorState {
    birthDate: string;
    selectedPersonId: string;
}

interface AgeCalculatorProps {
    initialState?: AgeCalculatorState;
    isPremium?: boolean;
}

const AgeCalculator: React.FC<AgeCalculatorProps> = ({ initialState, isPremium }) => {
    const { savedDates } = useDateTracker();
    const { addHistory } = useContext(HistoryContext);

    const [birthDate, setBirthDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedPersonId, setSelectedPersonId] = useState<string>('');
    const [result, setResult] = useState<AgeResult | null>(null);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [shareText, setShareText] = useState('');
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const [pendingCalculation, setPendingCalculation] = useState<(() => void) | null>(null);
    const [showAd, setShowAd] = useState(false);
    const { shouldShowAd } = useAd();
    const { fuel, consumeFuel } = useFuel();
    const fuelCost = isPremium ? 2 : 1;

    useEffect(() => {
      const hasSeen = sessionStorage.getItem('hasSeenAgeCalculatorOnboarding');
      if (!hasSeen) {
        setShowOnboarding(true);
        sessionStorage.setItem('hasSeenAgeCalculatorOnboarding', 'true');
      }
    }, []);

    useEffect(() => {
        if (initialState) {
            setBirthDate(initialState.birthDate || new Date().toISOString().split('T')[0]);
            setSelectedPersonId(initialState.selectedPersonId || '');
            stopAgeUpdate();
            setResult(null);
        }
    }, [initialState]);

    useEffect(() => {
        // Cleanup interval on unmount
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    const handleAdClose = () => {
        setShowAd(false);
        if (pendingCalculation) {
            pendingCalculation();
            setPendingCalculation(null);
        }
    };

    const stopAgeUpdate = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }
    
    const startAgeUpdate = (dob: string) => {
        stopAgeUpdate();

        const update = () => {
            const start = new Date(dob);
            const end = new Date();

            if (isNaN(start.getTime()) || start > end) {
                setResult(null);
                stopAgeUpdate();
                return;
            }

            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();
            let hours = end.getHours() - start.getHours();
            let minutes = end.getMinutes() - start.getMinutes();
            let seconds = end.getSeconds() - start.getSeconds();
            
            if (seconds < 0) { minutes--; seconds += 60; }
            if (minutes < 0) { hours--; minutes += 60; }
            if (hours < 0) { days--; hours += 24; }
            if (days < 0) {
                months--;
                const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }
            const currentResult = { years, months, days, hours, minutes, seconds };
            setResult(currentResult);
            setShareText(`Age Calculation for DOB ${new Date(dob).toLocaleDateString()}:\n- ${currentResult.years} years\n- ${currentResult.months} months\n- ${currentResult.days} days\n- ${currentResult.hours} hours\n- ${currentResult.minutes} minutes\n- ${currentResult.seconds} seconds`);
        };
        
        update();
        const newIntervalId = setInterval(update, 1000);
        setIntervalId(newIntervalId as any);
    }
    
    const handleCalculate = () => {
        const performCalculation = () => {
            const person = savedDates.find(p => p.id === selectedPersonId);
            const name = person ? person.name : `Person born on ${new Date(birthDate).toLocaleDateString()}`;
            
            addHistory({
                calculator: 'Age Calculator',
                calculation: `Calculated age for ${name}`,
                inputs: { birthDate, selectedPersonId }
            });
            startAgeUpdate(birthDate);
        };

        if (fuel >= fuelCost) {
            consumeFuel(fuelCost);
            performCalculation();
        } else {
            if (shouldShowAd(isPremium)) {
                setPendingCalculation(() => performCalculation);
                setShowAd(true);
            } else {
                performCalculation();
            }
        }
    };
    
    const nextBirthday = useMemo(() => {
        if (!birthDate || !result) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dob = new Date(birthDate);
        if(isNaN(dob.getTime())) return null;

        let nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextBday < today) {
            nextBday.setFullYear(today.getFullYear() + 1);
        }
        const diffTime = nextBday.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, [birthDate, result]);
    
    const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const personId = e.target.value;
        setSelectedPersonId(personId);
        stopAgeUpdate();
        setResult(null);
        const person = savedDates.find(p => p.id === personId);
        if (person) {
            setBirthDate(person.date);
        } else {
            setBirthDate(new Date().toISOString().split('T')[0]);
        }
    }
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBirthDate(e.target.value);
        setSelectedPersonId(''); // It's a manual entry now
        stopAgeUpdate();
        setResult(null);
    }

    return (
        <div className="space-y-6">
            {showAd && <InterstitialAdModal onClose={handleAdClose} />}
            <AgeCalculatorOnboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} onOpenDateManager={() => setIsDateModalOpen(true)} />
            <SaveDatesModal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} />

            <div className="space-y-4">
                <div>
                    <label htmlFor="person" className="block text-sm font-medium text-on-surface-variant mb-1">Select a Saved Person (Optional)</label>
                    <select id="person" value={selectedPersonId} onChange={handlePersonChange} className="select-base w-full">
                        <option value="">-- Enter date manually --</option>
                        {savedDates.filter(d => d.type === 'Birthday').map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="birthdate" className="block text-sm font-medium text-on-surface-variant mb-1">Date of Birth</label>
                    <input type="date" id="birthdate" value={birthDate} onChange={handleDateChange} className="input-base w-full" />
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={handleCalculate} className="btn-primary w-full font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg">
                    Calculate Age
                </button>
                <button onClick={() => setIsDateModalOpen(true)} className="btn-secondary w-full sm:w-auto font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg flex-shrink-0">
                    Manage Dates
                </button>
            </div>
            
            {result && result.years >= 0 && (
                <div className="result-card p-6 rounded-lg space-y-4 text-center animate-fade-in">
                    <h3 className="text-xl font-semibold text-on-surface-variant mb-2">Calculated Age</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                        {Object.entries(result).map(([unit, value]) => (
                             <div key={unit} className="bg-surface-container p-3 rounded-lg">
                                <span className="text-3xl font-bold text-primary">{value}</span>
                                <span className="block text-sm text-on-surface-variant capitalize">{unit}</span>
                            </div>
                        ))}
                    </div>
                     {nextBirthday !== null && result && (
                        <div className="mt-4 bg-surface-container p-3 rounded-lg">
                            <p className="font-semibold text-primary">{nextBirthday === 0 ? "🎉 Happy Birthday! 🎉" : `${nextBirthday} days until next birthday.`}</p>
                        </div>
                    )}
                     <ShareButton textToShare={shareText} />
                </div>
            )}
        </div>
    );
};

export default AgeCalculator;