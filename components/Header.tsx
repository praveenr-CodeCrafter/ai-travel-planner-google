import React from 'react';
import ThemeSelector from './ThemeSelector';

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--color-primary)] animate-slow-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="relative overflow-hidden p-8 md:p-12 bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] shadow-2xl rounded-2xl mb-8 border border-[var(--border-color)] dark:border-[var(--dark-border-color)]">
            <div className="header-background"></div>
            <div className="absolute top-6 right-6 z-10">
                <ThemeSelector />
            </div>
            <div className="relative z-1 flex flex-col items-center justify-center gap-y-3">
                <GlobeIcon />
                <h1 
                    className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] tracking-tight text-center"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                >
                    AI Travel Planner
                </h1>
                 <p className="mt-2 text-lg md:text-xl text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] text-center tracking-wide max-w-xl">
                    Your personal AI guide to crafting the perfect journey, from dream to destination.
                </p>
            </div>
        </header>
    );
};

export default Header;