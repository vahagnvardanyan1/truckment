'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  InputAdornment,
  Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  SearchOutlined,
  DashboardOutlined,
  LocalShippingOutlined,
  LocalGasStationOutlined,
  BuildOutlined,
  AssessmentOutlined,
  NotificationsOutlined,
  SettingsOutlined,
  ContactsOutlined,
  ChatOutlined,
  CalendarMonthOutlined,
  EmailOutlined,
  KeyboardCommandKeyOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  KeyboardReturnOutlined,
} from '@mui/icons-material';
import { useRouter } from '@/i18n/routing';
import { useKeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcut';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  path?: string;
  shortcut?: string;
  action?: () => void;
  category: 'navigation' | 'action' | 'recent';
}

const navigationItems: CommandItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Fleet overview and analytics',
    icon: <DashboardOutlined />,
    path: '/dashboard',
    shortcut: 'G D',
    category: 'navigation',
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    description: 'Manage your fleet vehicles',
    icon: <LocalShippingOutlined />,
    path: '/dashboard/vehicles',
    shortcut: 'G V',
    category: 'navigation',
  },
  {
    id: 'fuel',
    label: 'Fuel Management',
    description: 'Track fuel consumption and costs',
    icon: <LocalGasStationOutlined />,
    path: '/dashboard/fuel',
    shortcut: 'G F',
    category: 'navigation',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    description: 'Service schedules and history',
    icon: <BuildOutlined />,
    path: '/dashboard/maintenance',
    shortcut: 'G M',
    category: 'navigation',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Analytics and insights',
    icon: <AssessmentOutlined />,
    path: '/dashboard/reports',
    shortcut: 'G R',
    category: 'navigation',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    description: 'View and manage alerts',
    icon: <NotificationsOutlined />,
    path: '/dashboard/alerts',
    shortcut: 'G A',
    category: 'navigation',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Configure preferences',
    icon: <SettingsOutlined />,
    path: '/dashboard/settings',
    shortcut: 'G S',
    category: 'navigation',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    description: 'Manage contacts',
    icon: <ContactsOutlined />,
    path: '/dashboard/contacts',
    category: 'navigation',
  },
  {
    id: 'chats',
    label: 'Chats',
    description: 'Team messaging',
    icon: <ChatOutlined />,
    path: '/dashboard/chats',
    category: 'navigation',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    description: 'Schedule and events',
    icon: <CalendarMonthOutlined />,
    path: '/dashboard/calendar',
    category: 'navigation',
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Email inbox',
    icon: <EmailOutlined />,
    path: '/dashboard/email',
    category: 'navigation',
  },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = useMemo(() => {
    if (!query) return navigationItems;
    const lowerQuery = query.toLowerCase();
    return navigationItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.path) {
        router.push(item.path as any);
      } else if (item.action) {
        item.action();
      }
      onClose();
      setQuery('');
      setSelectedIndex(0);
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredItems[selectedIndex]) {
            handleSelect(filteredItems[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    },
    [filteredItems, selectedIndex, handleSelect, onClose]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '60vh',
          overflow: 'hidden',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: alpha(theme.palette.background.default, 0.8),
            backdropFilter: 'blur(4px)',
          },
        },
      }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Search commands, pages, or vehicles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
            },
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <List sx={{ pt: 1 }}>
          {filteredItems.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No results found for &ldquo;{query}&rdquo;
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                Navigation
              </Typography>
              {filteredItems.map((item, index) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={index === selectedIndex}
                    onClick={() => handleSelect(item)}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: index === selectedIndex ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: index === selectedIndex ? 'primary.main' : 'text.primary',
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                      }}
                    />
                    {item.shortcut && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {item.shortcut.split(' ').map((key, i) => (
                          <Chip
                            key={i}
                            label={key}
                            size="small"
                            sx={{
                              height: 24,
                              minWidth: 24,
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              bgcolor: alpha(theme.palette.text.primary, 0.08),
                              color: 'text.secondary',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}
        </List>

        {/* Footer with keyboard hints */}
        <Box
          sx={{
            p: 1.5,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              icon={<ArrowUpwardOutlined sx={{ fontSize: '14px !important' }} />}
              label=""
              size="small"
              sx={{ height: 22, '& .MuiChip-label': { display: 'none' } }}
            />
            <Chip
              icon={<ArrowDownwardOutlined sx={{ fontSize: '14px !important' }} />}
              label=""
              size="small"
              sx={{ height: 22, '& .MuiChip-label': { display: 'none' } }}
            />
            <Typography variant="caption" color="text.secondary">
              Navigate
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              icon={<KeyboardReturnOutlined sx={{ fontSize: '14px !important' }} />}
              label=""
              size="small"
              sx={{ height: 22, '& .MuiChip-label': { display: 'none' } }}
            />
            <Typography variant="caption" color="text.secondary">
              Select
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label="Esc"
              size="small"
              sx={{ height: 22, fontSize: '0.625rem' }}
            />
            <Typography variant="caption" color="text.secondary">
              Close
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage command palette state
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  // Use keyboard shortcut for Cmd+K / Ctrl+K
  useKeyboardShortcut('meta+k', () => setOpen(true));
  useKeyboardShortcut('ctrl+k', () => setOpen(true));

  return {
    open,
    setOpen,
    openPalette: () => setOpen(true),
    closePalette: () => setOpen(false),
  };
}
