'use client';

import { useState, ReactNode, useEffect } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

interface AppShellProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 270;
const COLLAPSED_WIDTH = 87;

export const AppShell = ({ children }: AppShellProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    if (isMobile) {
      handleDrawerToggle();
    } else {
      toggleCollapse();
    }
  };

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const sidebarWidth = isCollapsed && !isMobile ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Sidebar
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
        />
      ) : (
        <Sidebar
          open={true}
          onClose={() => {}}
          variant="permanent"
        />
      )}

      {/* Main content */}
      <Box
        component="main"
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
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <TopBar onMenuClick={handleDrawerToggle} onSidebarToggle={handleSidebarToggle} />
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 },
            flex: 1,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
