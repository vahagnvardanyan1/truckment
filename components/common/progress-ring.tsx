'use client';

import { Box, Typography, CircularProgress, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ProgressRingProps {
  value: number;
  maxValue?: number;
  size?: number;
  thickness?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  labelVariant?: 'percentage' | 'value' | 'custom';
  customLabel?: string;
  sx?: SxProps<Theme>;
}

export function ProgressRing({
  value,
  maxValue = 100,
  size = 80,
  thickness = 4,
  color = 'primary',
  showLabel = true,
  labelVariant = 'percentage',
  customLabel,
  sx,
}: ProgressRingProps) {
  const theme = useTheme();
  const normalizedValue = Math.min(100, (value / maxValue) * 100);

  const getLabel = () => {
    switch (labelVariant) {
      case 'percentage':
        return `${Math.round(normalizedValue)}%`;
      case 'value':
        return `${value}`;
      case 'custom':
        return customLabel || '';
      default:
        return `${Math.round(normalizedValue)}%`;
    }
  };

  const getColor = () => {
    if (normalizedValue >= 80) return theme.palette.success.main;
    if (normalizedValue >= 50) return theme.palette.warning.main;
    if (normalizedValue >= 20) return theme.palette.warning.dark;
    return theme.palette.error.main;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{
          color: theme.palette.grey[theme.palette.mode === 'dark' ? 700 : 200],
          position: 'absolute',
        }}
      />
      <CircularProgress
        variant="determinate"
        value={normalizedValue}
        size={size}
        thickness={thickness}
        sx={{
          color: color === 'primary' ? getColor() : theme.palette[color].main,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      {showLabel && (
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.primary"
            fontWeight={600}
            sx={{ fontSize: size * 0.18 }}
          >
            {getLabel()}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

interface ProgressRingWithLabelProps extends ProgressRingProps {
  title: string;
  subtitle?: string;
}

export function ProgressRingWithLabel({
  title,
  subtitle,
  ...props
}: ProgressRingWithLabelProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <ProgressRing {...props} />
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
