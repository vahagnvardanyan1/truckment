'use client';

import { ReactNode, useState, useCallback, SyntheticEvent } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Badge,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabNavProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'standard' | 'fullWidth' | 'scrollable';
  size?: 'small' | 'medium';
  orientation?: 'horizontal' | 'vertical';
  sx?: SxProps<Theme>;
}

export function TabNav({
  tabs,
  value,
  onChange,
  variant = 'standard',
  size = 'medium',
  orientation = 'horizontal',
  sx,
}: TabNavProps) {
  const theme = useTheme();

  const handleChange = useCallback(
    (_: SyntheticEvent, newValue: string) => {
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant={variant}
      orientation={orientation}
      scrollButtons="auto"
      sx={{
        minHeight: size === 'small' ? 36 : 48,
        borderBottom: orientation === 'horizontal' ? 1 : 0,
        borderRight: orientation === 'vertical' ? 1 : 0,
        borderColor: 'divider',
        '& .MuiTabs-indicator': {
          height: orientation === 'horizontal' ? 3 : undefined,
          width: orientation === 'vertical' ? 3 : undefined,
          borderRadius: 1.5,
        },
        ...sx,
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          value={tab.id}
          disabled={tab.disabled}
          icon={tab.icon as React.ReactElement}
          iconPosition="start"
          label={
            tab.badge !== undefined ? (
              <Badge
                badgeContent={tab.badge}
                color="primary"
                max={99}
                sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}
              >
                {tab.label}
              </Badge>
            ) : (
              tab.label
            )
          }
          sx={{
            minHeight: size === 'small' ? 36 : 48,
            px: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: size === 'small' ? '0.8125rem' : '0.875rem',
            '&.Mui-selected': {
              fontWeight: 600,
            },
          }}
        />
      ))}
    </Tabs>
  );
}

// Tab panel component for content
interface TabPanelProps {
  children: ReactNode;
  value: string;
  activeValue: string;
  keepMounted?: boolean;
  sx?: SxProps<Theme>;
}

export function TabPanel({
  children,
  value,
  activeValue,
  keepMounted = false,
  sx,
}: TabPanelProps) {
  const isActive = value === activeValue;

  if (!keepMounted && !isActive) return null;

  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      sx={{
        pt: 3,
        ...sx,
      }}
    >
      {(isActive || keepMounted) && children}
    </Box>
  );
}

// Pill-style tabs (alternative design)
interface PillTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

export function PillTabs({
  tabs,
  value,
  onChange,
  size = 'medium',
  sx,
}: PillTabsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        gap: 0.5,
        p: 0.5,
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        borderRadius: 2,
        ...sx,
      }}
    >
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          sx={{
            px: size === 'small' ? 2 : 3,
            py: size === 'small' ? 0.75 : 1,
            borderRadius: 1.5,
            cursor: tab.disabled ? 'default' : 'pointer',
            bgcolor: value === tab.id ? 'background.paper' : 'transparent',
            color: tab.disabled
              ? 'text.disabled'
              : value === tab.id
                ? 'primary.main'
                : 'text.secondary',
            fontWeight: value === tab.id ? 600 : 500,
            fontSize: size === 'small' ? '0.8125rem' : '0.875rem',
            boxShadow: value === tab.id ? theme.shadows[1] : 'none',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ...(!tab.disabled && {
              '&:hover': {
                color: value === tab.id ? 'primary.main' : 'text.primary',
              },
            }),
          }}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <Badge
              badgeContent={tab.badge}
              color="primary"
              max={99}
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}
