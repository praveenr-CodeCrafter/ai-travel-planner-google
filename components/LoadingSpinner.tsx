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
      <svg className="animate-spin h-12 w-12 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">Generating Your Adventure...</h3>
      <div className="mt-2 text-center h-12 w-full max-w-lg flex items-center justify-center">
        <p key={currentTipIndex} className="text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] italic animate-tip-fade-in">
            "{travelTips[currentTipIndex]}"
        </p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700/50 h-1.5 absolute bottom-0 left-0">
          <div className="bg-[var(--color-primary)] h-full w-1/2 absolute top-0 left-0 animate-progress-bar-indeterminate"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;