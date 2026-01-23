'use client';

import { ReactNode, useState, useCallback } from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  Collapse,
  IconButton,
  Box,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import {
  CloseOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  WarningAmberOutlined,
  InfoOutlined,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

type AlertSeverity = 'success' | 'error' | 'warning' | 'info';
type AlertVariant = 'standard' | 'filled' | 'outlined';

interface AlertAction {
  label: string;
  onClick: () => void;
}

interface AlertBannerProps {
  severity?: AlertSeverity;
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: AlertAction;
  dismissible?: boolean;
  onDismiss?: () => void;
  sx?: SxProps<Theme>;
}

const severityIcons: Record<AlertSeverity, ReactNode> = {
  success: <CheckCircleOutlined />,
  error: <ErrorOutlined />,
  warning: <WarningAmberOutlined />,
  info: <InfoOutlined />,
};

export function AlertBanner({
  severity = 'info',
  variant = 'standard',
  title,
  children,
  icon,
  action,
  dismissible = false,
  onDismiss,
  sx,
}: AlertBannerProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  return (
    <Collapse in={visible}>
      <MuiAlert
        severity={severity}
        variant={variant}
        icon={icon || severityIcons[severity]}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {action && (
              <Button
                color="inherit"
                size="small"
                onClick={action.onClick}
                sx={{ fontWeight: 600 }}
              >
                {action.label}
              </Button>
            )}
            {dismissible && (
              <IconButton
                aria-label="dismiss"
                color="inherit"
                size="small"
                onClick={handleDismiss}
              >
                <CloseOutlined fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
        sx={{
          borderRadius: 2,
          alignItems: title ? 'flex-start' : 'center',
          '& .MuiAlert-message': {
            width: '100%',
          },
          ...sx,
        }}
      >
        {title && <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>{title}</AlertTitle>}
        {children}
      </MuiAlert>
    </Collapse>
  );
}

// Inline alert for form errors
interface InlineAlertProps {
  severity?: AlertSeverity;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function InlineAlert({ severity = 'error', children, sx }: InlineAlertProps) {
  return (
    <MuiAlert
      severity={severity}
      variant="outlined"
      icon={false}
      sx={{
        py: 0.5,
        px: 1.5,
        borderRadius: 1,
        '& .MuiAlert-message': {
          py: 0.5,
        },
        ...sx,
      }}
    >
      {children}
    </MuiAlert>
  );
}

// System-wide announcement banner
interface AnnouncementBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'maintenance';
  action?: AlertAction;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function AnnouncementBanner({
  message,
  type = 'info',
  action,
  dismissible = true,
  onDismiss,
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(true);

  const severityMap: Record<string, AlertSeverity> = {
    info: 'info',
    warning: 'warning',
    maintenance: 'warning',
  };

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        bgcolor: type === 'maintenance' ? 'warning.main' : `${severityMap[type]}.main`,
        color: type === 'warning' || type === 'maintenance' ? 'warning.contrastText' : `${severityMap[type]}.contrastText`,
        py: 1,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {type === 'maintenance' ? <WarningAmberOutlined fontSize="small" /> : <InfoOutlined fontSize="small" />}
        <span>{message}</span>
      </Box>
      {action && (
        <Button
          size="small"
          color="inherit"
          onClick={action.onClick}
          sx={{ fontWeight: 600, minWidth: 'auto' }}
        >
          {action.label}
        </Button>
      )}
      {dismissible && (
        <IconButton size="small" color="inherit" onClick={handleDismiss}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
