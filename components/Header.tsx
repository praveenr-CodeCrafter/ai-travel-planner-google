import React from 'react';
import ThemeSelector from './ThemeSelector';

// Sightly larger icon, with a slow, continuous spin animation
const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[var(--color-primary)] animate-slow-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);


const Header: React.FC = () => {
    return (
        // Use a radial gradient for a more dynamic background, increase padding, use a larger shadow
        <header className="relative p-8 md:p-12 bg-[radial-gradient(ellipse_at_center,_var(--bg-muted)_0%,_var(--bg-secondary)_80%)] dark:bg-[radial-gradient(ellipse_at_center,_var(--dark-bg-muted)_0%,_var(--dark-bg-secondary)_80%)] shadow-xl rounded-2xl mb-8 border border-[var(--border-color)] dark:border-[var(--dark-border-color)]">
            <div className="absolute top-6 right-6 z-10">
                <ThemeSelector />
            </div>
            <div className="flex items-center justify-center gap-x-5">
                <GlobeIcon />
                <h1 
                    className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] tracking-tight"
                    style={{ textShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                >
                    AI Travel Planner
                </h1>
            </div>
            <p className="mt-4 text-lg md:text-xl text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] text-center tracking-wide">
                Craft your dream vacation in seconds.
            </p>
        </header>
    );
};

export default Header;