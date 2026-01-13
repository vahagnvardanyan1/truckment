'use client';

import { useState } from 'react';
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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AppsIcon from '@mui/icons-material/Apps';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import FlagIcon from '@mui/icons-material/Flag';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useThemeStore } from '@/lib/stores/theme-store';
import { Link } from '@/i18n/routing';
import { SearchBar } from '@/components/common/search-bar';
import type { Locale } from '@/types';

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
  const [localeMenuAnchor, setLocaleMenuAnchor] = useState<null | HTMLElement>(null);
  const [appsMenuAnchor, setAppsMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLocaleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLocaleMenuAnchor(event.currentTarget);
  };

  const handleLocaleMenuClose = () => {
    setLocaleMenuAnchor(null);
  };

  const handleAppsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAppsMenuAnchor(event.currentTarget);
  };

  const handleAppsMenuClose = () => {
    setAppsMenuAnchor(null);
  };

  const handleLocaleChange = (locale: Locale) => {
    router.replace(pathname, { locale });
    handleLocaleMenuClose();
  };

  const locales: { code: Locale; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        px: { xs: 2, sm: 2.5, md: 3 }, 
        minHeight: { xs: 70, md: 70 },
        gap: { xs: 1, sm: 2 },
        width: '100%',
      }}>
        {/* Left: Menu and Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flex: 1, maxWidth: { xs: '60%', sm: '50%', md: '45%', lg: '40%' } }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuClick}
              sx={{ 
                color: 'text.primary',
                width: 40,
                height: 40,
                flexShrink: 0,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <SearchBar />
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5, md: 1 } }}>
          {/* Locale selector */}
          <IconButton
            color="inherit"
            onClick={handleLocaleMenuOpen}
            sx={{ 
              color: 'text.primary',
              width: { xs: 40, md: 40 },
              height: { xs: 40, md: 40 },
            }}
          >
            <FlagIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>

          {/* Shopping cart - Hidden on mobile */}
          {!isMobile && (
            <IconButton color="inherit" sx={{ color: 'text.primary' }}>
              <Badge badgeContent={0} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}

          {/* Theme toggle */}
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ 
              color: 'text.primary',
              width: { xs: 40, md: 40 },
              height: { xs: 40, md: 40 },
            }}
          >
            {themeMode === 'light' ? <DarkModeIcon fontSize={isMobile ? 'small' : 'medium'} /> : <LightModeIcon fontSize={isMobile ? 'small' : 'medium'} />}
          </IconButton>

          {/* Notifications */}
          <IconButton 
            color="inherit" 
            sx={{ 
              color: 'text.primary',
              width: { xs: 40, md: 40 },
              height: { xs: 40, md: 40 },
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
              sx={{ color: 'text.primary' }}
            >
              <AppsIcon />
            </IconButton>
          )}

          {/* User avatar */}
          <IconButton
            onClick={handleUserMenuOpen}
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
          onClick={handleUserMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          disableScrollLock
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
            },
          }}
        >
          <MenuItem>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('profile')}</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('settings')}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('logout')}</ListItemText>
          </MenuItem>
        </Menu>

        {/* Locale Menu */}
        <Menu
          anchorEl={localeMenuAnchor}
          open={Boolean(localeMenuAnchor)}
          onClose={handleLocaleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          disableScrollLock
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 150,
            },
          }}
        >
          {locales.map((locale) => (
            <MenuItem
              key={locale.code}
              onClick={() => handleLocaleChange(locale.code)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span style={{ fontSize: '1.25rem' }}>{locale.flag}</span>
                <span>{locale.name}</span>
              </Box>
            </MenuItem>
          ))}
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
  );
};
