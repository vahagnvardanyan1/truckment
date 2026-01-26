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

// Status colors - DISTINCT from semantic colors
const statusColors = {
  online: '#22C55E',      // Green (distinct from success)
  offline: '#94A3B8',     // Slate gray
  moving: '#3B82F6',      // Blue (distinct from primary)
  idle: '#EAB308',        // Yellow
  alert: '#F97316',       // Orange (distinct from error)
  maintenance: '#8B5CF6', // Violet
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
  normal: '#64748B',
};

// Data visualization color palette (8 colors for charts)
const chartColors = [
  '#0D1B2A', // Primary deep navy
  '#00D4AA', // Accent electric teal
  '#2563EB', // Signal blue
  '#10B981', // Success emerald
  '#F59E0B', // Warning amber
  '#EF4444', // Error red
  '#8B5CF6', // Purple
  '#3D5A73', // Slate steel
];

const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 212, 170, 0.25)',
          },
        },
        containedSecondary: {
          color: '#0D1B2A',
          '&:hover': {
            backgroundColor: '#00BF9A',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
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
      main: '#0D1B2A',      // Deep Navy - premium enterprise
      light: '#1E3A5F',
      dark: '#0A1520',
    },
    secondary: {
      main: '#00D4AA',      // Electric Teal - accent
      light: '#E6FBF6',
      dark: '#059669',
    },
    success: {
      main: '#10B981',      // Emerald
      light: '#ECFDF5',
      dark: '#059669',
    },
    info: {
      main: '#2563EB',      // Signal Blue
      light: '#EFF6FF',
      dark: '#1D4ED8',
    },
    error: {
      main: '#EF4444',      // Clean red
      light: '#FEF2F2',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FFFBEB',
      dark: '#D97706',
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
      primary: '#0D1B2A',   // Deep Navy for text
      secondary: '#3D5A73', // Slate Steel
    },
    background: {
      default: '#F8FAFC',   // Arctic White
      paper: '#FFFFFF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    gradient: {
      primary: 'linear-gradient(135deg, #0D1B2A 0%, #1E3A5F 50%, #2563EB 100%)',
      secondary: 'linear-gradient(135deg, #00D4AA 0%, #059669 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      info: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
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
      main: '#2563EB',      // Signal Blue for dark mode (better visibility)
      light: '#1E3A5F',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#00D4AA',      // Electric Teal
      light: '#064E3B',
      dark: '#059669',
    },
    success: {
      main: '#34D399',      // Lighter emerald
      light: '#064E3B',
      dark: '#10B981',
    },
    info: {
      main: '#60A5FA',
      light: '#1E3A5F',
      dark: '#3B82F6',
    },
    error: {
      main: '#F87171',      // Lighter red
      light: '#7F1D1D',
      dark: '#EF4444',
    },
    warning: {
      main: '#FBBF24',
      light: '#78350F',
      dark: '#F59E0B',
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
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    background: {
      default: '#0D1B2A',   // Deep Navy background
      paper: '#1E293B',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    gradient: {
      primary: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #00D4AA 100%)',
      secondary: 'linear-gradient(135deg, #00D4AA 0%, #059669 100%)',
      success: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
      info: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      error: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
      warning: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    },
    status: statusColors,
    chart: chartColors,
  },
});

// Export design tokens for use outside MUI components
export { statusColors, chartColors };
