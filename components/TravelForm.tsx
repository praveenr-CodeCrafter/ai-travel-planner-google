import React, { useState, useEffect, useRef } from 'react';
import type { TravelPreferences } from '../types';
import { INTERESTS_OPTIONS, CURRENCY_OPTIONS } from '../types';
import { validateDestination, getPlaceSuggestions } from '../services/geminiService';

interface TravelFormProps {
    onGenerate: (preferences: TravelPreferences) => void;
    isLoading: boolean;
    onShowToast: (message: string, type?: 'error' | 'success') => void;
}

const FoodIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 4.75A2.75 2.75 0 014.75 2h10.5A2.75 2.75 0 0118 4.75v10.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25V4.75zM4.75 3.5a1.25 1.25 0 00-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V4.75c0-.69-.56-1.25-1.25-1.25H4.75z" />
        <path d="M6.5 12.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM7 7a.5.5 0 000 1h6a.5.5 0 000-1H7z" />
    </svg>
);
const AdventureIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 14.482a1 1 0 001.414 1.414L10 12.364l3.536 3.536a1 1 0 001.414-1.414L11.414 10l3.536-3.536a1 1 0 00-1.414-1.414L10 8.586 6.464 5.05A1 1 0 005.05 6.464L8.586 10l-3.536 3.536z" clipRule="evenodd" />
    </svg>
);
const SightseeingIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);
const RelaxationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);
const HistoryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm.5 3h11a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5zM6 14a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
    </svg>
);
const ArtCultureIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 2.293a1 1 0 011.414 0l.001.001a1 1 0 010 1.414l-11 11A1 1 0 016 15H3a1 1 0 01-1-1V5a1 1 0 011.707-.707l1.414-1.414a1 1 0 011.414 0l4.293 4.293L17.293 2.293z" />
    </svg>
);

