import React, { useState, useEffect, useRef } from 'react';
import type { TravelPreferences } from '../types';
import { INTERESTS_OPTIONS, CURRENCY_OPTIONS, COUNTRIES } from '../types';

interface TravelFormProps {
    onGenerate: (preferences: TravelPreferences) => void;
    isLoading: boolean;
}

const CheckIcon: React.FC = () => (
    <svg className="h-4 w-4 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


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
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const destinationRef = useRef<HTMLDivElement>(null);

    const [isOtherInterestSelected, setIsOtherInterestSelected] = useState(false);
    const [otherInterest, setOtherInterest] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPreferences({ ...preferences, destination: value });

        if (value.length >= 3) {
            const filtered = COUNTRIES.filter(country =>
                country.toLowerCase().startsWith(value.toLowerCase())
            );
            setDestinationSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setDestinationSuggestions([]);
            setShowSuggestions(false);
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setPreferences(prev => ({ ...prev, destination: suggestion }));
        setShowSuggestions(false);
        setDestinationSuggestions([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const handleInterestChange = (interest: string) => {
        const newInterests = preferences.interests.includes(interest)
            ? preferences.interests.filter((i) => i !== interest)
            : [...preferences.interests, interest];
        setPreferences({ ...preferences, interests: newInterests });
    };

    const handleOtherInterestClick = () => {
        const nextState = !isOtherInterestSelected;
        setIsOtherInterestSelected(nextState);

        // If we are deselecting 'Other'
        if (!nextState) {
            // Remove the custom interest from the list
            setPreferences(prev => ({
                ...prev,
                interests: prev.interests.filter(i => i !== otherInterest)
            }));
            setOtherInterest(''); // Clear the input value
        }
    };

    const handleOtherInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCustomValue = e.target.value;
        const oldCustomValue = otherInterest; // Capture old value before state update

        setPreferences(prev => {
            const interestsWithoutOld = prev.interests.filter(i => i !== oldCustomValue);
            const newInterests = newCustomValue.trim()
                ? [...interestsWithoutOld, newCustomValue.trim()]
                : interestsWithoutOld;
            return { ...prev, interests: newInterests };
        });
        
        setOtherInterest(newCustomValue); // Update the state for the input field
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (!preferences.destination.trim()) {
            setError("Please enter a destination.");
            return;
        }
        if (new Date(preferences.endDate) < new Date(preferences.startDate)) {
            setError("End date cannot be before start date.");
            return;
        }
        
        const finalInterests = preferences.interests.filter(i => i.trim() !== '');
        if (finalInterests.length === 0) {
            setError("Please select at least one interest.");
            return;
        }
        setError(null);
        onGenerate({...preferences, interests: finalInterests});
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Plan Your Next Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative" ref={destinationRef}>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                        <input type="text" name="destination" id="destination" value={preferences.destination} onChange={handleDestinationChange} autoComplete="off"
                               className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                               placeholder="e.g., Paris, France" />
                        {showSuggestions && destinationSuggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                                {destinationSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-green-100 dark:hover:bg-gray-700"
                                        onMouseDown={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
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
                        {INTERESTS_OPTIONS.map((interest) => {
                             const isSelected = preferences.interests.includes(interest);
                             return (
                                <button key={interest} type="button" onClick={() => handleInterestChange(interest)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                                            isSelected
                                                ? 'bg-green-500 text-white shadow'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-600'
                                        }`}>
                                    {isSelected && <CheckIcon />}
                                    {interest}
                                </button>
                             );
                        })}
                        <button type="button" onClick={handleOtherInterestClick}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                                    isOtherInterestSelected
                                        ? 'bg-green-500 text-white shadow'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-600'
                                }`}>
                            {isOtherInterestSelected && <CheckIcon />}
                            Other
                        </button>
                    </div>
                     {isOtherInterestSelected && (
                        <div className="mt-4">
                            <label htmlFor="otherInterest" className="sr-only">Other interest</label>
                            <input
                                id="otherInterest"
                                type="text"
                                value={otherInterest}
                                onChange={handleOtherInterestChange}
                                className="w-full md:w-2/3 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
                                placeholder="Type your custom interest..."
                                aria-label="Custom interest input"
                            />
                        </div>
                    )}
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