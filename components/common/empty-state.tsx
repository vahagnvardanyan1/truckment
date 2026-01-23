'use client';

import { Box, Typography, Button, SxProps, Theme } from '@mui/material';
import {
  InboxOutlined,
  SearchOffOutlined,
  ErrorOutlineOutlined,
  DirectionsCarOutlined,
  LocalGasStationOutlined,
  BuildOutlined,
  NotificationsOffOutlined,
} from '@mui/icons-material';
import { ReactNode } from 'react';

type EmptyStateVariant = 'default' | 'search' | 'error' | 'vehicles' | 'fuel' | 'maintenance' | 'alerts';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  sx?: SxProps<Theme>;
}

const defaultContent: Record<EmptyStateVariant, { icon: ReactNode; title: string; description: string }> = {
  default: {
    icon: <InboxOutlined sx={{ fontSize: 64 }} />,
    title: 'No data available',
    description: 'There is no data to display at the moment.',
  },
  search: {
    icon: <SearchOffOutlined sx={{ fontSize: 64 }} />,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
  error: {
    icon: <ErrorOutlineOutlined sx={{ fontSize: 64 }} />,
    title: 'Something went wrong',
    description: 'We encountered an error while loading the data. Please try again.',
  },
  vehicles: {
    icon: <DirectionsCarOutlined sx={{ fontSize: 64 }} />,
    title: 'No vehicles found',
    description: 'Add your first vehicle to start tracking your fleet.',
  },
  fuel: {
    icon: <LocalGasStationOutlined sx={{ fontSize: 64 }} />,
    title: 'No fuel events',
    description: 'Fuel events will appear here once you start tracking fuel consumption.',
  },
  maintenance: {
    icon: <BuildOutlined sx={{ fontSize: 64 }} />,
    title: 'No maintenance records',
    description: 'Maintenance records will appear here once you add them.',
  },
  alerts: {
    icon: <NotificationsOffOutlined sx={{ fontSize: 64 }} />,
    title: 'No alerts',
    description: 'You\'re all caught up! No alerts require your attention.',
  },
};

export function EmptyState({
  variant = 'default',
  title,
  description,
  icon,
  action,
  sx,
}: EmptyStateProps) {
  const content = defaultContent[variant];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 4,
        ...sx,
      }}
    >
      <Box
        sx={{
          color: 'text.secondary',
          opacity: 0.5,
          mb: 2,
        }}
      >
        {icon || content.icon}
      </Box>
      <Typography variant="h6" color="text.primary" gutterBottom>
        {title || content.title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 400, mb: action ? 3 : 0 }}
      >
        {description || content.description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
