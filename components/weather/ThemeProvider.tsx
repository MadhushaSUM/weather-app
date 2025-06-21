"use client";

import React, { createContext, useContext, useEffect } from "react";

interface ThemeContextType {
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({ isDarkMode: false });

/**
 * A custom hook to access the current theme context.
 */
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: React.ReactNode;
    isDarkMode: boolean;
}

/**
 * ThemeProvider is the functional component of the hook
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    isDarkMode,
}) => {
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
