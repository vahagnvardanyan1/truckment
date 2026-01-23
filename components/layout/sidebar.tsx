'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactsIcon from '@mui/icons-material/Contacts';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';

import type { ComponentProps } from 'react';

import { Link, usePathname } from '@/i18n/routing';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'temporary';
}

const DRAWER_WIDTH = 270;
const COLLAPSED_WIDTH = 87;

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: ComponentProps<typeof Link>['href'];
  badge?: string | number;
}

export const Sidebar = ({ open, onClose, variant = 'permanent' }: SidebarProps) => {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse);

  const showCollapsed = isCollapsed && !isMobile && variant === 'permanent';

  // HOME section navigation
  const homeNavItems: NavItem[] = [
    {
      id: 'modern',
      label: 'Modern',
      icon: <DashboardIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard',
      badge: 'New',
    },
    {
      id: 'vehicles',
      label: tCommon('vehicles'),
      icon: <LocalShippingIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/vehicles',
    },
    {
      id: 'fuel',
      label: tCommon('fuel'),
      icon: <LocalGasStationIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/fuel',
    },
    {
      id: 'maintenance',
      label: tCommon('maintenance'),
      icon: <BuildIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/maintenance',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <AssessmentIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/reports',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <NotificationsIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/alerts',
      badge: 3,
    },
  ];

  // TOOLS section navigation
  const toolsNavItems: NavItem[] = [
    {
      id: 'contacts',
      label: t('contacts'),
      icon: <ContactsIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/contacts',
      badge: 2,
    },
    {
      id: 'chats',
      label: t('chats'),
      icon: <ChatIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/chats',
    },
    {
      id: 'calendar',
      label: t('calendar'),
      icon: <CalendarMonthIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/calendar',
    },
  ];

  // SUPPORT section navigation
  const supportNavItems: NavItem[] = [
    {
      id: 'email',
      label: t('email'),
      icon: <EmailIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/email',
    },
    {
      id: 'tickets',
      label: t('tickets'),
      icon: <ConfirmationNumberIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/tickets',
    },
    {
      id: 'settings',
      label: tCommon('settings'),
      icon: <SettingsIcon sx={{ fontSize: { xs: 20, md: 22 } }} />,
      path: '/dashboard/settings',
    },
  ];

  const isActive = (itemPath: ComponentProps<typeof Link>['href']) => {
    return pathname === itemPath;
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.path);
    const isNewBadge = item.badge === 'New';

    // Collapsed mode - icon only with tooltip
    if (showCollapsed) {
      return (
        <Tooltip key={item.id} title={item.label} placement="right" arrow>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
                py: 1.5,
                mx: 1,
                my: 0.25,
                borderRadius: '10px',
                position: 'relative',
                backgroundColor: active 
                  ? theme.palette.mode === 'light'
                    ? 'rgba(93, 135, 255, 0.08)'
                    : 'rgba(93, 135, 255, 0.12)'
                  : 'transparent',
                color: active ? 'primary.main' : 'text.secondary',
                borderLeft: active ? '3px solid' : 'none',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(93, 135, 255, 0.08)'
                    : 'rgba(93, 135, 255, 0.12)',
                },
              }}
            >
              {item.icon}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      );
    }

    // Full mode - icon + text
    return (
      <ListItem key={item.id} disablePadding>
        <ListItemButton
          component={Link}
          href={item.path as any}
          onClick={isMobile ? onClose : undefined}
          sx={{
            minHeight: { xs: 52, md: 46 },
            px: { xs: 3, md: 2.5 },
            py: { xs: 1.5, md: 1.25 },
            mx: { xs: 0, md: 1 },
            my: { xs: 0, md: 0.25 },
            borderRadius: { xs: 0, md: '10px' },
            position: 'relative',
            backgroundColor: active 
              ? theme.palette.mode === 'light'
                ? 'rgba(93, 135, 255, 0.08)'
                : 'rgba(93, 135, 255, 0.12)'
              : 'transparent',
            borderLeft: active 
              ? { xs: '3px solid', md: '3px solid' }
              : 'none',
            borderColor: 'primary.main',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' 
                ? 'rgba(93, 135, 255, 0.08)'
                : 'rgba(93, 135, 255, 0.12)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: 42, md: 40 },
              color: active ? 'primary.main' : 'text.secondary',
              transition: 'color 0.2s',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: { xs: '0.9375rem', md: '0.875rem' },
              fontWeight: active ? 600 : 500,
              color: active ? 'primary.main' : 'text.primary',
            }}
          />
          {item.badge && (
            <Chip
              label={item.badge}
              size="small"
              sx={{
                height: 22,
                minWidth: 22,
                fontSize: '0.6875rem',
                fontWeight: 700,
                borderRadius: '11px',
                ...(isNewBadge
                  ? {
                      backgroundColor: active ? 'primary.main' : 'secondary.light',
                      color: active ? 'white' : 'secondary.main',
                    }
                  : {
                      backgroundColor: 'secondary.main',
                      color: 'white',
                    }),
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderSectionHeader = (title: string) => {
    if (showCollapsed) return null;

    return (
      <Box 
        sx={{ 
          px: { xs: 3, md: 2.5 }, 
          pt: { xs: 3, md: 2.5 }, 
          pb: { xs: 1, md: 0.75 },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontWeight: 700,
            fontSize: '0.6875rem',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          {title}
        </Typography>
      </Box>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: { xs: 'background.paper', md: 'transparent' },
        p: { xs: 0, md: 2 },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          borderRadius: { xs: 0, md: '20px' },
          overflow: 'hidden',
          boxShadow: { xs: 'none', md: '0 0 20px rgba(0,0,0,0.05)' },
        }}
      >
      {/* Header Section - Only close button on mobile */}
      {isMobile && (
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minHeight: 64,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      )}

      {/* Navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          pt: { xs: 1, md: 0.5 },
          pb: 2,
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.action.hover,
          },
        }}
      >
        {/* Main Navigation */}
        <List disablePadding sx={{ px: { xs: 0, md: 0 }, pt: 1 }}>
          {homeNavItems.map((item) => renderNavItem(item))}
        </List>

        {/* Tools Section */}
        {renderSectionHeader('Tools')}
        <List disablePadding sx={{ px: { xs: 0, md: 0 } }}>
          {toolsNavItems.map((item) => renderNavItem(item))}
        </List>

        {/* Support Section */}
        {renderSectionHeader('Support')}
        <List disablePadding sx={{ px: { xs: 0, md: 0 }, pb: 2 }}>
          {supportNavItems.map((item) => renderNavItem(item))}
        </List>
      </Box>
      {/* Close inner card */}
      </Box>
      {/* Close outer wrapper */}
    </Box>
  );

  const drawerWidth = showCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ position: 'relative' }}>
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: variant === 'temporary' ? theme.zIndex.drawer + 2 : theme.zIndex.drawer,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: { xs: 'background.paper', md: 'background.default' },
            borderRight: 'none',
            zIndex: variant === 'temporary' ? theme.zIndex.drawer + 2 : theme.zIndex.drawer,
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: 225,
            }),
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: variant === 'temporary' ? theme.zIndex.drawer + 1 : theme.zIndex.drawer,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Toggle Button - Desktop only */}
      {!isMobile && variant === 'permanent' && (
        <IconButton
          onClick={toggleCollapse}
          size="small"
          sx={{
            position: 'fixed',
            left: showCollapsed ? COLLAPSED_WIDTH - 30 : drawerWidth - 30,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 28,
            height: 28,
            backgroundColor: 'background.paper',
            border: `1.5px solid ${theme.palette.divider}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: theme.zIndex.drawer + 2,
            transition: theme.transitions.create(['left', 'background-color'], {
              easing: theme.transitions.easing.sharp,
              duration: 225,
            }),
            '&:hover': {
              backgroundColor: 'primary.main',
              borderColor: 'primary.main',
              boxShadow: '0 4px 12px rgba(93, 135, 255, 0.3)',
              '& svg': {
                color: 'white',
              },
            },
          }}
        >
          {isCollapsed ? (
            <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary', transition: 'color 0.2s' }} />
          ) : (
            <ChevronLeftIcon sx={{ fontSize: 16, color: 'text.secondary', transition: 'color 0.2s' }} />
          )}
        </IconButton>
      )}
    </Box>
  );
};
