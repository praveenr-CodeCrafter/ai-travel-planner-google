import React, { useState, useCallback, useEffect } from 'react';
import type { TravelPreferences, Itinerary, Activity } from './types';
import { generateItinerary } from './services/geminiService';
import Header from './components/Header';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<{ activity: Activity, day: number } | null>(null);

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


    const handleActivitySelect = (activity: Activity | null, day?: number) => {
        if (activity && day !== undefined) {
            setSelectedActivity({ activity, day });
        } else {
            setSelectedActivity(null);
        }
    };

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

    return (
        <div className="min-h-screen bg-green-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main>
                    <TravelForm onGenerate={handleGenerateItinerary} isLoading={isLoading} />
                    
                    {error && (
                        <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg shadow-md text-center">
                            <h3 className="font-bold">Generation Failed</h3>
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
                            />
                        </div>
                    )}
                </main>
                 <footer className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Powered by Google Gemini. Itinerary and images are AI-generated and may require verification.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;