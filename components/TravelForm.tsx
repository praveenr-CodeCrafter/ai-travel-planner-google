import React, { useState, useEffect, useRef } from 'react';
import type { TravelPreferences } from '../types';
import { INTERESTS_OPTIONS, CURRENCY_OPTIONS } from '../types';
import { validateDestination, getPlaceSuggestions } from '../services/geminiService';

interface TravelFormProps {
    onGenerate: (preferences: TravelPreferences) => void;
    isLoading: boolean;
    onShowToast: (message: string, type?: 'error' | 'success') => void;
}

const CheckIcon: React.FC = () => (
    <svg className="h-4 w-4 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// --- New DatePicker Icons ---
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7-7" />
    </svg>
);


// --- Custom DatePicker Component ---
interface DatePickerProps {
    id: string;
    value: string;
    onChange: (date: string) => void;
    minDate: string;
    rangeStart: string;
    rangeEnd: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ id, value, onChange, minDate, rangeStart, rangeEnd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getInitialDate = () => {
        const d = new Date(value + 'T00:00:00');
        return isNaN(d.getTime()) ? today : d;
    };
    
    const [viewDate, setViewDate] = useState(getInitialDate());
    const [focusedDate, setFocusedDate] = useState(getInitialDate());

    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLInputElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    // Update view and focus dates when value prop changes
    useEffect(() => {
        const newDate = getInitialDate();
        setViewDate(newDate);
        setFocusedDate(newDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Focus management when calendar opens/closes or focusedDate changes
    useEffect(() => {
        if (isOpen) {
            const focusedDayButton = dialogRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focusedDate.toISOString().split('T')[0]}"]`);
            focusedDayButton?.focus();
        } else {
            // Only focus trigger if an element inside the dialog was last focused
            if (dialogRef.current?.contains(document.activeElement)) {
                triggerRef.current?.focus();
            }
        }
    }, [isOpen, focusedDate]);

    // Reset focused date to selection when calendar opens
    useEffect(() => {
        if (isOpen) {
            const initial = getInitialDate();
            setFocusedDate(initial);
            setViewDate(initial);
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps


    const handleMonthChange = (offset: number) => {
        setViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const handleDateClick = (day: Date) => {
        onChange(day.toISOString().split('T')[0]);
        setIsOpen(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        let newFocusedDate = new Date(focusedDate);
        let keyHandled = false;
        
        switch (e.key) {
            case 'ArrowLeft':
                newFocusedDate.setDate(newFocusedDate.getDate() - 1);
                keyHandled = true;
                break;
            case 'ArrowRight':
                newFocusedDate.setDate(newFocusedDate.getDate() + 1);
                keyHandled = true;
                break;
            case 'ArrowUp':
                newFocusedDate.setDate(newFocusedDate.getDate() - 7);
                keyHandled = true;
                break;
            case 'ArrowDown':
                newFocusedDate.setDate(newFocusedDate.getDate() + 7);
                keyHandled = true;
                break;
            case 'PageUp':
                newFocusedDate.setMonth(newFocusedDate.getMonth() - 1);
                keyHandled = true;
                break;
            case 'PageDown':
                newFocusedDate.setMonth(newFocusedDate.getMonth() + 1);
                keyHandled = true;
                break;
            case 'Home':
                newFocusedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
                keyHandled = true;
                break;
            case 'End':
                 newFocusedDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
                 keyHandled = true;
                 break;
            case 'Enter':
            case ' ':
                 handleDateClick(focusedDate);
                 keyHandled = true;
                 break;
            case 'Escape':
                setIsOpen(false);
                keyHandled = true;
                break;
        }

        if (keyHandled) {
            e.preventDefault();
            
            if (newFocusedDate.getMonth() !== viewDate.getMonth() || newFocusedDate.getFullYear() !== viewDate.getFullYear()) {
                 setViewDate(newFocusedDate);
            }
            setFocusedDate(newFocusedDate);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Select a date";
        return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const minDateTime = new Date(minDate + 'T00:00:00').getTime();
        const startDateTime = rangeStart ? new Date(rangeStart + 'T00:00:00').getTime() : NaN;
        const endDateTime = rangeEnd ? new Date(rangeEnd + 'T00:00:00').getTime() : NaN;
        
        const todayTime = today.getTime();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`prev-${i}`} aria-hidden="true"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            const currentDateStr = currentDate.toISOString().split('T')[0];
            const currentTime = currentDate.getTime();
            const isDisabled = currentTime < minDateTime;

            const isStartDate = currentTime === startDateTime;
            const isEndDate = currentTime === endDateTime;
            const isInRange = currentTime > startDateTime && currentTime < endDateTime;
            const isToday = currentTime === todayTime;
            const isSingleDaySelection = startDateTime === endDateTime;
            const isFocused = focusedDate.getTime() === currentTime;

            let containerClasses = "flex items-center justify-center h-10";
            let dayClasses = "w-10 h-10 flex items-center justify-center text-sm transition-colors duration-150 ease-in-out rounded-full focus:outline-none";

            if (isDisabled) {
                dayClasses += " text-gray-300 dark:text-gray-600 cursor-not-allowed";
            } else {
                dayClasses += " cursor-pointer";

                if (isStartDate || isEndDate) {
                    dayClasses += " bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold shadow-md";
                    if (!isSingleDaySelection) {
                        containerClasses += " bg-[var(--color-primary-light)] dark:bg-[var(--dark-color-primary-light)]";
                        if (isStartDate) containerClasses += " rounded-l-full";
                        if (isEndDate) containerClasses += " rounded-r-full";
                    }
                } else if (isInRange) {
                    containerClasses += " bg-[var(--color-primary-light)] dark:bg-[var(--dark-color-primary-light)]";
                    dayClasses += " text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] rounded-none w-full hover:bg-green-200/60 dark:hover:bg-gray-600/50";
                } else {
                    dayClasses += " text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] hover:bg-[var(--bg-muted)] dark:hover:bg-gray-700/50";
                    if (isToday) {
                        dayClasses += " ring-1 ring-inset ring-[var(--color-primary)]/70 dark:ring-[var(--dark-color-primary)]/70";
                    }
                }
            }

            if (isFocused) {
                 dayClasses += " ring-2 ring-offset-2 ring-[var(--color-primary)] ring-offset-[var(--bg-secondary)] dark:ring-offset-[var(--dark-bg-secondary)]";
            }

            days.push(
                <div key={i} className={containerClasses} role="gridcell" aria-selected={isStartDate || isEndDate || isInRange}>
                    <button
                        type="button"
                        onClick={() => !isDisabled && handleDateClick(currentDate)}
                        disabled={isDisabled}
                        className={dayClasses}
                        aria-pressed={isStartDate || isEndDate || isInRange}
                        aria-label={currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        aria-current={isToday ? "date" : undefined}
                        data-date={currentDateStr}
                        tabIndex={-1}
                    >
                        {i}
                    </button>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CalendarIcon />
                </div>
                <input
                    ref={triggerRef}
                    id={id}
                    type="text"
                    readOnly
                    value={formatDate(value)}
                    onClick={() => setIsOpen(!isOpen)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(true); } }}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] cursor-pointer"
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? "date-picker-dialog" : undefined}
                />
            </div>
            {isOpen && (
                <div
                    ref={dialogRef}
                    id="date-picker-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="calendar-heading"
                    onKeyDown={handleKeyDown}
                    className="absolute z-20 mt-2 w-72 bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] rounded-xl shadow-2xl p-4 animate-calendar-in"
                >
                    <div className="flex justify-between items-center mb-4">
                        <button type="button" onClick={() => handleMonthChange(-1)} aria-label="Previous month" className="p-2.5 rounded-full hover:bg-[var(--bg-muted)] dark:hover:bg-gray-700 text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] transition-colors"><ChevronLeftIcon /></button>
                        <span id="calendar-heading" aria-live="polite" className="font-semibold text-base text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                            {viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </span>
                        <button type="button" onClick={() => handleMonthChange(1)} aria-label="Next month" className="p-2.5 rounded-full hover:bg-[var(--bg-muted)] dark:hover:bg-gray-700 text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] transition-colors"><ChevronRightIcon /></button>
                    </div>
                    <div role="grid" aria-labelledby="calendar-heading">
                        <div role="row" className="grid grid-cols-7 text-center text-xs font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] opacity-70 mb-2">
                           {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} role="columnheader" aria-label={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7">
                            {renderCalendar()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
// --- End Custom DatePicker Component ---

const TravelForm: React.FC<TravelFormProps> = ({ onGenerate, isLoading, onShowToast }) => {
    const today = new Date().toISOString().split('T')[0];
    
    const [isValidating, setIsValidating] = useState(false);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

    const [preferences, setPreferences] = useState<TravelPreferences>({
        destination: '',
        budget: '2000',
        currency: 'USD',
        startDate: today,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        interests: ['Sightseeing'],
    });
    
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const destinationRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<number | null>(null);

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
    
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    
        if (value.length < 3) {
            setDestinationSuggestions([]);
            setShowSuggestions(false);
            return;
        }
    
        setShowSuggestions(true);
        setIsFetchingSuggestions(true);
    
        debounceTimeoutRef.current = window.setTimeout(async () => {
            try {
                const suggestions = await getPlaceSuggestions(value);
                setDestinationSuggestions(suggestions);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setDestinationSuggestions([]);
            } finally {
                setIsFetchingSuggestions(false);
            }
        }, 300); // 300ms debounce delay
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setPreferences(prev => ({ ...prev, destination: suggestion }));
        setShowSuggestions(false);
        setDestinationSuggestions([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPreferences({ ...preferences, [e.target.name]: e.target.value });
    };

    const handleStartDateChange = (date: string) => {
        const newStartDate = new Date(date + 'T00:00:00');
        const currentEndDate = new Date(preferences.endDate + 'T00:00:00');
        if (newStartDate > currentEndDate) {
            setPreferences(prev => ({ ...prev, startDate: date, endDate: date }));
        } else {
            setPreferences(prev => ({ ...prev, startDate: date }));
        }
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

    const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === preferences.currency);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (!preferences.destination.trim()) {
            onShowToast("Please enter a destination.", 'error');
            return;
        }

        const budgetValue = parseFloat(preferences.budget);
        if (isNaN(budgetValue) || budgetValue < 100) {
            onShowToast(`Budget must be a valid number of at least ${selectedCurrency?.symbol ?? ''}100.`, 'error');
            return;
        }
        
        const finalInterests = preferences.interests.filter(i => i.trim() !== '');
        if (finalInterests.length === 0) {
            onShowToast("Please select at least one interest.", 'error');
            return;
        }

        setIsValidating(true);
        try {
            const isDestinationValid = await validateDestination(preferences.destination);
            if (!isDestinationValid) {
                onShowToast("Please enter a valid travel destination (e.g., a city, region, or country).", 'error');
                return;
            }
        } catch (error) {
            // Log error but proceed (fail-open)
            console.error("Destination validation failed:", error);
        } finally {
            setIsValidating(false);
        }

        onGenerate({...preferences, interests: finalInterests});
    };

    return (
        <div className="bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] p-8 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-[var(--dark-border-color)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mb-6">Plan Your Next Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative" ref={destinationRef}>
                        <label htmlFor="destination" className="block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-1">Destination</label>
                        <input type="text" name="destination" id="destination" value={preferences.destination} onChange={handleDestinationChange} autoComplete="off"
                               className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"
                               placeholder="e.g., Paris, France" />
                        {showSuggestions && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                                {isFetchingSuggestions ? (
                                    <li className="px-4 py-2 text-gray-500 dark:text-gray-400 italic">Searching for places...</li>
                                ) : destinationSuggestions.length > 0 ? (
                                    destinationSuggestions.map((suggestion) => (
                                        <li
                                            key={suggestion}
                                            className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-[var(--color-primary-light)] dark:hover:bg-gray-700"
                                            onMouseDown={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-gray-500 dark:text-gray-400">No matching places found.</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-1">Budget</label>
                        <div className="flex items-center gap-2">
                             <div className="relative flex-grow">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 dark:text-gray-400">{selectedCurrency?.symbol ?? '$'}</span>
                                </div>
                                <input type="number" name="budget" id="budget" value={preferences.budget} onChange={handleChange} min="100" step="100"
                                    className="w-full py-2 pl-10 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"
                                    placeholder="e.g., 2000" />
                            </div>
                            <select name="currency" value={preferences.currency} onChange={handleChange} className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                                {CURRENCY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-1">Start Date</label>
                        <DatePicker
                            id="startDate"
                            value={preferences.startDate}
                            onChange={handleStartDateChange}
                            minDate={today}
                            rangeStart={preferences.startDate}
                            rangeEnd={preferences.endDate}
                        />
                    </div>
                     <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-1">End Date</label>
                        <DatePicker
                            id="endDate"
                            value={preferences.endDate}
                            onChange={(date) => setPreferences(prev => ({...prev, endDate: date}))}
                            minDate={preferences.startDate}
                            rangeStart={preferences.startDate}
                            rangeEnd={preferences.endDate}
                        />
                    </div>
                </div>

                {/* Interests */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-2">Interests</label>
                    <div className="flex flex-wrap gap-3">
                        {INTERESTS_OPTIONS.map((interest) => {
                             const isSelected = preferences.interests.includes(interest);
                             return (
                                <button key={interest} type="button" onClick={() => handleInterestChange(interest)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                                            isSelected
                                                ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow'
                                                : 'bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] text-[var(--text-inverted)] dark:text-[var(--dark-text-inverted)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--dark-color-primary-light)]'
                                        }`}>
                                    {isSelected && <CheckIcon />}
                                    {interest}
                                </button>
                             );
                        })}
                        <button type="button" onClick={handleOtherInterestClick}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                                    isOtherInterestSelected
                                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow'
                                        : 'bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] text-[var(--text-inverted)] dark:text-[var(--dark-text-inverted)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--dark-color-primary-light)]'
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
                                className="w-full md:w-2/3 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"
                                placeholder="Type your custom interest..."
                                aria-label="Custom interest input"
                            />
                        </div>
                    )}
                </div>
                
                {/* Action Buttons */}
                <div className="pt-2">
                    <button type="submit" disabled={isLoading || isValidating}
                            className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:dark:bg-gray-600">
                        {isLoading || isValidating ? (
                           <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isLoading ? 'Generating...' : 'Validating...'}
                           </>
                        ) : 'Generate Itinerary'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TravelForm;