'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  category: string;
  path?: string;
}

export const SearchBar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (!open) {
      setOpen(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        handleClose();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [open]);

  // Mock search results - replace with real search
  const allResults: SearchResult[] = [
    {
      id: '1',
      title: 'Truck A-101',
      subtitle: 'Active • 65 km/h',
      icon: <LocalShippingIcon />,
      category: 'Vehicles',
      path: '/dashboard/vehicles',
    },
    {
      id: '2',
      title: 'Fuel Events',
      subtitle: '3 alerts today',
      icon: <LocalGasStationIcon />,
      category: 'Fuel',
      path: '/dashboard/fuel',
    },
    {
      id: '3',
      title: 'Oil Change - Truck A-101',
      subtitle: 'Due in 5 days',
      icon: <BuildIcon />,
      category: 'Maintenance',
      path: '/dashboard/maintenance',
    },
    {
      id: '4',
      title: 'Monthly Report',
      subtitle: 'January 2026',
      icon: <DescriptionIcon />,
      category: 'Reports',
      path: '/dashboard',
    },
    {
      id: '5',
      title: 'Fuel Efficiency',
      subtitle: '8.5 L/100km average',
      icon: <TrendingUpIcon />,
      category: 'Analytics',
      path: '/dashboard/fuel',
    },
  ];

  const filteredResults = searchQuery
    ? allResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allResults.slice(0, 5);

  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box ref={anchorRef} sx={{ position: 'relative', width: '100%' }}>
        {/* Search Input - Always Visible */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: { xs: 0.75, md: 1 },
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '30px',
            transition: 'all 0.2s',
            border: `1px solid ${open ? theme.palette.primary.main : 'transparent'}`,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <InputBase
            inputRef={inputRef}
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              '& input': {
                padding: 0,
              },
              '& input::placeholder': {
                color: 'text.secondary',
                opacity: 0.7,
              },
            }}
          />
        </Box>

        {/* Search Dropdown */}
        <Popper
          open={open && (searchQuery.length > 0 || true)}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          disablePortal={false}
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ]}
          sx={{
            zIndex: theme.zIndex.modal,
            width: {
              xs: '100vw',
              sm: anchorRef.current?.offsetWidth || 400,
              md: anchorRef.current?.offsetWidth || 500,
            },
            left: { xs: '0 !important', sm: 'auto' },
            right: { xs: 0, sm: 'auto' },
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={8}
                sx={{
                  mt: { xs: 0, sm: 1.5 },
                  borderRadius: { xs: 0, sm: 2 },
                  overflow: 'hidden',
                  boxShadow: {
                    xs: '0 4px 16px rgba(0,0,0,0.15)',
                    sm: '0 8px 32px rgba(0,0,0,0.12)',
                  },
                  border: { xs: 'none', sm: `1px solid ${theme.palette.divider}` },
                  borderTop: { xs: `1px solid ${theme.palette.divider}`, sm: `1px solid ${theme.palette.divider}` },
                }}
              >
                {/* Search Results */}
                <Box
                  sx={{
                    maxHeight: { xs: 'calc(100vh - 140px)', sm: 350, md: 350 },
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {filteredResults.length === 0 ? (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                      }}
                    >
                      <SearchIcon
                        sx={{
                          fontSize: 40,
                          color: 'text.disabled',
                          mb: 1.5,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                        {searchQuery
                          ? 'No results found'
                          : 'Start typing to search...'}
                      </Typography>
                    </Box>
                  ) : (
                    Object.entries(groupedResults).map(([category, results], idx) => (
                      <Box key={category}>
                        {idx > 0 && <Divider />}
                        <Box sx={{ py: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              px: { xs: 3, sm: 2.5 },
                              py: { xs: 1, sm: 0.75 },
                              color: 'text.secondary',
                              fontWeight: 700,
                              fontSize: { xs: '0.75rem', sm: '0.6875rem' },
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase',
                              display: 'block',
                            }}
                          >
                            {category}
                          </Typography>
                          <List disablePadding>
                            {results.map((result) => (
                              <ListItem key={result.id} disablePadding>
                                <ListItemButton
                                  onClick={handleClose}
                                  sx={{
                                    px: { xs: 3, sm: 2.5 },
                                    py: { xs: 1.5, sm: 1 },
                                    '&:hover': {
                                      backgroundColor: 'rgba(93, 135, 255, 0.08)',
                                    },
                                    '&:active': {
                                      backgroundColor: 'rgba(93, 135, 255, 0.12)',
                                    },
                                  }}
                                >
                                  {result.icon && (
                                    <ListItemIcon sx={{ minWidth: { xs: 44, sm: 40 } }}>
                                      <Box
                                        sx={{
                                          width: { xs: 38, sm: 34 },
                                          height: { xs: 38, sm: 34 },
                                          borderRadius: '8px',
                                          backgroundColor: 'rgba(93, 135, 255, 0.1)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'primary.main',
                                          fontSize: { xs: 20, sm: 18 },
                                        }}
                                      >
                                        {result.icon}
                                      </Box>
                                    </ListItemIcon>
                                  )}
                                  <ListItemText
                                    primary={result.title}
                                    secondary={result.subtitle}
                                    primaryTypographyProps={{
                                      fontSize: { xs: '0.9375rem', sm: '0.875rem' },
                                      fontWeight: 500,
                                    }}
                                    secondaryTypographyProps={{
                                      fontSize: { xs: '0.8125rem', sm: '0.75rem' },
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>

                {/* Footer with shortcuts */}
                {open && filteredResults.length > 0 && (
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderTop: `1px solid ${theme.palette.divider}`,
                      backgroundColor: 'background.default',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      Press ESC to close
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 0.75,
                          py: 0.25,
                          backgroundColor: 'background.paper',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 0.5,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          lineHeight: 1.5,
                        }}
                      >
                        ↑↓
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                        Navigate
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
