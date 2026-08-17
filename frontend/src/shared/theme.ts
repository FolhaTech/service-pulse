import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e3a8a',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    secondary: {
      main: '#64748b',
    },
    error: {
      main: '#ba1a1a',
    },
    warning: {
      main: '#f59e0b',
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: 'Inter, system-ui, Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
  },
});
