import { createTheme, ThemeOptions } from '@mui/material/styles';

// Extended palette interface declarations
declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      info: string;
      warning: string;
      success: string;
      error: string;
    };
    status: {
      online: string;
      offline: string;
      moving: string;
      idle: string;
      alert: string;
      maintenance: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      normal: string;
    };
    chart: string[];
  }
  interface PaletteOptions {
    gradient?: {
      primary?: string;
      secondary?: string;
      info?: string;
      warning?: string;
      success?: string;
      error?: string;
    };
    status?: {
      online?: string;
      offline?: string;
      moving?: string;
      idle?: string;
      alert?: string;
      maintenance?: string;
      success?: string;
      warning?: string;
      error?: string;
      info?: string;
      normal?: string;
    };
    chart?: string[];
  }
  interface TypographyVariants {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    caption: React.CSSProperties;
    overline: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    display1?: React.CSSProperties;
    display2?: React.CSSProperties;
    caption?: React.CSSProperties;
    overline?: React.CSSProperties;
  }
}

// Update Typography props to allow new variants
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true;
    display2: true;
  }
}

// Status colors for vehicle/entity states
const statusColors = {
  online: '#13DEB9',
  offline: '#5A6A85',
  moving: '#5D87FF',
  idle: '#FFAE1F',
  alert: '#FA896B',
  maintenance: '#7C4DFF',
  success: '#13DEB9',
  warning: '#FFAE1F',
  error: '#FA896B',
  info: '#5D87FF',
  normal: '#5A6A85',
};

// Data visualization color palette (8 colors for charts)
const chartColors = [
  '#5D87FF', // Primary blue
  '#13DEB9', // Success green
  '#FFAE1F', // Warning yellow
  '#FA896B', // Error coral
  '#7C4DFF', // Purple
  '#49BEFF', // Cyan
  '#FF6B9D', // Pink
  '#6B5AFF', // Indigo
];

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    // Display typography for hero sections and large headings
    display1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    display2: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    // Enhanced caption for small labels
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
      lineHeight: 1.5,
    },
    // Overline for section labels and meta text
    overline: {
      fontSize: '0.625rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
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
          borderRadius: 12,
          boxShadow: '0 0 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#5D87FF',
      light: '#ECF2FF',
      dark: '#4570EA',
    },
    secondary: {
      main: '#49BEFF',
      light: '#E8F7FF',
      dark: '#23AFDB',
    },
    success: {
      main: '#13DEB9',
      light: '#E6FFFA',
      dark: '#02B3A9',
    },
    info: {
      main: '#539BFF',
      light: '#EBF3FE',
      dark: '#1682D4',
    },
    error: {
      main: '#FA896B',
      light: '#FDEDE8',
      dark: '#F3704D',
    },
    warning: {
      main: '#FFAE1F',
      light: '#FEF5E5',
      dark: '#E58A00',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    text: {
      primary: '#2A3547',
      secondary: '#5A6A85',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    gradient: {
      primary: 'linear-gradient(135deg, #5D87FF 0%, #7C4DFF 100%)',
      secondary: 'linear-gradient(135deg, #49BEFF 0%, #23AFDB 100%)',
      success: 'linear-gradient(135deg, #13DEB9 0%, #06B7A0 100%)',
      info: 'linear-gradient(135deg, #539BFF 0%, #1682D4 100%)',
      error: 'linear-gradient(135deg, #FA896B 0%, #F3704D 100%)',
      warning: 'linear-gradient(135deg, #FFAE1F 0%, #E58A00 100%)',
    },
    status: statusColors,
    chart: chartColors,
  },
});

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#5D87FF',
      light: '#253662',
      dark: '#4570EA',
    },
    secondary: {
      main: '#49BEFF',
      light: '#1C455D',
      dark: '#23AFDB',
    },
    success: {
      main: '#13DEB9',
      light: '#1B3C48',
      dark: '#02B3A9',
    },
    info: {
      main: '#539BFF',
      light: '#223662',
      dark: '#1682D4',
    },
    error: {
      main: '#FA896B',
      light: '#4B313D',
      dark: '#F3704D',
    },
    warning: {
      main: '#FFAE1F',
      light: '#4D3A2C',
      dark: '#E58A00',
    },
    grey: {
      50: '#1F2937',
      100: '#111827',
      200: '#374151',
      300: '#4B5563',
      400: '#6B7280',
      500: '#9CA3AF',
      600: '#D1D5DB',
      700: '#E5E7EB',
      800: '#F3F4F6',
      900: '#F9FAFB',
    },
    text: {
      primary: '#EAEFF4',
      secondary: '#B5B9C8',
    },
    background: {
      default: '#171C23',
      paper: '#1E2531',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    gradient: {
      primary: 'linear-gradient(135deg, #5D87FF 0%, #7C4DFF 100%)',
      secondary: 'linear-gradient(135deg, #49BEFF 0%, #23AFDB 100%)',
      success: 'linear-gradient(135deg, #13DEB9 0%, #06B7A0 100%)',
      info: 'linear-gradient(135deg, #539BFF 0%, #1682D4 100%)',
      error: 'linear-gradient(135deg, #FA896B 0%, #F3704D 100%)',
      warning: 'linear-gradient(135deg, #FFAE1F 0%, #E58A00 100%)',
    },
    status: statusColors,
    chart: chartColors,
  },
});

// Export design tokens for use outside MUI components
export { statusColors, chartColors };
