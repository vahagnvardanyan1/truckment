'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';
import ContactsIcon from '@mui/icons-material/Contacts';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Avatar from '@mui/material/Avatar';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

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
  path?: string;
  badge?: string | number;
  children?: NavItem[];
}

export const Sidebar = ({ open, onClose, variant = 'permanent' }: SidebarProps) => {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const homeNavItems: NavItem[] = [
    {
      id: 'home',
      label: 'Modern',
      icon: <DashboardIcon />,
      path: '/dashboard',
      badge: 'New',
    },
    {
      id: 'vehicles',
      label: tCommon('vehicles'),
      icon: <LocalShippingIcon />,
      path: '/dashboard/vehicles',
    },
    {
      id: 'fuel',
      label: tCommon('fuel'),
      icon: <LocalGasStationIcon />,
      path: '/dashboard/fuel',
    },
    {
      id: 'maintenance',
      label: tCommon('maintenance'),
      icon: <BuildIcon />,
      path: '/dashboard/maintenance',
    },
  ];

  const appsNavItems: NavItem[] = [
    {
      id: 'contacts',
      label: t('contacts'),
      icon: <ContactsIcon />,
      path: '/dashboard/contacts',
      badge: 2,
    },
    {
      id: 'chats',
      label: t('chats'),
      icon: <ChatIcon />,
      path: '/dashboard/chats',
    },
    {
      id: 'calendar',
      label: t('calendar'),
      icon: <CalendarMonthIcon />,
      path: '/dashboard/calendar',
    },
    {
      id: 'email',
      label: t('email'),
      icon: <EmailIcon />,
      path: '/dashboard/email',
    },
    {
      id: 'tickets',
      label: t('tickets'),
      icon: <ConfirmationNumberIcon />,
      path: '/dashboard/tickets',
    },
    {
      id: 'settings',
      label: tCommon('settings'),
      icon: <SettingsIcon />,
      path: '/dashboard/settings',
    },
  ];

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = item.path ? (pathname === item.path || pathname.startsWith(item.path + '/')) : false;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const showCollapsed = isCollapsed && !isMobile && variant === 'permanent';

    if (hasChildren) {
      if (showCollapsed) {
        return (
          <Tooltip key={item.id} title={item.label} placement="right">
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleToggleExpand(item.id)}
                sx={{
                  minHeight: 48,
                  justifyContent: 'center',
                  px: 2.5,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        );
      }

      return (
        <Box key={item.id}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleToggleExpand(item.id)}
              sx={{
                minHeight: 48,
                px: 3,
                py: 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              />
              {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        </Box>
      );
    }

    if (showCollapsed) {
      return (
        <Tooltip key={item.id} title={item.label} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={item.path || '/'}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
                py: 1.5,
                borderRadius: '8px',
                mx: 1,
                my: 0.25,
                backgroundColor: isActive ? 'rgba(93, 135, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive
                    ? 'rgba(93, 135, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  color: isActive ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Tooltip>
      );
    }

    const isNewBadge = item.badge === 'New' || item.badge === 'new';

    return (
      <ListItem key={item.id} disablePadding>
        <ListItemButton
          component={Link}
          href={item.path || '/'}
          onClick={isMobile ? onClose : undefined}
          sx={{
            minHeight: { xs: 52, md: 44 },
            px: { xs: 3, md: 2.5 },
            py: { xs: 1.5, md: 1 },
            pl: depth > 0 ? { xs: 6, md: 5 } : { xs: 3, md: 2.5 },
            borderRadius: { xs: 0, md: '8px' },
            mx: { xs: 0, md: 1 },
            my: { xs: 0, md: 0.25 },
            backgroundColor: isActive ? 'rgba(93, 135, 255, 0.1)' : 'transparent',
            borderLeft: { xs: isActive ? '4px solid' : '4px solid transparent', md: 'none' },
            borderColor: { xs: 'primary.main', md: 'transparent' },
            '&:hover': {
              backgroundColor: isActive
                ? 'rgba(93, 135, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.04)',
            },
            '&:active': {
              backgroundColor: 'rgba(93, 135, 255, 0.15)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: isActive ? 'primary.main' : 'text.secondary',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.9375rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'text.primary' : 'text.secondary',
            }}
          />
          {item.badge && (
            <Chip
              label={item.badge}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '16px',
                ...(isNewBadge
                  ? {
                      backgroundColor: 'rgba(73, 190, 255, 0.15)',
                      color: '#49BEFF',
                    }
                  : {
                      backgroundColor: 'primary.main',
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
      <Box sx={{ px: { xs: 3, md: 2.5 }, pt: { xs: 3.5, md: 3 }, pb: { xs: 1.5, md: 1 } }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 700,
            fontSize: { xs: '0.8125rem', md: '0.75rem' },
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
      </Box>
    );
  };

  const showCollapsed = isCollapsed && !isMobile && variant === 'permanent';

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: { xs: 2, md: showCollapsed ? 2 : 2.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: showCollapsed ? 'center' : 'space-between',
          minHeight: { xs: 70, md: 70 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: isMobile ? 'background.paper' : 'transparent',
        }}
      >
        {showCollapsed ? (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: theme.palette.gradient.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalShippingIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: theme.palette.gradient.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalShippingIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  background: theme.palette.gradient.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.25rem',
                }}
              >
                {tCommon('appName')}
              </Typography>
            </Box>
            {isMobile && (
              <IconButton onClick={onClose} size="small">
                <ChevronLeftIcon />
              </IconButton>
            )}
          </>
        )}
      </Box>

      {/* Navigation */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          pt: { xs: 0, md: 1 },
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}
      >
        {renderSectionHeader('HOME')}
        <List disablePadding>
          {homeNavItems.map((item) => renderNavItem(item))}
        </List>

        {renderSectionHeader('APPS')}
        <List disablePadding>
          {appsNavItems.map((item) => renderNavItem(item))}
        </List>
      </Box>

      {/* User Profile at bottom */}
      {!showCollapsed && (
        <Box
          sx={{
            p: { xs: 2.5, md: 2 },
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: { xs: 'transparent', md: 'rgba(93, 135, 255, 0.05)' },
            m: { xs: 0, md: 2 },
            borderRadius: { xs: 0, md: '12px' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 1.5 } }}>
            <Avatar
              src="/avatar.png"
              alt="Mathew"
              sx={{ width: { xs: 48, md: 40 }, height: { xs: 48, md: 40 } }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                noWrap
                sx={{ fontSize: { xs: '1rem', md: '0.9375rem' } }}
              >
                Mathew
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ fontSize: { xs: '0.8125rem', md: '0.75rem' } }}
              >
                Designer
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              sx={{ 
                color: 'primary.main',
                width: { xs: 40, md: 32 },
                height: { xs: 40, md: 32 },
              }}
            >
              <PowerSettingsNewIcon fontSize={isMobile ? 'medium' : 'small'} />
            </IconButton>
          </Box>
        </Box>
      )}
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
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: variant === 'temporary' 
              ? '2px 0 8px rgba(0,0,0,0.15)' 
              : 'none',
            borderRight: variant === 'permanent' ? `1px solid ${theme.palette.divider}` : 'none',
            transition: theme.transitions.create(['width', 'transform'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Toggle Button - Desktop only */}
      {!isMobile && variant === 'permanent' && (
        <IconButton
          onClick={toggleCollapse}
          sx={{
            position: 'fixed',
            left: showCollapsed ? COLLAPSED_WIDTH - 16 : drawerWidth - 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create('left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {isCollapsed ? (
            <ChevronRightIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          ) : (
            <ChevronLeftIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          )}
        </IconButton>
      )}
    </Box>
  );
};
