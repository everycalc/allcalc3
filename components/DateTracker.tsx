
import React, { useState } from 'react';
import { useDateTracker, SavedDate, DateType } from '../contexts/DateTrackerContext';

const DateTracker: React.FC = () => {
    const { savedDates, addDate, removeDate } = useDateTracker();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<DateType>('Birthday');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !date) {
            setError('Please fill out all fields.');
            return;
        }
        addDate({ name, date, type });
        setName('');
        setDate(new Date().toISOString().split('T')[0]);
        setError('');
    };
    
    const commonInputClasses = "w-full bg-theme-tertiary text-theme-primary border-theme rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition";

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3 bg-theme-secondary/50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-theme-primary mb-2">Add a New Date</h3>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-theme-secondary mb-1">Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={commonInputClasses} placeholder="e.g., John Doe's Birthday"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="date" className="block text-xs font-medium text-theme-secondary mb-1">Date</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={commonInputClasses} />
                    </div>
                     <div>
                        <label htmlFor="type" className="block text-xs font-medium text-theme-secondary mb-1">Type</label>
                        <select id="type" value={type} onChange={e => setType(e.target.value as DateType)} className={commonInputClasses}>
                            <option>Birthday</option>
                            <option>Anniversary</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors duration-200 shadow-lg">
                    Save Date
                </button>
            </form>

            <div className="space-y-3">
                <h3 className="text-lg font-bold text-theme-primary">Saved Dates</h3>
                {savedDates.length === 0 ? (
                    <p className="text-center text-theme-secondary p-4 bg-theme-secondary/50 rounded-lg text-sm">No dates saved yet.</p>
                ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {savedDates.map(item => (
                            <li key={item.id} className="bg-theme-secondary p-3 rounded-lg flex justify-between items-center list-none">
                                <div>
                                    <p className="font-semibold text-theme-primary text-sm">{item.name}</p>
                                    <p className="text-xs text-theme-secondary">{new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ({item.type})</p>
                                </div>
                                <button onClick={() => removeDate(item.id)} className="p-1 rounded-full text-red-500 hover:bg-red-500/10 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateTracker;
