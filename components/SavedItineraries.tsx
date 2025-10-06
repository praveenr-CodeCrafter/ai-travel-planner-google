import React from 'react';
import type { SavedItinerary } from '../types';

const TripsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

const LoadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


interface SavedItinerariesProps {
    itineraries: SavedItinerary[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
}

const SavedItineraries: React.FC<SavedItinerariesProps> = ({ itineraries, onLoad, onDelete }) => {
    if (itineraries.length === 0) {
        return null;
    }
    
    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] p-8 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-[var(--dark-border-color)] mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mb-6 flex items-center gap-3">
                <TripsIcon />
                Your Saved Trips
            </h2>
            <ul className="space-y-4">
                {itineraries.map(it => (
                    <li key={it.id} className="p-4 bg-[var(--bg-primary)] dark:bg-[var(--dark-bg-primary)] rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-[var(--border-color)] dark:border-[var(--dark-border-color)] transition-shadow hover:shadow-md">
                        <div>
                            <h3 className="font-semibold text-lg text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">{it.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                                {it.destination} &bull; Saved on {formatDate(it.savedAt)}
                            </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                            <button 
                                onClick={() => onLoad(it.id)} 
                                className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors"
                                aria-label={`Load itinerary for ${it.title}`}
                            >
                                <LoadIcon />
                                Load
                            </button>
                            <button 
                                onClick={() => onDelete(it.id)} 
                                className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 transition-colors"
                                aria-label={`Delete itinerary for ${it.title}`}
                            >
                                <TrashIcon />
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SavedItineraries;
