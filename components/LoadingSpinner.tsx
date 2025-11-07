import React, { useState, useEffect } from 'react';

const travelTips = [
    "Rolling your clothes instead of folding saves a surprising amount of space.",
    "Download offline maps of your destination before you travel. You never know when you'll be without a signal.",
    "Pack a reusable water bottle to stay hydrated and reduce plastic waste.",
    "Learn a few basic phrases in the local language, like 'hello' and 'thank you'. A little effort goes a long way!",
    "Notify your bank of your travel plans to avoid your cards being frozen for suspicious activity.",
    "Packing cubes are a traveler's best friend for staying organized on the go.",
    "Always carry a portable charger to keep your devices powered up for photos, maps, and emergencies.",
    "Did you know? The most visited country in the world is France.",
    "Scanning your passport and emailing it to yourself is a great backup in case of loss or theft.",
    "To beat jet lag, try to adjust to your new time zone a few days before you leave."
];

const CompassSpinner: React.FC = () => (
    <div className="relative h-20 w-20">
        <svg className="absolute inset-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4"/>
        </svg>
        <svg className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5V25" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M50 75V95" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M95 50H75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M25 50H5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <svg className="absolute inset-0 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M85.3553 14.6447L71.2132 28.7868" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M28.7868 71.2132L14.6447 85.3553" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M14.6447 14.6447L28.7868 28.7868" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M71.2132 71.2132L85.3553 85.3553" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-8 w-8 text-[var(--dark-text-primary)]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.2842 2.36921L4.17415 5.7533C3.25035 6.1354 2.86462 7.20782 3.24672 8.13162L6.63081 16.2417C7.01291 17.1655 8.08533 17.5512 9.00913 17.1691L17.1192 13.785C18.043 13.4029 18.4287 12.3305 18.0466 11.4067L14.6625 3.29661C14.2804 2.37281 13.208 1.98708 12.2842 2.36921ZM12 12L7.5 7.5L12 3L16.5 7.5L12 12Z" />
            </svg>
        </div>
    </div>
);


const LoadingSpinner: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
      const tipInterval = setInterval(() => {
          setCurrentTipIndex((prevIndex) => (prevIndex + 1) % travelTips.length);
      }, 4000); // Change tip every 4 seconds

      return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-10 bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] rounded-lg shadow-md border border-[var(--border-color)] dark:border-[var(--dark-border-color)] overflow-hidden">
      <div className="text-[var(--color-primary)]">
        <CompassSpinner />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">Crafting Your Itinerary...</h3>
      <div className="mt-2 text-center h-12 w-full max-w-lg flex items-center justify-center">
        <p key={currentTipIndex} className="text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] italic animate-tip-fade-in">
            "{travelTips[currentTipIndex]}"
        </p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700/50 h-1.5 absolute bottom-0 left-0">
          <div className="bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent h-full w-1/2 absolute top-0 left-0 animate-progress-bar-indeterminate"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;