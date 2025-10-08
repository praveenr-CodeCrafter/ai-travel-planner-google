import React, { forwardRef } from 'react';
import type { Itinerary, SavedItinerary } from '../types';

interface PdfExportContentProps {
    itinerary: Itinerary | SavedItinerary;
    mapImage: string;
    attractionImages: Record<string, string>;
}

// Re-defining icons here to make the component self-contained for export
const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const WeatherIcon = () => (
    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-2.08-5.839c-1.135-.23-2.343-.394-3.566-.394a1.875 1.875 0 00-1.875 1.875c0 .355.085.694.238 1.008-1.03.26-1.996.685-2.828 1.25A3.75 3.75 0 004.5 15z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const PdfExportContent = forwardRef<HTMLDivElement, PdfExportContentProps>(({ itinerary, mapImage, attractionImages }, ref) => {
    const keyAttractionForDay = (day: number) => {
        const plan = itinerary.dailyPlans.find(p => p.day === day);
        return plan?.activities.length ? plan.activities[0].attractionName : "Scenic View";
    }

    return (
        <div ref={ref} className="bg-white text-gray-800 p-10" style={{ width: '794px' }}>
            {/* Page 1: Title and Overview */}
            <div className="text-center border-b-2 border-gray-200 pb-8 mb-8">
                 <div className="flex items-center justify-center gap-4">
                    <GlobeIcon />
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        AI Travel Planner
                    </h1>
                </div>
                <h2 className="text-5xl font-bold mt-12">{itinerary.title}</h2>
                <p className="text-2xl text-gray-600 mt-4">
                    Your personalized {itinerary.duration}-day trip to {itinerary.destination}
                </p>
                <p className="text-lg text-gray-500 mt-2">
                    {new Date(itinerary.startDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(itinerary.endDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Map Section */}
            <div className="mb-8 break-inside-avoid">
                <h3 className="text-3xl font-bold mb-4">Your Trip on a Map</h3>
                <img src={mapImage} alt="Map of trip" className="w-full rounded-lg shadow-md border border-gray-200" />
            </div>

            {/* Tips & Packing List */}
            <div className="grid grid-cols-2 gap-8 mb-8 break-inside-avoid">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Travel Tips</h3>
                     <ul className="space-y-3">
                        {itinerary.travelTips.map((tip, index) => (
                           <li key={index} className="flex items-start">
                               <CheckCircleIcon />
                               <div>
                                   <h4 className="font-semibold text-md">{tip.tip}</h4>
                                   <p className="text-gray-600 mt-1 text-sm">{tip.explanation}</p>
                               </div>
                           </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-4">Packing List</h3>
                    <ul className="space-y-3">
                        {itinerary.packingList.map((item, index) => (
                           <li key={index} className="flex items-start">
                               <CheckCircleIcon />
                               <div>
                                   <h4 className="font-semibold text-md">{item.item}</h4>
                                   <p className="text-gray-600 mt-1 text-sm">{item.reason}</p>
                               </div>
                           </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Daily Plans */}
            <div>
                <h3 className="text-3xl font-bold mb-6 text-center border-t-2 border-gray-200 pt-8">Daily Itinerary</h3>
                <div className="space-y-8">
                    {itinerary.dailyPlans.sort((a, b) => a.day - b.day).map(plan => (
                        <div key={plan.day} className="p-6 border border-gray-200 rounded-lg shadow-md break-inside-avoid">
                            <div className="border-b border-gray-200 pb-3 mb-4">
                                <p className="font-bold text-green-700 uppercase tracking-wide">Day {plan.day}</p>
                                <h4 className="text-2xl font-bold text-gray-800">{plan.theme}</h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <WeatherIcon />
                                    <span>{plan.weather.forecast} &bull; {plan.weather.temperature}</span>
                                </div>
                            </div>

                            <img 
                                src={attractionImages[keyAttractionForDay(plan.day)]} 
                                alt={`Image of ${keyAttractionForDay(plan.day)}`} 
                                className="w-full h-56 object-cover rounded-md mb-4"
                            />

                            <h5 className="font-semibold text-lg mb-2">Activities</h5>
                            <ul className="space-y-3 list-disc list-inside text-gray-700 mb-4">
                                {plan.activities.map((activity, idx) => (
                                    <li key={idx}>
                                        <span className="font-semibold">{activity.time}:</span> {activity.description} ({activity.attractionName})
                                    </li>
                                ))}
                            </ul>

                             <h5 className="font-semibold text-lg mb-2">Local Flavor</h5>
                             <p className="text-gray-700">
                                <span className="font-semibold">{plan.foodToTry.dishName}</span> at <span className="italic">{plan.foodToTry.suggestedRestaurant}</span>.
                             </p>
                        </div>
                    ))}
                </div>
            </div>
            
            <footer className="text-center mt-12 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    Powered by Google Gemini. Itinerary and images are AI-generated and may require verification.
                </p>
            </footer>
        </div>
    );
});

export default PdfExportContent;