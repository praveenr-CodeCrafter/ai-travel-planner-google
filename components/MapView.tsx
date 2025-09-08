import React, { useEffect, useRef } from 'react';
import type { Itinerary } from '../types';

// Since Leaflet is loaded via a script tag, we need to declare it for TypeScript
declare var L: any;

interface MapViewProps {
    itinerary: Itinerary;
}

const MapView: React.FC<MapViewProps> = ({ itinerary }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null); // To hold the map instance

    useEffect(() => {
        if (!mapContainerRef.current || !itinerary?.coordinates) {
            return;
        }

        // Cleanup previous map instance if it exists
        if (mapRef.current) {
            mapRef.current.remove();
        }

        // Initialize map
        const map = L.map(mapContainerRef.current).setView([itinerary.coordinates.lat, itinerary.coordinates.lng], 12);
        mapRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        const markers: any[] = [];

        // Add markers for each activity
        itinerary.dailyPlans.forEach(plan => {
            plan.activities.forEach(activity => {
                if (activity.coordinates) {
                    const marker = L.marker([activity.coordinates.lat, activity.coordinates.lng])
                        .addTo(map)
                        .bindPopup(`<b>${activity.attractionName}</b><br>${activity.description}`);
                    markers.push(marker);
                }
            });
        });

        // Adjust map bounds to fit all markers
        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.2));
        }

        // Cleanup on component unmount
        return () => {
            map.remove();
            mapRef.current = null;
        };

    }, [itinerary]); // Re-run effect when itinerary changes

    return (
        <div 
            className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 animate-scale-in"
            style={{ animationDelay: '100ms' }}
        >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Your Trip on a Map</h2>
            <div ref={mapContainerRef} id="map" className="leaflet-container"></div>
        </div>
    );
};

export default MapView;
