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
        let markerIndex = 0;

        itinerary.dailyPlans.forEach(plan => {
            plan.activities.forEach(activity => {
                if (activity.coordinates) {
                    const marker = L.marker([activity.coordinates.lat, activity.coordinates.lng])
                        .addTo(map)
                        .bindPopup(`<b>${activity.attractionName}</b><br>${activity.description}`);
                    
                    const iconElement = marker.getElement();
                    if (iconElement) {
                        iconElement.classList.add('marker-animate-in');
                        iconElement.style.animationDelay = `${markerIndex * 50}ms`;
                        markerIndex++;
                    }

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

        // Reset pulse animation on all markers
        Object.values(markerRefs.current).forEach(marker => {
            const iconElement = marker.getElement();
            if (iconElement) {
                iconElement.classList.remove('marker-selected-pulse');
            }
        });

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
                
                // Add pulse animation to selected marker's icon
                const iconElement = marker.getElement();
                if (iconElement) {
                    iconElement.classList.add('marker-selected-pulse');
                }
            }
        } else {
             // Optional: Close any open popups when selection is cleared
             map.closePopup();
        }

    }, [selectedActivity]);


    return (
        <div 
            className="bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] p-6 rounded-xl shadow-lg border border-[var(--border-color)] dark:border-[var(--dark-border-color)] opacity-0 animate-scale-in"
            style={{ animationDelay: '100ms' }}
        >
            <h2 className="text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mb-4">Your Trip on a Map</h2>
            <div ref={mapContainerRef} id="map" className="leaflet-container"></div>
        </div>
    );
};

export default MapView;