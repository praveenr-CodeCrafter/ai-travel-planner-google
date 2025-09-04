import React, { useState, useEffect } from 'react';
import type { TravelPreferences } from '../types';
import { INTERESTS_OPTIONS, CURRENCY_OPTIONS } from '../types';
import { suggestCountry } from '../services/geminiService';

interface TravelFormProps {
    onGenerate: (preferences: TravelPreferences) => void;
    isLoading: boolean;
}

const TravelForm: React.FC<TravelFormProps> = ({ onGenerate, isLoading }) => {
    const today = new Date().toISOString().split('T')[0];
    const [preferences, setPreferences] = useState<TravelPreferences>({
        destination: '',
        budget: '2000',
        currency: 'USD',
        startDate: today,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        interests: ['Sightseeing'],
    });
    const [error, setError] = useState<string | null>(null);
    const [countrySuggestion, setCountrySuggestion] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    // Debounced effect for country suggestion
    useEffect(() => {
        setCountrySuggestion(null);
        if (preferences.destination.trim().split(/\s+/).length < 2) {
            return;
        }

        const handler = setTimeout(async () => {
            setIsSuggesting(true);
            try {
                const country = await suggestCountry(preferences.destination);
                if (country && !preferences.destination.toLowerCase().includes(country.toLowerCase())) {
                    setCountrySuggestion(country);
                }
            } catch (e) {
                console.error("Failed to suggest country", e);
            } finally {
                setIsSuggesting(false);
            }
        }, 1000); // 1s debounce

        return () => clearTimeout(handler);
    }, [preferences.destination]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const handleInterestChange = (interest: string) => {
        const newInterests = preferences.interests.includes(interest)
            ? preferences.interests.filter((i) => i !== interest)
            : [...preferences.interests, interest];
        setPreferences({ ...preferences, interests: newInterests });
    };
    
    const applySuggestion = () => {
        if(countrySuggestion) {
            setPreferences(prev => ({...prev, destination: `${prev.destination}, ${countrySuggestion}`}));
            setCountrySuggestion(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!preferences.destination.trim()) {
            setError("Please enter a destination.");
            return;
        }
        if (new Date(preferences.endDate) < new Date(preferences.startDate)) {
            setError("End date cannot be before start date.");
            return;
        }
        if (preferences.interests.length === 0) {
            setError("Please select at least one interest.");
            return;
        }
        setError(null);
        onGenerate(preferences);
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Plan Your Next Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                        <input type="text" name="destination" id="destination" value={preferences.destination} onChange={handleChange}
                               className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                               placeholder="e.g., Eiffel Tower, Paris" />
                        {isSuggesting && <p className="text-xs text-gray-500 mt-1">Checking for country...</p>}
                        {countrySuggestion && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Did you mean: <button type="button" onClick={applySuggestion} className="font-semibold text-green-600 hover:underline">{preferences.destination}, {countrySuggestion}</button>?
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget</label>
                        <div className="flex items-center gap-2">
                             <input type="number" name="budget" id="budget" value={preferences.budget} onChange={handleChange} min="100" step="100"
                                   className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                                   placeholder="e.g., 2000" />
                            <select name="currency" value={preferences.currency} onChange={handleChange} className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white">
                                {CURRENCY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                        <input type="date" name="startDate" id="startDate" value={preferences.startDate} onChange={handleChange} min={today}
                               className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                        <input type="date" name="endDate" id="endDate" value={preferences.endDate} onChange={handleChange} min={preferences.startDate}
                               className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white" />
                    </div>
                </div>

                {/* Interests */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests</label>
                    <div className="flex flex-wrap gap-3">
                        {INTERESTS_OPTIONS.map((interest) => (
                            <button key={interest} type="button" onClick={() => handleInterestChange(interest)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                        preferences.interests.includes(interest)
                                            ? 'bg-green-500 text-white shadow'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-600'
                                    }`}>
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit Button */}
                <div className="pt-2">
                    <button type="submit" disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:dark:bg-gray-600">
                        {isLoading ? (
                           <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                           </>
                        ) : 'Generate Itinerary'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TravelForm;