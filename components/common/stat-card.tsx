'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'primary',
  trend,
}: StatCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.08)', md: '0 0 20px rgba(0,0,0,0.08)' },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1.5, md: 2 } }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              fontWeight={500}
              sx={{ fontSize: { xs: '0.8125rem', md: '0.875rem' } }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              fontWeight={700} 
              color="text.primary"
              sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 0.5, fontSize: { xs: '0.8125rem', md: '0.875rem' } }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: { xs: 52, md: 56 },
                height: { xs: 52, md: 56 },
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.gradient[iconColor],
                color: 'white',
                flexShrink: 0,
                ml: 2,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            {trend.isPositive !== false ? (
              <TrendingUpIcon
                sx={{
                  fontSize: { xs: 16, md: 18 },
                  color: 'success.main',
                }}
              />
            ) : (
              <TrendingDownIcon
                sx={{
                  fontSize: { xs: 16, md: 18 },
                  color: 'error.main',
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend.isPositive !== false ? 'success.main' : 'error.main',
                fontWeight: 600,
                fontSize: { xs: '0.8125rem', md: '0.875rem' },
              }}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8125rem', md: '0.875rem' } }}
            >
              {trend.label}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
