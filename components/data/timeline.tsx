'use client';

import { ReactNode } from 'react';
import { Box, Typography, Paper, Avatar, SxProps, Theme } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  DirectionsCarOutlined,
  LocalGasStationOutlined,
  BuildOutlined,
  WarningAmberOutlined,
  PlaceOutlined,
  SpeedOutlined,
} from '@mui/icons-material';

export type TimelineEventType = 'trip_start' | 'trip_end' | 'fuel' | 'maintenance' | 'alert' | 'geofence' | 'speed' | 'success' | 'warning' | 'error' | 'info';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: Date | string;
  vehicleName?: string;
  icon?: ReactNode;
  color?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  maxItems?: number;
  showDate?: boolean;
  compact?: boolean;
  sx?: SxProps<Theme>;
}

const eventIcons: Partial<Record<TimelineEventType, ReactNode>> = {
  trip_start: <DirectionsCarOutlined />,
  trip_end: <DirectionsCarOutlined />,
  fuel: <LocalGasStationOutlined />,
  maintenance: <BuildOutlined />,
  alert: <WarningAmberOutlined />,
  geofence: <PlaceOutlined />,
  speed: <SpeedOutlined />,
  success: <DirectionsCarOutlined />,
  warning: <WarningAmberOutlined />,
  error: <WarningAmberOutlined />,
  info: <DirectionsCarOutlined />,
};

// Color mapping will be resolved at render time using theme
type EventColorKey = 'moving' | 'offline' | 'success' | 'maintenance' | 'error' | 'info' | 'warning' | 'normal';

const eventColorKeys: Record<TimelineEventType, EventColorKey> = {
  trip_start: 'moving',
  trip_end: 'offline',
  fuel: 'success',
  maintenance: 'maintenance',
  alert: 'error',
  geofence: 'info',
  speed: 'warning',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
};

function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
  compact: boolean;
}

function TimelineItem({ event, isLast, compact }: TimelineItemProps) {
  const theme = useTheme();
  const colorKey = eventColorKeys[event.type];
  const color = event.color || theme.palette.status[colorKey] || theme.palette.status.normal;
  const icon = event.icon || eventIcons[event.type];

  return (
    <Box sx={{ display: 'flex', gap: compact ? 1.5 : 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            width: compact ? 32 : 40,
            height: compact ? 32 : 40,
            bgcolor: alpha(color, 0.15),
            color: color,
            '& .MuiSvgIcon-root': {
              fontSize: compact ? 16 : 20,
            },
          }}
        >
          {icon}
        </Avatar>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              flex: 1,
              bgcolor: theme.palette.divider,
              my: 1,
              minHeight: compact ? 20 : 32,
            }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1, pb: isLast ? 0 : compact ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box>
            <Typography
              variant={compact ? 'body2' : 'subtitle2'}
              fontWeight={600}
              sx={{ lineHeight: 1.4 }}
            >
              {event.title}
            </Typography>
            {event.vehicleName && (
              <Typography variant="caption" color="text.secondary">
                {event.vehicleName}
              </Typography>
            )}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            {formatTimestamp(event.timestamp)}
          </Typography>
        </Box>
        {event.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {event.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function Timeline({ events, maxItems, showDate = false, compact = false, sx }: TimelineProps) {
  const displayedEvents = maxItems ? events.slice(0, maxItems) : events;

  // Group events by date if showDate is true
  const groupedEvents = showDate
    ? displayedEvents.reduce(
        (acc, event) => {
          const dateKey = formatDate(event.timestamp);
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(event);
          return acc;
        },
        {} as Record<string, TimelineEvent[]>
      )
    : { '': displayedEvents };

  return (
    <Box sx={sx}>
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <Box key={date || 'events'}>
          {date && (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'block', mb: 2, mt: date === Object.keys(groupedEvents)[0] ? 0 : 3 }}
            >
              {date}
            </Typography>
          )}
          {dateEvents.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLast={index === dateEvents.length - 1 && date === Object.keys(groupedEvents).slice(-1)[0]}
              compact={compact}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
