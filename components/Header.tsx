import React from 'react';
import ThemeSelector from './ThemeSelector';

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="relative p-6 bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] shadow-md rounded-xl mb-8 border border-[var(--border-color)] dark:border-[var(--dark-border-color)]">
            <div className="absolute top-4 right-4 z-10">
                <ThemeSelector />
            </div>
            <div className="flex items-center justify-center gap-4">
                <GlobeIcon />
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]">
                    AI Travel Planner
                </h1>
            </div>
            <p className="mt-2 text-lg text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] text-center">
                Craft your dream vacation in seconds.
            </p>
        </header>
    );
};

export default Header;
