'use client';

import { forwardRef, useCallback } from 'react';
import {
  Alert,
  AlertTitle,
  Snackbar,
  SnackbarProps,
  IconButton,
  Box,
  Typography,
  Slide,
  SlideProps,
} from '@mui/material';
import {
  CheckCircleOutlined,
  ErrorOutlined,
  WarningAmberOutlined,
  InfoOutlined,
  CloseOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  severity?: ToastSeverity;
  duration?: number;
  action?: React.ReactNode;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const severityIcons: Record<ToastSeverity, React.ReactNode> = {
  success: <CheckCircleOutlined />,
  error: <ErrorOutlined />,
  warning: <WarningAmberOutlined />,
  info: <InfoOutlined />,
};

export function Toast({
  open,
  onClose,
  message,
  title,
  severity = 'info',
  duration = 5000,
  action,
  position = { vertical: 'bottom', horizontal: 'right' },
}: ToastProps) {
  const theme = useTheme();

  const handleClose = useCallback(
    (_?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') return;
      onClose();
    },
    [onClose]
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={position}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        icon={severityIcons[severity]}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {action}
            <IconButton
              size="small"
              color="inherit"
              onClick={handleClose}
              sx={{ ml: action ? 0 : 1 }}
            >
              <CloseOutlined fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 500,
          boxShadow: theme.shadows[8],
          '.MuiAlert-icon': {
            alignItems: title ? 'flex-start' : 'center',
          },
        }}
      >
        {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Snackbar>
  );
}

// Hook for managing toast state
import { create } from 'zustand';

interface ToastState {
  open: boolean;
  message: string;
  title?: string;
  severity: ToastSeverity;
  duration: number;
  action?: React.ReactNode;
}

interface ToastStore {
  toast: ToastState;
  showToast: (options: Partial<Omit<ToastState, 'open'>>) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: {
    open: false,
    message: '',
    severity: 'info',
    duration: 5000,
  },
  showToast: (options) =>
    set({
      toast: {
        open: true,
        message: options.message || '',
        title: options.title,
        severity: options.severity || 'info',
        duration: options.duration || 5000,
        action: options.action,
      },
    }),
  hideToast: () =>
    set((state) => ({
      toast: { ...state.toast, open: false },
    })),
}));

// Toast provider component to be placed in root layout
export function ToastProvider() {
  const { toast, hideToast } = useToastStore();

  return (
    <Toast
      open={toast.open}
      onClose={hideToast}
      message={toast.message}
      title={toast.title}
      severity={toast.severity}
      duration={toast.duration}
      action={toast.action}
    />
  );
}
