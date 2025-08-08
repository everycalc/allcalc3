import React, { useState } from 'react';
import { useDateTracker, DateType } from '../contexts/DateTrackerContext';

interface SavedDatesPageProps {
  onBack: () => void;
}

const SavedDatesPage: React.FC<SavedDatesPageProps> = ({ onBack }) => {
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
    
    return (
        <div className="flex flex-col min-h-screen">
            <header className="page-header p-4 flex items-center shadow-md sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Go back to home page">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold ml-4">Saved Dates</h1>
            </header>
            <main className="flex-grow p-4 max-w-2xl mx-auto w-full">
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-3 bg-surface-container p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-on-surface mb-2">Add a New Date</h3>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-on-surface-variant mb-1">Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="input-base w-full" placeholder="e.g., John Doe's Birthday"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <label htmlFor="date" className="block text-xs font-medium text-on-surface-variant mb-1">Date</label>
                                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="input-base w-full" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-xs font-medium text-on-surface-variant mb-1">Type</label>
                                <select id="type" value={type} onChange={e => setType(e.target.value as DateType)} className="select-base w-full">
                                    <option>Birthday</option>
                                    <option>Anniversary</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full font-bold py-2 px-4 rounded-md shadow-lg">
                            Save Date
                        </button>
                    </form>

                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-on-surface">Saved Dates</h3>
                        {savedDates.length === 0 ? (
                            <p className="text-center text-on-surface-variant p-4 bg-surface-container rounded-lg text-sm">No dates saved yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {savedDates.map(item => (
                                    <li key={item.id} className="bg-surface-container p-3 rounded-lg flex justify-between items-center list-none">
                                        <div>
                                            <p className="font-semibold text-on-surface">{item.name}</p>
                                            <p className="text-sm text-on-surface-variant">{new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} ({item.type})</p>
                                        </div>
                                        <button onClick={() => removeDate(item.id)} className="p-1 rounded-full text-red-500 hover:bg-red-500/10 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SavedDatesPage;