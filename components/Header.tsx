import React from 'react';

const PlaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.33 11.25l-9.5-8.25a1.5 1.5 0 00-1.66 0l-9.5 8.25a1.5 1.5 0 00-.67 1.25v8.25a1.5 1.5 0 001.5 1.5h3.75a1.5 1.5 0 001.5-1.5v-3.75a1.5 1.5 0 011.5-1.5h2.25a1.5 1.5 0 011.5 1.5v3.75a1.5 1.5 0 001.5 1.5h3.75a1.5 1.5 0 001.5-1.5v-8.25a1.5 1.5 0 00-.67-1.25z" transform="rotate(-45 12 12)" />
      <path d="M21.71,13.29,19.41,11,14,16.41V20a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V18h1a1,1,0,0,0,1-1V15.41l2.29-2.29a1,1,0,0,0,0-1.41A1,1,0,0,0,21.71,13.29Z"/>
      <path d="M12.41,1.58,11.71.88a1,1,0,0,0-1.42,0l-.7.7a1,1,0,0,0,0,1.41L12.41,5.82a2,2,0,0,1,2.83,0l1.41-1.41a2,2,0,0,0-2.83-2.83Z"/>
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="text-center p-6 bg-white dark:bg-gray-800/50 shadow-md rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-4">
                <PlaneIcon />
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
                    AI Travel Planner
                </h1>
            </div>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Craft your dream vacation in seconds.
            </p>
        </header>
    );
};

export default Header;