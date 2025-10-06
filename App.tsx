import React, { useState, useCallback, useEffect } from 'react';
import type { TravelPreferences, Itinerary, Activity, SavedItinerary } from './types';
import { generateItinerary } from './services/geminiService';
import Header from './components/Header';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import SavedItineraries from './components/SavedItineraries';

const App: React.FC = () => {
    const [itinerary, setItinerary] = useState<Itinerary | SavedItinerary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<{ activity: Activity, day: number } | null>(null);
    const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);

    useEffect(() => {
        try {
            const storedItineraries = localStorage.getItem('saved-travel-itineraries');
            if (storedItineraries) {
                setSavedItineraries(JSON.parse(storedItineraries));
            }
        } catch (error) {
            console.error("Failed to load saved itineraries from localStorage:", error);
        }
    }, []);

    const getActivityId = (day: number, attractionName: string) => {
        return `activity-${day}-${attractionName.replace(/\s+/g, '-').toLowerCase()}`;
    };
    
    useEffect(() => {
        if (selectedActivity) {
            const { activity, day } = selectedActivity;
            const elementId = getActivityId(day, activity.attractionName);
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [selectedActivity]);


    const handleActivitySelect = useCallback((activity: Activity | null, day?: number) => {
        if (activity && day !== undefined) {
            setSelectedActivity({ activity, day });
        } else {
            setSelectedActivity(null);
        }
    }, []);

    const handleGenerateItinerary = useCallback(async (preferences: TravelPreferences) => {
        setIsLoading(true);
        setError(null);
        setItinerary(null);
        setSelectedActivity(null);

        try {
            const result = await generateItinerary(preferences);
            setItinerary(result);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSaveItinerary = useCallback(() => {
        if (!itinerary) return;
        
        // Don't save if it's already a saved one
        if ('id' in itinerary) return;

        const newSavedItinerary: SavedItinerary = {
            ...itinerary,
            id: `itinerary-${Date.now()}`,
            savedAt: new Date().toISOString(),
        };

        const updatedSavedItineraries = [newSavedItinerary, ...savedItineraries];
        setSavedItineraries(updatedSavedItineraries);
        try {
            localStorage.setItem('saved-travel-itineraries', JSON.stringify(updatedSavedItineraries));
        } catch (error) {
            console.error("Failed to save itinerary to localStorage:", error);
            setError("Could not save itinerary. Your browser's storage might be full.");
        }
    }, [itinerary, savedItineraries]);

    const handleLoadItinerary = useCallback((id: string) => {
        const itineraryToLoad = savedItineraries.find(it => it.id === id);
        if (itineraryToLoad) {
            setItinerary(itineraryToLoad);
            setError(null);
            setIsLoading(false);
            setSelectedActivity(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [savedItineraries]);

    const handleDeleteItinerary = useCallback((id: string) => {
        const updatedSavedItineraries = savedItineraries.filter(it => it.id !== id);
        setSavedItineraries(updatedSavedItineraries);
        try {
            localStorage.setItem('saved-travel-itineraries', JSON.stringify(updatedSavedItineraries));
        } catch (error) {
            console.error("Failed to update localStorage after deletion:", error);
        }
    }, [savedItineraries]);


    return (
        <div className="min-h-screen bg-[var(--bg-primary)] dark:bg-[var(--dark-bg-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main>
                    <SavedItineraries 
                        itineraries={savedItineraries}
                        onLoad={handleLoadItinerary}
                        onDelete={handleDeleteItinerary}
                    />

                    <TravelForm onGenerate={handleGenerateItinerary} isLoading={isLoading} />
                    
                    {error && (
                        <div className="mt-8 p-4 bg-[var(--color-error-bg)] dark:bg-[var(--dark-color-error-bg)] border border-red-400 dark:border-red-600 text-[var(--color-error)] dark:text-[var(--dark-color-error)] rounded-lg shadow-md text-center">
                            <h3 className="font-bold">An Error Occurred</h3>
                            <p>{error}</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="mt-8">
                            <LoadingSpinner />
                        </div>
                    )}

                    {itinerary && !isLoading && (
                         <div className="mt-8">
                            <ItineraryDisplay 
                                itinerary={itinerary} 
                                selectedActivity={selectedActivity}
                                onActivitySelect={handleActivitySelect}
                                onSaveItinerary={handleSaveItinerary}
                            />
                        </div>
                    )}
                </main>
                 <footer className="text-center mt-12 py-6 border-t border-[var(--border-color)] dark:border-[var(--dark-border-color)]">
                    <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                        Powered by Google Gemini. Itinerary and images are AI-generated and may require verification.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;