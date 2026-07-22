import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme/theme';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
    // Check local storage or default to dark
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('app-theme-mode');
        return savedMode || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('app-theme-mode', mode);
        // Apply global transition for smooth theme switching
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        document.body.style.backgroundColor = mode === 'dark' ? '#0f172a' : '#f8fafc';
    }, [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
