'use client';

import { useEffect, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { lightTheme, darkTheme } from '@/lib/theme';
import { useThemeStore } from '@/lib/stores/theme-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <MuiThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
