'use client';

import { Chip, ChipProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export type StatusType = 'online' | 'offline' | 'moving' | 'idle' | 'alert' | 'maintenance' | 'success' | 'warning' | 'error' | 'info' | 'normal';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: StatusType;
  showDot?: boolean;
}

const statusLabels: Record<StatusType, string> = {
  online: 'Online',
  offline: 'Offline',
  moving: 'Moving',
  idle: 'Idle',
  alert: 'Alert',
  maintenance: 'Maintenance',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Info',
  normal: 'Normal',
};

export function StatusBadge({ status, showDot = true, label, sx, ...props }: StatusBadgeProps) {
  const theme = useTheme();
  const statusColor = theme.palette.status[status];

  return (
    <Chip
      size="small"
      label={label || statusLabels[status]}
      icon={
        showDot ? (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: statusColor,
              marginLeft: 8,
              animation: status === 'moving' || status === 'online' ? 'pulse 2s infinite' : undefined,
            }}
          />
        ) : undefined
      }
      sx={{
        backgroundColor: `${statusColor}20`,
        color: statusColor,
        fontWeight: 600,
        fontSize: '0.75rem',
        '& .MuiChip-icon': {
          color: statusColor,
        },
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
        ...sx,
      }}
      {...props}
    />
  );
}
