'use client';

import { useState, ReactNode, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { CommandPalette, useCommandPalette } from '@/components/navigation/command-palette';
import { SkipLinks } from '@/components/common/skip-links';
import { useKeyboardSequence } from '@/lib/hooks/use-keyboard-shortcut';
import { useRouter } from '@/i18n/routing';

interface AppShellProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 270;
const COLLAPSED_WIDTH = 87;
const NOOP = () => {};

export const AppShell = ({ children }: AppShellProps) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse);
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen, closePalette } = useCommandPalette();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      toggleCollapse();
    }
  }, [isMobile, toggleCollapse]);

  // Keyboard shortcuts for navigation (G + letter sequences)
  useKeyboardSequence(['g', 'd'], () => router.push('/dashboard' as any));
  useKeyboardSequence(['g', 'v'], () => router.push('/dashboard/vehicles' as any));
  useKeyboardSequence(['g', 'f'], () => router.push('/dashboard/fuel' as any));
  useKeyboardSequence(['g', 'm'], () => router.push('/dashboard/maintenance' as any));
  useKeyboardSequence(['g', 'r'], () => router.push('/dashboard/reports' as any));
  useKeyboardSequence(['g', 'a'], () => router.push('/dashboard/alerts' as any));
  useKeyboardSequence(['g', 's'], () => router.push('/dashboard/settings' as any));

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const sidebarWidth = isCollapsed && !isMobile ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <>
    {/* Skip Links for accessibility */}
    <SkipLinks />

    {/* Command Palette */}
    <CommandPalette open={commandPaletteOpen} onClose={closePalette} />

    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: { xs: 'background.default', md: 'background.default' },
      }}
    >
      {/* Sidebar Navigation */}
      <Box
        component="nav"
        id="navigation"
        aria-label="Main navigation"
      >
        {isMobile ? (
          <Sidebar
            open={mobileOpen}
            onClose={handleDrawerToggle}
            variant="temporary"
          />
        ) : (
          <Sidebar
            open={true}
            onClose={NOOP}
            variant="permanent"
          />
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        id="main-content"
        role="main"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          width: { xs: '100%', lg: `calc(100% - ${sidebarWidth}px)` },
          minHeight: '100vh',
          height: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          outline: 'none',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <TopBar onMenuClick={handleDrawerToggle} onSidebarToggle={handleSidebarToggle} />
        <Box
          sx={{
            p: { xs: 2, md: 2 },
            pt: { xs: 2, md: 0 },
            flex: 1,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
    </>
  );
};
