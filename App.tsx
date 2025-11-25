import React, { useState, useCallback, useEffect } from 'react';
import type { TravelPreferences, Itinerary, Activity, SavedItinerary } from './types';
import { generateItinerary } from './services/geminiService';
import Header from './components/Header';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import SavedItineraries from './components/SavedItineraries';
import Toast from './components/Toast';

// --- Confirmation Modal Component ---
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDanger?: boolean;
}

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const QuestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--color-primary)] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    isDanger = true
}) => {
    const modalRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            modalRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className="relative bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] w-full max-w-md m-4 p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--border-color)] dark:border-[var(--dark-border-color)] text-center animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                {isDanger ? <WarningIcon /> : <QuestionIcon />}

                <h2 id="modal-title" className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mt-4">
                    {title}
                </h2>
                <p className="text-md text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] mt-2">
                    {message}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
                     <button
                        onClick={onConfirm}
                        className={`w-full sm:w-auto flex-1 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isDanger 
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                                : 'bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] hover:opacity-90 focus:ring-[var(--color-primary)]'
                        }`}
                    >
                        {confirmButtonText}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto flex-1 px-6 py-3 border border-[var(--border-color)] dark:border-[var(--dark-border-color)] text-base font-medium rounded-md shadow-sm text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {cancelButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [itinerary, setItinerary] = useState<Itinerary | SavedItinerary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<{ activity: Activity, day: number } | null>(null);
    const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
    
    // Confirmation States
    const [itineraryToDelete, setItineraryToDelete] = useState<string | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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

    const showToast = (message: string, type: 'error' | 'success' = 'error') => {
        setToast({ message, type });
    };

    const handleGenerateItinerary = useCallback(async (preferences: TravelPreferences) => {
        setIsLoading(true);
        setItinerary(null);
        setSelectedActivity(null);

        try {
            const result = await generateItinerary(preferences);
            setItinerary(result);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            showToast(errorMessage, 'error');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initiates the save process by opening the confirmation modal
    const handleSaveItinerary = useCallback(() => {
        if (!itinerary) return;
        
        // Don't open modal if it's already a saved one
        if ('id' in itinerary) {
            showToast('This itinerary is already saved.', 'error');
            return;
        }

        setIsSaveModalOpen(true);
    }, [itinerary]);

    // Executes the actual save logic after confirmation
    const executeSaveItinerary = useCallback(() => {
        if (!itinerary) return;
        
        // Final check
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
            showToast('Itinerary saved successfully!', 'success');
        } catch (error) {
            console.error("Failed to save itinerary to localStorage:", error);
            showToast("Could not save itinerary. Your browser's storage might be full.", 'error');
        } finally {
            setIsSaveModalOpen(false);
        }
    }, [itinerary, savedItineraries]);

    const handleLoadItinerary = useCallback((id: string) => {
        const itineraryToLoad = savedItineraries.find(it => it.id === id);
        if (itineraryToLoad) {
            setItinerary(itineraryToLoad);
            setIsLoading(false);
            setSelectedActivity(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [savedItineraries]);

    const handleDeleteRequest = useCallback((id: string) => {
        setItineraryToDelete(id);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (!itineraryToDelete) return;
        
        const updatedSavedItineraries = savedItineraries.filter(it => it.id !== itineraryToDelete);
        setSavedItineraries(updatedSavedItineraries);
        try {
            localStorage.setItem('saved-travel-itineraries', JSON.stringify(updatedSavedItineraries));
            showToast('Itinerary deleted.', 'success');
        } catch (error) {
            console.error("Failed to update localStorage after deletion:", error);
            showToast('Could not update saved itineraries.', 'error');
        }
        setItineraryToDelete(null); // Close modal
    }, [itineraryToDelete, savedItineraries]);

    const handleCancelDelete = () => {
        setItineraryToDelete(null);
    };


    return (
        <div className="min-h-screen bg-[var(--bg-primary)] dark:bg-[var(--dark-bg-primary)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-7xl mx-auto">
                <Header />
                <main>
                    <SavedItineraries 
                        itineraries={savedItineraries}
                        onLoad={handleLoadItinerary}
                        onDelete={handleDeleteRequest}
                    />

                    <TravelForm onGenerate={handleGenerateItinerary} isLoading={isLoading} onShowToast={showToast} />

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
                                onShowToast={showToast}
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
            
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!itineraryToDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to permanently delete this saved trip? This action cannot be undone."
                confirmButtonText="Delete"
                isDanger={true}
            />

            {/* Save Confirmation Modal */}
            <ConfirmationModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={executeSaveItinerary}
                title="Save Itinerary"
                message="Do you want to save this itinerary to your list for future reference?"
                confirmButtonText="Save Itinerary"
                isDanger={false}
            />
        </div>
    );
};

export default App;