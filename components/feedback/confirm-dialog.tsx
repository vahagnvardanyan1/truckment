'use client';

import { ReactNode, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  CloseOutlined,
  WarningAmberOutlined,
  DeleteOutlined,
  ErrorOutlined,
  HelpOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

type ConfirmDialogVariant = 'default' | 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  icon?: ReactNode;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md';
}

const variantConfig: Record<
  ConfirmDialogVariant,
  { icon: ReactNode; color: 'primary' | 'error' | 'warning' | 'info' }
> = {
  default: { icon: <HelpOutlined />, color: 'primary' },
  danger: { icon: <DeleteOutlined />, color: 'error' },
  warning: { icon: <WarningAmberOutlined />, color: 'warning' },
  info: { icon: <ErrorOutlined />, color: 'info' },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon,
  loading = false,
  maxWidth = 'xs',
}: ConfirmDialogProps) {
  const theme = useTheme();
  const config = variantConfig[variant];
  const displayIcon = icon || config.icon;

  const handleConfirm = useCallback(async () => {
    await onConfirm();
    if (!loading) {
      onClose();
    }
  }, [onConfirm, onClose, loading]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette[config.color].main, 0.1),
              color: theme.palette[config.color].main,
            }}
          >
            {displayIcon}
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        {!loading && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
          >
            <CloseOutlined />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {typeof message === 'string' ? (
          <DialogContentText>{message}</DialogContentText>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={config.color}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? 'Please wait...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Hook for managing confirm dialog state
import { create } from 'zustand';

interface ConfirmState {
  open: boolean;
  title: string;
  message: string | ReactNode;
  confirmText: string;
  cancelText: string;
  variant: ConfirmDialogVariant;
  onConfirm: () => void | Promise<void>;
  loading: boolean;
}

interface ConfirmStore {
  state: ConfirmState;
  confirm: (options: Partial<Omit<ConfirmState, 'open' | 'loading'>>) => Promise<boolean>;
  close: () => void;
  setLoading: (loading: boolean) => void;
}

const defaultState: ConfirmState = {
  open: false,
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
  onConfirm: () => {},
  loading: false,
};

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  state: defaultState,
  confirm: (options) =>
    new Promise((resolve) => {
      set({
        state: {
          ...defaultState,
          ...options,
          open: true,
          onConfirm: async () => {
            set({ state: { ...get().state, loading: true } });
            if (options.onConfirm) {
              await options.onConfirm();
            }
            set({ state: { ...get().state, open: false, loading: false } });
            resolve(true);
          },
        },
      });
    }),
  close: () => set({ state: { ...get().state, open: false } }),
  setLoading: (loading) => set({ state: { ...get().state, loading } }),
}));

// Confirm dialog provider component
export function ConfirmDialogProvider() {
  const { state, close } = useConfirmStore();

  return (
    <ConfirmDialog
      open={state.open}
      onClose={close}
      onConfirm={state.onConfirm}
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      variant={state.variant}
      loading={state.loading}
    />
  );
}
