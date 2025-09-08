import React, { useEffect, useRef } from 'react';
import type { Itinerary, Activity } from '../types';

declare var L: any;

interface MapViewProps {
    itinerary: Itinerary;
    selectedActivity: { activity: Activity, day: number } | null;
    onActivitySelect: (activity: Activity | null, day?: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ itinerary, selectedActivity, onActivitySelect }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRefs = useRef<Record<string, any>>({});

    const getActivityId = (day: number, attractionName: string) => {
        return `activity-${day}-${attractionName.replace(/\s+/g, '-').toLowerCase()}`;
    };

    useEffect(() => {
        if (!mapContainerRef.current || !itinerary?.coordinates) {
            return;
        }

        if (mapRef.current) {
            mapRef.current.remove();
        }

        const map = L.map(mapContainerRef.current).setView([itinerary.coordinates.lat, itinerary.coordinates.lng], 12);
        mapRef.current = map;
        markerRefs.current = {};

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        const markers: any[] = [];

        itinerary.dailyPlans.forEach(plan => {
            plan.activities.forEach(activity => {
                if (activity.coordinates) {
                    const marker = L.marker([activity.coordinates.lat, activity.coordinates.lng])
                        .addTo(map)
                        .bindPopup(`<b>${activity.attractionName}</b><br>${activity.description}`);
                    
                    const activityId = getActivityId(plan.day, activity.attractionName);
                    markerRefs.current[activityId] = marker;

                    marker.on('click', () => {
                        const isCurrentlySelected = selectedActivity?.day === plan.day && selectedActivity?.activity.attractionName === activity.attractionName;
                        onActivitySelect(isCurrentlySelected ? null : activity, plan.day);
                    });

                    markers.push(marker);
                }
            });
        });

        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.2));
        }

        return () => {
            map.remove();
            mapRef.current = null;
        };

    }, [itinerary, onActivitySelect]); // Rerun only when the whole itinerary changes

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (selectedActivity) {
            const { activity, day } = selectedActivity;
            const activityId = getActivityId(day, activity.attractionName);
            const marker = markerRefs.current[activityId];

            if (marker) {
                const latLng = marker.getLatLng();
                map.flyTo(latLng, map.getZoom() < 14 ? 14 : map.getZoom(), {
                    animate: true,
                    duration: 1,
                });
                marker.openPopup();
            }
        } else {
             // Optional: Close any open popups when selection is cleared
             map.closePopup();
        }

    }, [selectedActivity]);


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