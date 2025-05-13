import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  sx?: React.CSSProperties;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ sx }) => {
  const { mode, toggleColorMode } = useThemeMode();
  const theme = useTheme();
  
  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleColorMode}
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        color="inherit"
        sx={{ ml: 1, ...sx }}
      >
        {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;