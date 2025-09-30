import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { themes } from '../themes';

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('app-theme');
            return savedTheme && themes[savedTheme] ? savedTheme : 'default';
        } catch {
            return 'default';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('app-theme', theme);
        } catch (error) {
            console.warn('Could not save theme to localStorage:', error);
        }
        
        const currentTheme = themes[theme];
        if (currentTheme) {
            const root = document.documentElement;
            Object.entries(currentTheme.colors).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};