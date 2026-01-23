'use client';

import { useState, useEffect, useCallback } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Avoid SSR issues
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Preset breakpoints matching MUI theme
export function useBreakpoint() {
  const isXs = useMediaQuery('(max-width: 599.95px)');
  const isSm = useMediaQuery('(min-width: 600px) and (max-width: 959.95px)');
  const isMd = useMediaQuery('(min-width: 960px) and (max-width: 1279.95px)');
  const isLg = useMediaQuery('(min-width: 1280px) and (max-width: 1919.95px)');
  const isXl = useMediaQuery('(min-width: 1920px)');

  const isSmUp = useMediaQuery('(min-width: 600px)');
  const isMdUp = useMediaQuery('(min-width: 960px)');
  const isLgUp = useMediaQuery('(min-width: 1280px)');
  const isXlUp = useMediaQuery('(min-width: 1920px)');

  const isSmDown = useMediaQuery('(max-width: 599.95px)');
  const isMdDown = useMediaQuery('(max-width: 959.95px)');
  const isLgDown = useMediaQuery('(max-width: 1279.95px)');
  const isXlDown = useMediaQuery('(max-width: 1919.95px)');

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isSmUp,
    isMdUp,
    isLgUp,
    isXlUp,
    isSmDown,
    isMdDown,
    isLgDown,
    isXlDown,
    // Aliases
    isMobile: isSmDown,
    isTablet: isSm || isMd,
    isDesktop: isLgUp,
  };
}

// Detect user preferences
export function useSystemPreferences() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');

  return {
    prefersDark,
    prefersReducedMotion,
    prefersHighContrast,
  };
}

// Window size hook
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
