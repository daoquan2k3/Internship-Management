import { useContext } from 'react';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorModeContext } from '../../context/ThemeContext'; // Trỏ đúng đường dẫn

const ThemeToggleButton = () => {
    const { mode, toggleColorMode } = useContext(ColorModeContext);
    const isDark = mode === 'dark';

    return (
        <IconButton
            onClick={toggleColorMode}
            sx={{
                color: isDark ? '#94a3b8' : '#64748b',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
            }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={mode}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                </motion.div>
            </AnimatePresence>
        </IconButton>
    );
};

export default ThemeToggleButton;