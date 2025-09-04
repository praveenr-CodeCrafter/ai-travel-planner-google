import React from 'react';
import type { Itinerary, DailyPlan } from '../types';
import GeneratedImage from './GeneratedImage';

const ActivityIcon = () => (
    <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);


const ItineraryDayCard: React.FC<{ plan: DailyPlan; destination: string; }> = ({ plan, destination }) => {
    const keyAttraction = plan.activities.length > 0 ? plan.activities[0].attractionName : "scenic view";

    return (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <div className="h-56 w-full">
                <GeneratedImage attractionName={keyAttraction} destination={destination} />
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-green-500 uppercase tracking-wider">Day {plan.day}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <WeatherIcon />
                        <span>{plan.weather.temperature}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">{plan.theme}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.weather.forecast}</p>

                <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Activities</h4>
                    <ul className="space-y-3">
                        {plan.activities.map((activity, index) => (
                            <li key={index} className="flex items-start">
                                <ActivityIcon />
                                <div>
                                    <span className="font-semibold text-gray-600 dark:text-gray-300">{activity.time}: </span>
                                    <span className="text-gray-500 dark:text-gray-400">{activity.description}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                     <div className="flex items-start">
                        <RestaurantIcon />
                        <div>
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Local Flavor</h4>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">{plan.foodToTry.dishName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Try it at: {plan.foodToTry.suggestedRestaurant}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ItineraryDisplay: React.FC<{ itinerary: Itinerary }> = ({ itinerary }) => {
    return (
        <div className="space-y-12 mt-12">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">{itinerary.title}</h1>
                <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">Your personalized {itinerary.duration}-day trip to {itinerary.destination}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {itinerary.dailyPlans.sort((a,b) => a.day - b.day).map(plan => (
                    <ItineraryDayCard key={plan.day} plan={plan} destination={itinerary.destination} />
                ))}
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center"><TipsIcon />Travel Tips</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
                    {itinerary.travelTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ItineraryDisplay;