const INTEREST_ICONS: { [key: string]: React.FC } = {
    "Food": FoodIcon,
    "Adventure": AdventureIcon,
    "Sightseeing": SightseeingIcon,
    "Relaxation": RelaxationIcon,
    "History": HistoryIcon,
    "Art & Culture": ArtCultureIcon,
};

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
            const dayOfWeek = currentDate.getDay();

            let containerClasses = "flex items-center justify-center h-10";
            let dayClasses = "w-10 h-10 flex items-center justify-center text-sm transition-colors duration-150 ease-in-out rounded-full focus:outline-none";

            if (isDisabled) {
                dayClasses += " text-gray-300 dark:text-gray-600 cursor-not-allowed";
            } else {
                dayClasses += " cursor-pointer";
        
                const dateIsPartOfRange = !isSingleDaySelection && (isInRange || isStartDate || isEndDate);
                
                // Set styles for the number button itself
                if (isStartDate || isEndDate) {
                    dayClasses += " bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold shadow-md z-10"; // z-10 to be on top of container bg
                } else if (isInRange) {
                    dayClasses = dayClasses.replace('rounded-full', 'rounded-none w-full');
                    dayClasses += " text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--dark-color-primary)]/10";
                } else {
                    dayClasses += " text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] hover:bg-[var(--bg-muted)] dark:hover:bg-gray-700/50";
                    if (isToday) {
                        dayClasses += " ring-1 ring-inset ring-[var(--color-primary)]/70 dark:ring-[var(--dark-color-primary)]/70";
                    }
                }
                
                // Set background and rounding for the container to create the range highlight effect
                if (dateIsPartOfRange) {
                    containerClasses += " bg-[var(--color-primary-light)] dark:bg-[var(--dark-color-primary-light)] relative"; // relative for z-index
                    
                    const isStartOfWeek = dayOfWeek === 0;
                    const isEndOfWeek = dayOfWeek === 6;
        
                    let roundingClasses = "";
                    // Round left if it's the start of the whole range OR a day in range at the start of a week
                    if (isStartDate || (isInRange && isStartOfWeek)) {
                        roundingClasses += " rounded-l-full";
                    }
                    // Round right if it's the end of the whole range OR a day in range at the end of a week
                    if (isEndDate || (isInRange && isEndOfWeek)) {
                        roundingClasses += " rounded-r-full";
                    }
                    containerClasses += roundingClasses;
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
                    className="w-full pl-10 pr-4 py-2 bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] rounded-md shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] cursor-pointer"
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
                    className="absolute z-30 top-full mt-2 w-full bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] rounded-xl shadow-2xl p-4 animate-calendar-in"
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
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const [preferences, setPreferences] = useState<TravelPreferences>({
        destination: '',
        budget: '2000',
        currency: 'USD',
        startDate: today,
        endDate: nextWeek,
        interests: []
    });

    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPreferences({ ...preferences, destination: value });

        if (value.length >= 3) {
            setIsFetchingSuggestions(true);
            if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
            suggestionTimeoutRef.current = setTimeout(async () => {
                const suggestions = await getPlaceSuggestions(value);
                setDestinationSuggestions(suggestions);
                setIsFetchingSuggestions(false);
                setShowSuggestions(true);
            }, 500);
        } else {
            setDestinationSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setPreferences({ ...preferences, destination: suggestion });
        setShowSuggestions(false);
    };

    const handleInterestToggle = (interest: string) => {
        setPreferences(prev => {
            const current = prev.interests;
            if (current.includes(interest)) {
                return { ...prev, interests: current.filter(i => i !== interest) };
            } else {
                return { ...prev, interests: [...current, interest] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Client-side validation
        if (!preferences.destination.trim()) {
            onShowToast("Please enter a destination.", "error");
            return;
        }

        const budgetValue = parseFloat(preferences.budget);
        if (isNaN(budgetValue) || budgetValue < 100) {
            onShowToast("Budget must be at least 100.", "error");
            return;
        }

        if (preferences.interests.length === 0) {
            onShowToast("Please select at least one interest.", "error");
            return;
        }

        if (new Date(preferences.endDate) < new Date(preferences.startDate)) {
            onShowToast("End date cannot be before start date.", "error");
            return;
        }

        onGenerate(preferences);
    };

    return (
        <div className="max-w-4xl mx-auto bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] rounded-2xl shadow-xl p-6 md:p-10 mb-8 border border-[var(--border-color)] dark:border-[var(--dark-border-color)] animate-fade-in relative overflow-visible">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mb-8 text-center">Plan Your Dream Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Destination Input */}
                    <div className="relative">
                        <label htmlFor="destination" className="block text-sm font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-2">Destination</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="destination"
                                value={preferences.destination}
                                onChange={handleDestinationChange}
                                placeholder="e.g., Kyoto, Paris, Cape Town"
                                className="w-full px-4 py-3 bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] transition-all duration-200"
                                required
                            />
                             {isFetchingSuggestions && (
                                <div className="absolute right-3 top-3">
                                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {showSuggestions && destinationSuggestions.length > 0 && (
                            <ul ref={suggestionsRef} className="absolute z-50 w-full bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] mt-1 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-scale-in">
                                {destinationSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-3 hover:bg-[var(--bg-muted)] dark:hover:bg-[var(--dark-bg-muted)] cursor-pointer text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Budget & Currency */}
                    <div className="grid grid-cols-3 gap-2">
                         <div className="col-span-2">
                            <label htmlFor="budget" className="block text-sm font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-2">Budget</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="budget"
                                    min="0"
                                    value={preferences.budget}
                                    onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                                    className="w-full pl-7 pr-4 py-3 bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] transition-all duration-200"
                                    required
                                />
                            </div>
                         </div>
                         <div className="col-span-1">
                             <label htmlFor="currency" className="block text-sm font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-2">Currency</label>
                             <select
                                id="currency"
                                value={preferences.currency}
                                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                className="w-full px-3 py-3 bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] transition-all duration-200 appearance-none"
                            >
                                {CURRENCY_OPTIONS.map(opt => (
                                    <option key={opt.code} value={opt.code}>{opt.code}</option>
                                ))}
                            </select>
                         </div>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-2">Start Date</label>
                        <DatePicker 
                            id="startDate"
                            value={preferences.startDate}
                            onChange={(date) => setPreferences({ ...preferences, startDate: date })}
                            minDate={today}
                            rangeStart={preferences.startDate}
                            rangeEnd={preferences.endDate}
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-2">End Date</label>
                         <DatePicker 
                            id="endDate"
                            value={preferences.endDate}
                            onChange={(date) => setPreferences({ ...preferences, endDate: date })}
                            minDate={preferences.startDate}
                            rangeStart={preferences.startDate}
                            rangeEnd={preferences.endDate}
                        />
                    </div>
                </div>

                {/* Interests */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-4">Interests (Select at least one)</label>
                    <div className="flex flex-wrap gap-3">
                        {INTERESTS_OPTIONS.map((interest) => {
                            const Icon = INTEREST_ICONS[interest];
                            const isSelected = preferences.interests.includes(interest);
                            return (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => handleInterestToggle(interest)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm border ${
                                        isSelected
                                            ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] border-[var(--color-primary)] shadow-md ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] dark:ring-offset-[var(--dark-bg-secondary)] ring-[var(--color-primary)]'
                                            : 'bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] border-[var(--border-color)] dark:border-[var(--dark-border-color)] hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {Icon && <Icon />}
                                    {interest}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl hover:opacity-95 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Planning your trip...
                            </>
                        ) : (
                            'Generate My Itinerary'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TravelForm;