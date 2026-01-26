'use client';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

interface WelcomeBannerProps {
  userName: string;
  userAvatar?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export const WelcomeBanner = ({ userName, userAvatar, stats }: WelcomeBannerProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? theme.palette.gradient.primary
          : 'linear-gradient(135deg, #E6FBF6 0%, #E8F4FC 100%)',
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        {/* Left: Welcome message */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={userAvatar}
            alt={userName}
            sx={{
              width: 56,
              height: 56,
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              color="text.primary"
              gutterBottom
            >
              Welcome back {userName}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here's what's happening with your fleet today
            </Typography>
          </Box>
        </Box>

        {/* Right: Quick stats */}
        {stats && stats.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, sm: 4 },
              flexWrap: 'wrap',
            }}
          >
            {stats.map((stat, index) => (
              <Box key={index}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Decorative illustration */}
        <Box
          sx={{
            position: 'absolute',
            right: -30,
            bottom: -30,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: { xs: 'none', md: 'block' },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 30,
            top: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: { xs: 'none', md: 'block' },
          }}
        />
      </Box>
    </Card>
  );
};
