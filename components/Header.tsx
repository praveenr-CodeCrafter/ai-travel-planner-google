import React from 'react';

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="text-center p-6 bg-white dark:bg-gray-800/50 shadow-md rounded-xl mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-4">
                <GlobeIcon />
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