import React, { useState } from 'react';
import type { Itinerary, DailyPlan, Activity } from '../types';
import GeneratedImage from './GeneratedImage';
import MapView from './MapView';
import { getAttractionDetails } from '../services/geminiService';

interface ItineraryDisplayProps {
    itinerary: Itinerary;
    selectedActivity: { activity: Activity, day: number } | null;
    onActivitySelect: (activity: Activity | null, day?: number) => void;
}

const ActivityIcon = () => (
    <svg className="h-5 w-5 text-[var(--color-primary)] mr-3 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

const RestaurantIcon = () => (
     <svg className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
    </svg>
);

const WeatherIcon = () => (
    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-2.08-5.839c-1.135-.23-2.343-.394-3.566-.394a1.875 1.875 0 00-1.875 1.875c0 .355.085.694.238 1.008-1.03.26-1.996.685-2.828 1.25A3.75 3.75 0 004.5 15z" />
    </svg>
);

const TipsIcon = () => (
    <svg className="h-8 w-8 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="h-6 w-6 text-[var(--color-primary)] mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PackingListIcon = () => (
    <svg className="h-8 w-8 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CalendarDaysIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const TicketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
);

const InformationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const PlaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

interface ItineraryDayCardProps {
    plan: DailyPlan;
    destination: string;
    index: number;
    selectedActivity: { activity: Activity, day: number } | null;
    onActivitySelect: (activity: Activity | null, day?: number) => void;
}

const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ plan, destination, index, selectedActivity, onActivitySelect }) => {
    const keyAttraction = plan.activities.length > 0 ? plan.activities[0].attractionName : "scenic view";
    const [learnMoreState, setLearnMoreState] = useState<Record<string, { isOpen: boolean; data: { description: string; sources: Array<{uri: string, title: string}> } | null; isLoading: boolean; error: string | null }>>({});

    const getActivityId = (day: number, attractionName: string) => {
        return `activity-${day}-${attractionName.replace(/\s+/g, '-').toLowerCase()}`;
    };

    const handleLearnMoreClick = async (attractionName: string) => {
        const currentState = learnMoreState[attractionName];

        if (currentState?.isOpen) {
            setLearnMoreState(prev => ({ ...prev, [attractionName]: { ...prev[attractionName], isOpen: false } }));
            return;
        }

        if (currentState?.data) {
            setLearnMoreState(prev => ({ ...prev, [attractionName]: { ...prev[attractionName], isOpen: true } }));
            return;
        }

        setLearnMoreState(prev => ({ ...prev, [attractionName]: { isOpen: true, data: null, isLoading: true, error: null } }));
        try {
            const result = await getAttractionDetails(attractionName, destination);
            setLearnMoreState(prev => ({ ...prev, [attractionName]: { isOpen: true, data: result, isLoading: false, error: null } }));
        } catch (err) {
            setLearnMoreState(prev => ({ ...prev, [attractionName]: { isOpen: true, data: null, isLoading: false, error: 'Could not load details.' } }));
        }
    };

    const isDaySelected = selectedActivity?.day === plan.day;

    return (
        <div 
            className={`group bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] opacity-0 animate-fade-in ${isDaySelected ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] dark:ring-offset-[var(--dark-bg-primary)] ring-[var(--color-primary)] scale-105' : 'border border-[var(--border-color)] dark:border-[var(--dark-border-color)]'}`}
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <div className="h-56 w-full overflow-hidden">
                <GeneratedImage attractionName={keyAttraction} destination={destination} />
            </div>
            <div className="p-6">
                <h3 className="text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{plan.theme}</h3>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-bold text-[var(--color-primary)] dark:text-[var(--dark-color-primary)] uppercase tracking-wide">Day {plan.day}</p>
                    <div className="flex items-center gap-2">
                        <WeatherIcon />
                        <span>{plan.weather.forecast} &bull; {plan.weather.temperature}</span>
                    </div>
                </div>

                <hr className="my-4 border-[var(--border-color)] dark:border-[var(--dark-border-color)]" />
                
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-lg text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mb-3">Activities</h4>
                        <ul className="space-y-2">
                            {plan.activities.map((activity, activityIndex) => {
                                const isSelected = selectedActivity?.day === plan.day && selectedActivity?.activity.attractionName === activity.attractionName;
                                const currentLearnMoreState = learnMoreState[activity.attractionName];
                                return (
                                <li 
                                    key={activityIndex} 
                                    id={getActivityId(plan.day, activity.attractionName)}
                                    className={`activity-item flex flex-col ${isSelected ? 'selected' : ''}`}
                                    onClick={() => onActivitySelect(isSelected ? null : activity, plan.day)}
                                >
                                    <div className="flex items-start w-full">
                                        <ActivityIcon />
                                        <div>
                                            <span className="font-semibold text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">{activity.time}: </span>
                                            <span className="text-gray-500 dark:text-gray-400">{activity.description}</span>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="w-full pl-8 mt-3 animate-details-in space-y-3">
                                            <div className="p-3 bg-green-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-sm space-y-2">
                                                {activity.estimatedDuration && (
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                        <ClockIcon />
                                                        <strong>Duration:</strong> 
                                                        <span>{activity.estimatedDuration}</span>
                                                    </div>
                                                )}
                                                {activity.openingHours && (
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                        <CalendarDaysIcon />
                                                        <strong>Hours:</strong> 
                                                        <span>{activity.openingHours}</span>
                                                    </div>
                                                )}
                                                {activity.bookingInfo && (
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                        <TicketIcon />
                                                        <strong>Booking:</strong> 
                                                        <span>{activity.bookingInfo}</span>
                                                    </div>
                                                )}
                                            </div>
                                             {/* Learn More Section */}
                                            <div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleLearnMoreClick(activity.attractionName); }}
                                                    className="w-full flex items-center justify-center text-sm px-3 py-2 rounded-md font-semibold text-[var(--color-primary)] dark:text-[var(--dark-color-primary)] bg-[var(--color-primary-light)] dark:bg-gray-700/80 hover:bg-green-200/60 dark:hover:bg-gray-600/80 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                                    disabled={currentLearnMoreState?.isLoading}
                                                    aria-expanded={!!currentLearnMoreState?.isOpen}
                                                >
                                                    <InformationCircleIcon />
                                                    {currentLearnMoreState?.isLoading ? 'Loading...' : (currentLearnMoreState?.isOpen ? 'Hide Details' : 'Learn More')}
                                                </button>

                                                {currentLearnMoreState?.isOpen && (
                                                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-sm space-y-2 animate-details-in">
                                                        {currentLearnMoreState.isLoading ? (
                                                            <div className="flex justify-center items-center py-4">
                                                                <svg className="animate-spin h-6 w-6 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            </div>
                                                        ) : currentLearnMoreState.error ? (
                                                            <p className="text-red-500">{currentLearnMoreState.error}</p>
                                                        ) : currentLearnMoreState.data && (
                                                            <>
                                                                <p className="text-gray-700 dark:text-gray-300">{currentLearnMoreState.data.description}</p>
                                                                {currentLearnMoreState.data.sources.length > 0 && (
                                                                    <div className="pt-2">
                                                                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">Sources:</h5>
                                                                        <ul className="list-disc list-inside space-y-1">
                                                                            {currentLearnMoreState.data.sources.map((source, i) => (
                                                                                <li key={i}>
                                                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline">
                                                                                        {source.title}
                                                                                    </a>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            )})}
                        </ul>
                    </div>
                    <div className="flex items-start">
                        <RestaurantIcon />
                        <div>
                            <h4 className="font-semibold text-lg text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">Local Flavor</h4>
                            <p className="mt-1 text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] font-medium">{plan.foodToTry.dishName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Try it at: {plan.foodToTry.suggestedRestaurant}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FlightBookingCard: React.FC<{ destination: string, startDate: string, endDate: string }> = ({ destination, startDate, endDate }) => {
    if (!destination || !startDate || !endDate) return null;

    const flightSearchUrl = `https://www.google.com/search?q=flights+to+${encodeURIComponent(destination)}+departing+on+${startDate}+returning+on+${endDate}`;
    
    const formatDate = (dateString: string) => {
        // Adding a time to avoid timezone issues where the date might be interpreted as the previous day.
        return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    };

    return (
        <div className="p-6 my-8 rounded-xl bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg animate-scale-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold">Ready to Go?</h2>
                    <p className="text-lg opacity-90 mt-1">
                        Find flights for your trip from {formatDate(startDate)} to {formatDate(endDate)}.
                    </p>
                </div>
                <a
                    href={flightSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary)] font-bold rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
                >
                    <PlaneIcon />
                    <span>Search Flights</span>
                </a>
            </div>
        </div>
    );
};


const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, selectedActivity, onActivitySelect }) => {
    const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

    const handleShare = async () => {
        let summary = `✈️ My Trip Itinerary: ${itinerary.title} ✈️\n\n`;
        summary += `📍 Destination: ${itinerary.destination}\n`;
        summary += `⏳ Duration: ${itinerary.duration} day(s)\n\n`;

        itinerary.dailyPlans.sort((a, b) => a.day - b.day).forEach(plan => {
            summary += `--- DAY ${plan.day}: ${plan.theme} ---\n`;
            plan.activities.forEach(activity => {
                summary += `  • ${activity.time}: ${activity.description} (${activity.attractionName})\n`;
            });
            summary += `  🍽️ Eat: ${plan.foodToTry.dishName} at ${plan.foodToTry.suggestedRestaurant}\n\n`;
        });

        summary += "💡 Travel Tips:\n";
        itinerary.travelTips.forEach(tip => {
            summary += `  - ${tip.tip}: ${tip.explanation}\n`;
        });

        summary += "\nGenerated with AI Travel Planner!";

        const copyToClipboard = async () => {
            if (!navigator.clipboard) {
                alert('Automatic copying is not supported on your browser. Please copy the text manually from the console.');
                console.info("--- Your Itinerary to Copy ---");
                console.info(summary);
                return;
            }
            try {
                await navigator.clipboard.writeText(summary);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('idle'), 2500);
            } catch (copyError) {
                console.error('Failed to copy itinerary:', copyError);
                alert('Could not copy to clipboard. This feature may not be supported by your browser in this context (e.g., non-HTTPS page).');
            }
        };

        // Use Web Share API if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: itinerary.title,
                    text: summary,
                });
            } catch (error) {
                // Ignore AbortError which is triggered when user cancels the share dialog
                if (error instanceof DOMException && error.name === 'AbortError') {
                     console.log('Share cancelled by user.');
                } else {
                    console.error('Web Share API failed, falling back to clipboard:', error);
                    await copyToClipboard();
                }
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            await copyToClipboard();
        }
    };

    return (
        <div className="space-y-16 mt-12">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{itinerary.title}</h1>
                <p className="mt-2 text-xl text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">Your personalized {itinerary.duration}-day trip to {itinerary.destination}</p>
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleShare}
                        className="px-5 py-2.5 bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-full hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--dark-color-primary-light)] transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
                        aria-label="Share itinerary"
                        disabled={shareStatus === 'copied'}
                    >
                        <ShareIcon />
                        <span>{shareStatus === 'copied' ? 'Copied to Clipboard!' : 'Share Itinerary'}</span>
                    </button>
                </div>
            </header>

            {itinerary.startDate && itinerary.endDate && (
                <FlightBookingCard 
                    destination={itinerary.destination} 
                    startDate={itinerary.startDate} 
                    endDate={itinerary.endDate} 
                />
            )}

            {itinerary.coordinates && <MapView itinerary={itinerary} selectedActivity={selectedActivity} onActivitySelect={onActivitySelect} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {itinerary.dailyPlans.sort((a,b) => a.day - b.day).map((plan, index) => (
                    <ItineraryDayCard key={plan.day} plan={plan} destination={itinerary.destination} index={index} selectedActivity={selectedActivity} onActivitySelect={onActivitySelect} />
                ))}
            </div>

            {itinerary.packingList && itinerary.packingList.length > 0 && (
                <div 
                    className="bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] p-8 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-[var(--dark-border-color)] opacity-0 animate-scale-in"
                    style={{ animationDelay: `${itinerary.dailyPlans.length * 100}ms` }}
                >
                    <h3 className="text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mb-6 flex items-center gap-3"><PackingListIcon />Packing List</h3>
                    <ul className="space-y-5">
                        {itinerary.packingList.map((item, index) => (
                           <li key={index} className="flex items-start">
                               <CheckCircleIcon />
                               <div>
                                   <h4 className="font-semibold text-md text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{item.item}</h4>
                                   <p className="text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mt-1 text-sm">{item.reason}</p>
                               </div>
                           </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div 
              className="bg-[var(--color-primary-light)] dark:bg-gray-800/60 p-8 rounded-xl shadow-lg border-l-4 border-[var(--color-primary)] dark:border-[var(--dark-color-primary)] opacity-0 animate-scale-in"
              style={{ animationDelay: `${itinerary.dailyPlans.length * 100 + 150}ms` }}
            >
                <h3 className="text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mb-6 flex items-center gap-3"><TipsIcon />Travel Tips</h3>
                <ul className="space-y-5">
                    {itinerary.travelTips.map((tip, index) => (
                       <li key={index} className="flex items-start">
                           <CheckCircleIcon />
                           <div>
                               <h4 className="font-semibold text-md text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{tip.tip}</h4>
                               <p className="text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mt-1 text-sm">{tip.explanation}</p>
                           </div>
                       </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ItineraryDisplay;