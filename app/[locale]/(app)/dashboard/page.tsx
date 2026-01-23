'use client';

import { useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  LocalShippingOutlined,
  DirectionsCarOutlined,
  WarningAmberOutlined,
  BuildOutlined,
  RefreshOutlined,
  MoreVertOutlined,
  NavigateNextOutlined,
  WbSunnyOutlined,
  AccessTimeOutlined,
  TrendingUpOutlined,
  NotificationsOutlined,
} from '@mui/icons-material';

import { MetricCard } from '@/components/data/metric-card';
import { Timeline, TimelineEventType } from '@/components/data/timeline';
import { DonutChart } from '@/components/charts/donut-chart';
import { LineChart } from '@/components/charts/line-chart';
import { StatusBadge, StatusType } from '@/components/common/status-badge';
import { useAlertsStore } from '@/lib/stores/alerts-store';
import { Link } from '@/i18n/routing';

// Mock data for fleet status donut chart
const fleetStatusData = [
  { label: 'Online', value: 12, color: '#13DEB9' },
  { label: 'Idle', value: 8, color: '#FFAE1F' },
  { label: 'Maintenance', value: 3, color: '#7C4DFF' },
  { label: 'Offline', value: 1, color: '#5A6A85' },
];

// Mock data for fuel consumption chart
const fuelConsumptionData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'This Week',
      data: [450, 520, 480, 510, 490, 380, 420],
      color: '#5D87FF',
    },
    {
      label: 'Last Week',
      data: [420, 480, 460, 530, 470, 350, 400],
      color: '#B5B9C8',
    },
  ],
};

// Mock data for sparklines
const vehicleSparkline = [18, 20, 22, 21, 23, 22, 24];
const tripsSparkline = [8, 10, 12, 9, 11, 10, 12];
const fuelSparkline = [5, 4, 6, 3, 4, 3, 3];
const maintenanceSparkline = [3, 4, 3, 5, 4, 6, 5];

// Mock activity events
const activityEvents = [
  {
    id: '1',
    type: 'trip_start' as TimelineEventType,
    title: 'Trip Started',
    description: 'Route: Warehouse A to Customer B',
    timestamp: new Date(Date.now() - 30 * 60000),
    vehicleName: 'Truck ABC-123',
  },
  {
    id: '2',
    type: 'fuel' as TimelineEventType,
    title: 'Fuel Refill',
    description: '45L at Shell Station - $67.50',
    timestamp: new Date(Date.now() - 2 * 3600000),
    vehicleName: 'Van XYZ-789',
  },
  {
    id: '3',
    type: 'geofence' as TimelineEventType,
    title: 'Geofence Entry',
    description: 'Arrived at Warehouse A',
    timestamp: new Date(Date.now() - 4 * 3600000),
    vehicleName: 'Truck ABC-123',
  },
  {
    id: '4',
    type: 'maintenance' as TimelineEventType,
    title: 'Service Completed',
    description: 'Oil change and tire rotation',
    timestamp: new Date(Date.now() - 8 * 3600000),
    vehicleName: 'Truck DEF-456',
  },
  {
    id: '5',
    type: 'alert' as TimelineEventType,
    title: 'Speed Warning',
    description: 'Exceeded speed limit: 95 km/h in 60 zone',
    timestamp: new Date(Date.now() - 12 * 3600000),
    vehicleName: 'Van XYZ-789',
  },
];

// Welcome banner component
function WelcomeBanner() {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [currentTime]);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card
      sx={{
        background: theme.palette.gradient.primary,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ py: 3 }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {greeting}, Mathew!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              Here&apos;s your fleet overview for today. You have{' '}
              <strong>3 alerts</strong> that need attention.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeOutlined sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  {formattedDate} &bull; {formattedTime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WbSunnyOutlined sx={{ fontSize: 20 }} />
                <Typography variant="body2">22°C Sunny</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
            <Button
              component={Link}
              href="/dashboard/vehicles"
              variant="contained"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
              endIcon={<NavigateNextOutlined />}
            >
              View All Vehicles
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          right: 100,
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.05)',
        }}
      />
    </Card>
  );
}

