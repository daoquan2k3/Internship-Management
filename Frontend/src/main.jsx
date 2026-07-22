import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext.jsx';
import { CustomThemeProvider } from './context/ThemeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <CustomThemeProvider>
                <CssBaseline />
                <AuthProvider>
                    <App />
                </AuthProvider>
            </CustomThemeProvider>
        </HashRouter>
    </React.StrictMode>,
);