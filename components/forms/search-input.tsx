'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Popper,
  ClickAwayListener,
  Fade,
  CircularProgress,
  SxProps,
  Theme,
} from '@mui/material';
import {
  SearchOutlined,
  ClearOutlined,
  HistoryOutlined,
  TuneOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface SearchSuggestion {
  id: string;
  label: string;
  type?: string;
  icon?: React.ReactNode;
}

interface SearchFilter {
  id: string;
  label: string;
  active: boolean;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  filters?: SearchFilter[];
  onFilterToggle?: (filterId: string) => void;
  recentSearches?: string[];
  onRecentSearchSelect?: (search: string) => void;
  loading?: boolean;
  autoFocus?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  showFilters?: boolean;
  sx?: SxProps<Theme>;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  onSuggestionSelect,
  filters = [],
  onFilterToggle,
  recentSearches = [],
  onRecentSearchSelect,
  loading = false,
  autoFocus = false,
  size = 'medium',
  fullWidth = true,
  showFilters = false,
  sx,
}: SearchInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (suggestions.length > 0 || recentSearches.length > 0 || showFilters) {
      setShowDropdown(true);
    }
  }, [suggestions.length, recentSearches.length, showFilters]);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      if (e.target.value || suggestions.length > 0 || recentSearches.length > 0) {
        setShowDropdown(true);
      }
    },
    [onChange, suggestions.length, recentSearches.length]
  );

  const handleClear = useCallback(() => {
    onChange('');
    setShowDropdown(false);
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value);
        setShowDropdown(false);
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    },
    [onSearch, value]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      onSuggestionSelect?.(suggestion);
      onChange(suggestion.label);
      setShowDropdown(false);
    },
    [onSuggestionSelect, onChange]
  );

  const handleRecentClick = useCallback(
    (search: string) => {
      onRecentSearchSelect?.(search);
      onChange(search);
      setShowDropdown(false);
    },
    [onRecentSearchSelect, onChange]
  );

  const handleClickAway = useCallback(() => {
    setShowDropdown(false);
  }, []);

  const hasDropdownContent =
    (suggestions.length > 0 || (recentSearches.length > 0 && !value) || (showFilters && filters.length > 0));

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box ref={anchorRef} sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto', ...sx }}>
        <TextField
          fullWidth={fullWidth}
          size={size}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <SearchOutlined sx={{ color: 'text.secondary' }} />
                )}
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear} edge="end">
                  <ClearOutlined fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.2s ease-in-out',
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
            },
          }}
        />

        <Popper
          open={showDropdown && hasDropdownContent}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          style={{ width: anchorRef.current?.clientWidth, zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={8}
                sx={{
                  mt: 1,
                  maxHeight: 400,
                  overflow: 'auto',
                  borderRadius: 2,
                }}
              >
                {showFilters && filters.length > 0 && (
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Filters
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {filters.map((filter) => (
                        <Chip
                          key={filter.id}
                          label={filter.label}
                          size="small"
                          color={filter.active ? 'primary' : 'default'}
                          variant={filter.active ? 'filled' : 'outlined'}
                          onClick={() => onFilterToggle?.(filter.id)}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {suggestions.length > 0 && (
                  <List dense disablePadding>
                    {suggestions.map((suggestion) => (
                      <ListItem key={suggestion.id} disablePadding>
                        <ListItemButton onClick={() => handleSuggestionClick(suggestion)}>
                          {suggestion.icon && <ListItemIcon sx={{ minWidth: 36 }}>{suggestion.icon}</ListItemIcon>}
                          <ListItemText
                            primary={suggestion.label}
                            secondary={suggestion.type}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}

                {!value && recentSearches.length > 0 && (
                  <>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ px: 2, pt: 2, pb: 1, display: 'block' }}
                    >
                      Recent searches
                    </Typography>
                    <List dense disablePadding>
                      {recentSearches.map((search, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemButton onClick={() => handleRecentClick(search)}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <HistoryOutlined fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={search}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
