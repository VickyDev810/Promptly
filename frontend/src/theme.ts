import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#03e9f4', // Cyan neon glow
      light: '#4df8ff',
      dark: '#00b8c0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#9c27b0', // Purple
      light: '#d05ce3',
      dark: '#6a0080',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0e17', // Very dark blue
      paper: '#111827', // Dark blue-gray
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          padding: '8px 16px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(3, 233, 244, 0.4), transparent)',
            transition: 'all 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #02aab0 30%, #00cdac 90%)',
          boxShadow: '0 0 10px rgba(3, 233, 244, 0.5)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          border: '1px solid rgba(66, 153, 225, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(10, 15, 24, 0.95))',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 14, 23, 0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(66, 153, 225, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(66, 153, 225, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#03e9f4',
            },
          },
        },
      },
    },
  },
});

export default theme; 