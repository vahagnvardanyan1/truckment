'use client';

import { ReactNode, useMemo } from 'react';
import { Box, Card, CardContent, Typography, Skeleton, SxProps, Theme } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface SparklineData {
  values: number[];
  color?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    label?: string;
  };
  sparkline?: SparklineData;
  loading?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

function Sparkline({ values, color }: SparklineData) {
  const theme = useTheme();
  const sparkColor = color || theme.palette.primary.main;

  const { path, minY, maxY, width, height } = useMemo(() => {
    const w = 80;
    const h = 32;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    });

    return {
      path: `M ${points.join(' L ')}`,
      minY: min,
      maxY: max,
      width: w,
      height: h,
    };
  }, [values]);

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sparkline-gradient-${sparkColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sparkColor} stopOpacity={0.3} />
          <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`${path} L ${width},${height} L 0,${height} Z`}
        fill={`url(#sparkline-gradient-${sparkColor.replace('#', '')})`}
      />
      <path
        d={path}
        fill="none"
        stroke={sparkColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'primary',
  trend,
  sparkline,
  loading = false,
  onClick,
  sx,
}: MetricCardProps) {
  const theme = useTheme();

  const trendDirection = trend
    ? trend.value > 0
      ? 'up'
      : trend.value < 0
        ? 'down'
        : 'flat'
    : null;

  const trendColor =
    trendDirection === 'up'
      ? theme.palette.success.main
      : trendDirection === 'down'
        ? theme.palette.error.main
        : theme.palette.text.secondary;

  const TrendIcon =
    trendDirection === 'up'
      ? TrendingUp
      : trendDirection === 'down'
        ? TrendingDown
        : TrendingFlat;

  if (loading) {
    return (
      <Card sx={{ height: '100%', ...sx }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={80} height={40} />
              <Skeleton variant="text" width={120} height={16} />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[8],
            }
          : {},
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {trend && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: trendColor,
                  }}
                >
                  <TrendIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={600}>
                    {trend.value > 0 ? '+' : ''}
                    {trend.value}%
                  </Typography>
                </Box>
              )}
              {(subtitle || trend?.label) && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle || trend?.label}
                </Typography>
              )}
            </Box>
            {sparkline && (
              <Box sx={{ mt: 2 }}>
                <Sparkline {...sparkline} />
              </Box>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.gradient[iconColor],
                color: '#fff',
                flexShrink: 0,
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: 20, md: 24 },
                },
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
