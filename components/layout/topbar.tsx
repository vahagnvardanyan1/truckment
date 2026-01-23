'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AppsIcon from '@mui/icons-material/Apps';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Link } from '@/i18n/routing';
import { SearchBar } from '@/components/common/search-bar';
import { useThemeStore } from '@/lib/stores/theme-store';
import type { Locale } from '@/types';

// Hoisted outside component to avoid recreation on every render
const LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'hy', name: 'Հայdelays', flag: '🇦🇲' },
];

interface TopBarProps {
  onMenuClick: () => void;
  onSidebarToggle?: () => void;
}

export const TopBar = ({ onMenuClick, onSidebarToggle }: TopBarProps) => {
  const t = useTranslations('common');
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const themeMode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [appsMenuAnchor, setAppsMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  }, []);

  const handleUserMenuClose = useCallback(() => {
    setUserMenuAnchor(null);
  }, []);

  const handleAppsMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAppsMenuAnchor(event.currentTarget);
  }, []);

  const handleAppsMenuClose = useCallback(() => {
    setAppsMenuAnchor(null);
  }, []);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleLocaleChange = useCallback((locale: Locale) => {
    router.replace(pathname, { locale });
  }, [router, pathname]);


  return (
    <Box
      sx={{
        p: { xs: 0, md: 2 },
        pb: { xs: 2, md: 2 },
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: { xs: '12px', sm: '16px', md: '20px' },
          boxShadow: { xs: 'none', md: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' },
          border: { xs: `1px solid ${theme.palette.divider}`, md: '1px solid rgba(0, 0, 0, 0.05)' },
          borderTop: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.05)' },
          borderLeft: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.05)' },
          borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.05)' },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex',
          justifyContent: 'space-between', 
          px: { xs: 2, sm: 2.5, md: 3 }, 
          minHeight: { xs: 70, md: 70 },
          gap: { xs: 1, sm: 2 },
          width: '100%',
        }}>
        {/* Left: Menu and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, md: 2 }, flexShrink: 0 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Open navigation menu"
              onClick={onMenuClick}
              sx={{
                color: 'text.primary',
                width: 44,
                height: 44,
                flexShrink: 0,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Logo */}
          <Box 
            component={Link}
            href="/dashboard"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.75, md: 1 },
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 32, md: 36 },
                height: { xs: 32, md: 36 },
                borderRadius: { xs: '8px', md: '10px' },
                background: theme.palette.gradient.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(93, 135, 255, 0.25)',
              }}
            >
              <LocalShippingIcon sx={{ color: 'white', fontSize: { xs: 18, md: 20 } }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                letterSpacing: '-0.5px',
                background: theme.palette.gradient.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {t('appName')}
            </Typography>
          </Box>
        </Box>

        {/* Center: Search */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center',
          maxWidth: { xs: '50%', sm: '400px', md: '500px' },
          mx: 2,
        }}>
          <SearchBar />
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5, md: 1 }, flexShrink: 0 }}>
          {/* Notifications */}
          <IconButton
            color="inherit"
            aria-label="View notifications (4 unread)"
            sx={{
              color: 'text.primary',
              width: { xs: 44, md: 44 },
              height: { xs: 44, md: 44 },
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon fontSize={isMobile ? 'small' : 'medium'} />
            </Badge>
          </IconButton>

          {/* Apps launcher - Hidden on mobile */}
          {!isMobile && (
            <IconButton
              color="inherit"
              onClick={handleAppsMenuOpen}
              aria-label="Open apps menu"
              sx={{ color: 'text.primary' }}
            >
              <AppsIcon />
            </IconButton>
          )}

          {/* User avatar */}
          <IconButton
            onClick={handleUserMenuOpen}
            aria-label="Open user menu"
            sx={{ p: { xs: 0.25, md: 0.5 } }}
          >
            <Avatar
              alt="Mathew Anderson"
              src="/avatar.png"
              sx={{ width: { xs: 40, md: 36 }, height: { xs: 40, md: 36 } }}
            />
          </IconButton>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          disableScrollLock
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 220,
            },
          }}
        >
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('profile')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('settings')}</ListItemText>
          </MenuItem>
          <Divider />
          
          {/* Theme Toggle */}
          <MenuItem onClick={(e) => { e.stopPropagation(); handleThemeToggle(); }}>
            <ListItemIcon>
              {themeMode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}</ListItemText>
          </MenuItem>

          {/* Language Selector */}
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
              Language
            </Typography>
            {LOCALES.map((locale) => (
              <MenuItem
                key={locale.code}
                onClick={(e) => { e.stopPropagation(); handleLocaleChange(locale.code); handleUserMenuClose(); }}
                sx={{ 
                  borderRadius: 1, 
                  mb: 0.5,
                  '&:last-child': { mb: 0 }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  <span style={{ fontSize: '1.125rem' }}>{locale.flag}</span>
                  <span style={{ fontSize: '0.875rem' }}>{locale.name}</span>
                </Box>
              </MenuItem>
            ))}
          </Box>

          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('logout')}</ListItemText>
          </MenuItem>
        </Menu>

        {/* Apps Menu */}
        <Menu
          anchorEl={appsMenuAnchor}
          open={Boolean(appsMenuAnchor)}
          onClose={handleAppsMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          disableScrollLock
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 250,
            },
          }}
        >
          <MenuItem onClick={handleAppsMenuClose}>Chats</MenuItem>
          <MenuItem onClick={handleAppsMenuClose}>Calendar</MenuItem>
          <MenuItem onClick={handleAppsMenuClose}>Email</MenuItem>
          <MenuItem onClick={handleAppsMenuClose}>Contacts</MenuItem>
        </Menu>
      </Toolbar>
      </AppBar>
    </Box>
  );
};
