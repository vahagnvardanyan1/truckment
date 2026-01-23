'use client';

import { ReactNode } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export function FormField({
  label,
  children,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  sx,
}: FormFieldProps) {
  const theme = useTheme();

  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!error}
      disabled={disabled}
      sx={sx}
    >
      <FormLabel
        sx={{
          mb: 1,
          fontWeight: 600,
          fontSize: '0.875rem',
          color: error ? 'error.main' : 'text.primary',
          '&.Mui-focused': {
            color: error ? 'error.main' : 'primary.main',
          },
        }}
      >
        {label}
        {required && (
          <Typography
            component="span"
            sx={{ color: 'error.main', ml: 0.5 }}
          >
            *
          </Typography>
        )}
      </FormLabel>
      {children}
      {(error || helperText) && (
        <FormHelperText
          sx={{
            mt: 0.5,
            mx: 0,
          }}
        >
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function FormSection({ title, description, children, sx }: FormSectionProps) {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
