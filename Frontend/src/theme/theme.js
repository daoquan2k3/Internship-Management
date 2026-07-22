import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: '#8b5cf6', // Vibrant purple
            light: '#a78bfa',
            dark: '#6d28d9',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#3b82f6', // Bright blue
            light: '#60a5fa',
            dark: '#2563eb',
            contrastText: '#ffffff',
        },
        background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc',
            paper: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        },
        success: {
            main: '#10b981',
        },
        warning: {
            main: '#f59e0b',
        },
        error: {
            main: '#ef4444',
        },
        text: {
            primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
            secondary: mode === 'dark' ? '#cbd5e1' : '#64748b',
        },
        divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: {
            textTransform: 'none', // Modern, non-all-caps buttons
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    background: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: mode === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : '0 10px 30px -10px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                        transition: 'background-color 5000s ease-in-out 0s',
                        WebkitTextFillColor: mode === 'dark' ? '#f8fafc !important' : '#0f172a !important',
                        WebkitBoxShadow: 'none !important',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                }
            }
        }
    },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
