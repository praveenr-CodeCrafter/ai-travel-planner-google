import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../themes';

const ThemeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 2h10v6H5V6z" />
        <path d="M15 15H5a1 1 0 00-1 1v2a1 1 0 001 1h10a1 1 0 001-1v-2a1 1 0 00-1-1z" />
    </svg>
);
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const ThemeSelector: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    const handleThemeChange = (themeKey: string) => {
        setTheme(themeKey);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-[var(--bg-muted)] dark:bg-[var(--dark-bg-muted)] text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] hover:bg-gray-200 dark:hover:bg-[var(--dark-border-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-[var(--dark-bg-secondary)] focus:ring-[var(--color-primary)] transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <ThemeIcon />
                <span className="ml-2 hidden sm:inline">{themes[theme]?.name} Theme</span>
                <ChevronDownIcon isOpen={isOpen}/>
            </button>
            {isOpen && (
                <ul
                    className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] border border-[var(--border-color)] dark:border-[var(--dark-border-color)] rounded-md shadow-lg z-20 animate-scale-in origin-top-right"
                    role="menu"
                >
                    {Object.entries(themes).map(([key, value]) => (
                        <li key={key}>
                            <button
                                onClick={() => handleThemeChange(key)}
                                className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] hover:bg-[var(--color-primary-light)] dark:hover:bg-[var(--dark-color-primary-light)]"
                                role="menuitem"
                            >
                                {value.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ThemeSelector;