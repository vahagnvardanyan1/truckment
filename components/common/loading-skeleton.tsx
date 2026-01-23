'use client';

import { Box, Skeleton, SkeletonProps, Card, CardContent } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface LoadingSkeletonProps extends SkeletonProps {
  count?: number;
  spacing?: number;
}

export function LoadingSkeleton({ count = 1, spacing = 1, ...props }: LoadingSkeletonProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} animation="wave" {...props} />
      ))}
    </Box>
  );
}

interface CardSkeletonProps {
  hasIcon?: boolean;
  lines?: number;
  sx?: SxProps<Theme>;
}

export function CardSkeleton({ hasIcon = true, lines = 2, sx }: CardSkeletonProps) {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {hasIcon && (
            <Skeleton variant="circular" width={48} height={48} animation="wave" />
          )}
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} animation="wave" />
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={index === lines - 1 ? '40%' : '100%'}
                height={20}
                animation="wave"
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  sx?: SxProps<Theme>;
}

export function TableSkeleton({ rows = 5, columns = 4, sx }: TableSkeletonProps) {
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={index === 0 ? '20%' : `${60 / (columns - 1)}%`}
            height={24}
            animation="wave"
          />
        ))}
      </Box>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, py: 1.5 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={colIndex === 0 ? '20%' : `${60 / (columns - 1)}%`}
              height={20}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

interface ChartSkeletonProps {
  height?: number;
  sx?: SxProps<Theme>;
}

export function ChartSkeleton({ height = 300, sx }: ChartSkeletonProps) {
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="text" width={120} height={24} animation="wave" />
        <Skeleton variant="text" width={80} height={24} animation="wave" />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={height} animation="wave" sx={{ borderRadius: 1 }} />
    </Box>
  );
}
