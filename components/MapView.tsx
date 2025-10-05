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
    const selectedActivityRef = useRef(selectedActivity);
    // FIX: Add a ref to hold the marker cluster group instance. This is a robust way to access it later.
    const clusterGroupRef = useRef<any>(null);

    useEffect(() => {
        selectedActivityRef.current = selectedActivity;
    }, [selectedActivity]);

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
        
        const markersGroup = L.markerClusterGroup();
        // FIX: Store the marker cluster group instance in the ref.
        clusterGroupRef.current = markersGroup;
        let markerIndex = 0;

        itinerary.dailyPlans.forEach(plan => {
            plan.activities.forEach(activity => {
                if (activity.coordinates) {
                    const marker = L.marker([activity.coordinates.lat, activity.coordinates.lng])
                        .bindPopup(`<b>${activity.attractionName}</b><br>${activity.description}`);
                    
                    markersGroup.addLayer(marker);
                    
                    const iconElement = marker.getElement();
                    if (iconElement) {
                        iconElement.classList.add('marker-animate-in');
                        iconElement.style.animationDelay = `${markerIndex * 50}ms`;
                        markerIndex++;
                    }

                    const activityId = getActivityId(plan.day, activity.attractionName);
                    markerRefs.current[activityId] = marker;

                    marker.on('click', () => {
                        const isCurrentlySelected = selectedActivityRef.current?.day === plan.day && selectedActivityRef.current?.activity.attractionName === activity.attractionName;
                        onActivitySelect(isCurrentlySelected ? null : activity, plan.day);
                    });
                }
            });
        });
        
        map.addLayer(markersGroup);

        if (itinerary.dailyPlans.some(p => p.activities.some(a => a.coordinates))) {
            map.fitBounds(markersGroup.getBounds().pad(0.2));
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };

    }, [itinerary, onActivitySelect]); 

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        Object.values(markerRefs.current).forEach((marker: any) => {
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
                
                // For clustered markers, we need to zoom in to reveal the marker before opening the popup
                // FIX: Access the cluster group via the ref instead of a fragile DOM query and private property access.
                const clusterGroup = clusterGroupRef.current;
                if (clusterGroup && clusterGroup.getVisibleParent && clusterGroup.getVisibleParent(marker) !== marker) {
                     clusterGroup.zoomToShowLayer(marker, () => marker.openPopup());
                } else {
                    marker.openPopup();
                }
                
                const iconElement = marker.getElement();
                if (iconElement) {
                    iconElement.classList.add('marker-selected-pulse');
                }
            }
        } else {
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