import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Define colors
const lightModeColors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
};

const darkModeColors = {
  primary: {
    main: '#90caf9',
    light: '#e3f2fd',
    dark: '#42a5f5',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ffa726',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: '#29b6f6',
    light: '#4fc3f7',
    dark: '#0288d1',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  success: {
    main: '#66bb6a',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
};

// Function to create theme for the specified mode
export const createAppTheme = (mode: PaletteMode) => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      ...(mode === 'light' ? lightModeColors : darkModeColors),
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none', // More readable button text
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 500,
          },
          containedPrimary: {
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 8,
          },
          elevation1: {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'hidden',
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
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '12px 16px',
          },
          head: {
            fontWeight: 600,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          // Global styles for better accessibility
          'html, body': {
            margin: 0,
            padding: 0,
            fontFamily: [
              'Inter',
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
            ].join(','),
          },
          // Enhanced focus visible styles for keyboard navigation
          'a, button, [role="button"], [tabindex]:not([tabindex="-1"])': {
            '&:focus-visible': {
              outline: `3px solid ${mode === 'light' ? lightModeColors.primary.main : darkModeColors.primary.main}`,
              outlineOffset: 3,
              borderRadius: '2px',
              boxShadow: mode === 'light' 
                ? '0 0 0 3px rgba(25, 118, 210, 0.2)' 
                : '0 0 0 3px rgba(144, 202, 249, 0.2)',
              position: 'relative',
              zIndex: 1,
            },
          },
          // Specific focus styles for interactive elements
          '.MuiIconButton-root': {
            '&:focus-visible': {
              backgroundColor: mode === 'light' 
                ? 'rgba(25, 118, 210, 0.12)' 
                : 'rgba(144, 202, 249, 0.12)',
            },
          },
          '.MuiListItem-root': {
            '&:focus-visible': {
              backgroundColor: mode === 'light' 
                ? 'rgba(25, 118, 210, 0.12)' 
                : 'rgba(144, 202, 249, 0.12)',
            },
          },
          // Improved link styles
          a: {
            color: mode === 'light' ? lightModeColors.primary.main : darkModeColors.primary.main,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
            '&:focus': {
              textDecoration: 'underline',
            },
          },
          // Skip to main content link - accessibility feature
          '.skip-link': {
            position: 'absolute',
            top: '-40px',
            left: 0,
            backgroundColor: mode === 'light' ? '#ffffff' : '#121212',
            color: mode === 'light' ? lightModeColors.primary.main : darkModeColors.primary.main,
            padding: '8px',
            zIndex: 100,
            '&:focus': {
              top: 0,
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
    // A11y improvements
    transitions: {
      // Disables animations for users who have reduced motion enabled
      create: (props, options) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return 'none 0ms';
        }
        return createTheme().transitions.create(props, options);
      },
    },
  };

  return responsiveFontSizes(createTheme(themeOptions));
};

// Default export is light theme
export default createAppTheme('light');