// Alert list item component
function AlertListItem({
  alert,
  onDismiss,
}: {
  alert: { id: string; title: string; message: string; priority: string; vehicleName?: string; timestamp: string };
  onDismiss: (id: string) => void;
}) {
  const theme = useTheme();
  const priorityColors: Record<string, string> = {
    critical: theme.palette.error.main,
    high: theme.palette.warning.main,
    medium: theme.palette.info.main,
    low: theme.palette.success.main,
  };

  return (
    <ListItem
      sx={{
        borderLeft: 4,
        borderColor: priorityColors[alert.priority] || theme.palette.grey[400],
        bgcolor: alpha(priorityColors[alert.priority] || theme.palette.grey[400], 0.05),
        mb: 1,
        borderRadius: 1,
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: alpha(priorityColors[alert.priority] || theme.palette.grey[400], 0.15),
            color: priorityColors[alert.priority] || theme.palette.grey[400],
          }}
        >
          <WarningAmberOutlined />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {alert.title}
            </Typography>
            <Chip
              label={alert.priority}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.625rem',
                bgcolor: alpha(priorityColors[alert.priority], 0.1),
                color: priorityColors[alert.priority],
              }}
            />
          </Box>
        }
        secondary={
          <>
            <Typography variant="caption" color="text.secondary" component="span">
              {alert.vehicleName && `${alert.vehicleName} • `}
              {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton size="small" onClick={() => onDismiss(alert.id)}>
          <MoreVertOutlined fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const DashboardPage = () => {
  const t = useTranslations('dashboard');
  const theme = useTheme();
  const { alerts, dismiss } = useAlertsStore();
  const recentAlerts = alerts.slice(0, 4);

  const stats = useMemo(
    () => [
      {
        title: t('totalVehicles'),
        value: '24',
        icon: <LocalShippingOutlined />,
        iconColor: 'primary' as const,
        trend: { value: 5, label: 'vs last month' },
        sparkline: { values: vehicleSparkline, color: theme.palette.primary.main },
      },
      {
        title: t('activeTrips'),
        value: '12',
        icon: <DirectionsCarOutlined />,
        iconColor: 'success' as const,
        trend: { value: 8, label: 'vs last week' },
        sparkline: { values: tripsSparkline, color: theme.palette.success.main },
      },
      {
        title: t('fuelAlerts'),
        value: '3',
        icon: <WarningAmberOutlined />,
        iconColor: 'warning' as const,
        trend: { value: -25, label: 'vs yesterday' },
        sparkline: { values: fuelSparkline, color: theme.palette.warning.main },
      },
      {
        title: t('maintenanceDue'),
        value: '5',
        icon: <BuildOutlined />,
        iconColor: 'error' as const,
        trend: { value: 12, label: 'this week' },
        sparkline: { values: maintenanceSparkline, color: theme.palette.error.main },
      },
    ],
    [t, theme]
  );

  return (
    <Box>
      {/* Welcome Banner */}
      <Box sx={{ mb: 3 }}>
        <WelcomeBanner />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <MetricCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Map and Fleet Status Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Live Fleet Map
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time vehicle positions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small">
                    <RefreshOutlined />
                  </IconButton>
                  <Button
                    component={Link}
                    href="/dashboard/vehicles"
                    variant="outlined"
                    size="small"
                    endIcon={<NavigateNextOutlined />}
                  >
                    Full Map
                  </Button>
                </Box>
              </Box>
              {/* Map placeholder - integrate with actual map component */}
              <Box
                sx={{
                  height: 320,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 1,
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Simulated map markers */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '40%',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.status.online,
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.status.online, 0.3)}`,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '45%',
                    left: '60%',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.status.moving,
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.status.moving, 0.3)}`,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '60%',
                    left: '25%',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.status.idle,
                    boxShadow: `0 0 0 4px ${alpha(theme.palette.status.idle, 0.3)}`,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Interactive map will display here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <DonutChart
            title="Fleet Status"
            subtitle="Current vehicle distribution"
            data={fleetStatusData}
          />
        </Grid>
      </Grid>

      {/* Fuel Chart and Alerts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <LineChart
            title="Fuel Consumption"
            subtitle="Weekly comparison"
            labels={fuelConsumptionData.labels}
            datasets={fuelConsumptionData.datasets}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Recent Alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {alerts.filter((a) => !a.read).length} unread alerts
                  </Typography>
                </Box>
                <Link href="/dashboard/alerts">
                  <IconButton size="small">
                    <NotificationsOutlined />
                  </IconButton>
                </Link>
              </Box>
              <List disablePadding>
                {recentAlerts.map((alert) => (
                  <AlertListItem
                    key={alert.id}
                    alert={alert}
                    onDismiss={dismiss}
                  />
                ))}
              </List>
              {alerts.length > 4 && (
                <Button
                  component={Link}
                  href="/dashboard/alerts"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  View All Alerts ({alerts.length})
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Timeline */}
      <Grid container spacing={3}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Activity Timeline
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent fleet activity (last 24 hours)
                  </Typography>
                </Box>
                <Chip
                  icon={<TrendingUpOutlined sx={{ fontSize: 16 }} />}
                  label="Live"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
              <Timeline events={activityEvents} compact showDate />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
