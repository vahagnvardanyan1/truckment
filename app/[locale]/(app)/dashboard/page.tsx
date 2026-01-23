'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WarningIcon from '@mui/icons-material/Warning';
import BuildIcon from '@mui/icons-material/Build';

import { WelcomeBanner } from '@/components/common/welcome-banner';
import { StatCard } from '@/components/common/stat-card';
import { DonutChart } from '@/components/charts/donut-chart';
import { LineChart } from '@/components/charts/line-chart';

// Static data hoisted outside component to avoid recreation on every render
const vehicleStatusData = [
  { label: 'Active', value: 12, color: '#13DEB9' },
  { label: 'Idle', value: 8, color: '#FFAE1F' },
  { label: 'Maintenance', value: 3, color: '#FA896B' },
  { label: 'Offline', value: 1, color: '#5A6A85' },
];

const fuelConsumptionData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Fuel Consumed (L)',
      data: [450, 520, 480, 510, 490, 380, 420],
      color: '#5D87FF',
    },
  ],
};

const distanceTraveledData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Distance (km)',
      data: [2400, 2800, 2600, 3200],
      color: '#49BEFF',
    },
  ],
};

const DashboardPage = () => {
  const t = useTranslations('dashboard');

  // Stats array uses translations, so memoize it
  const stats = useMemo(
    () => [
      {
        title: t('totalVehicles'),
        value: '24',
        icon: <LocalShippingIcon />,
        iconColor: 'primary' as const,
        trend: {
          value: 5,
          label: 'this month',
          isPositive: true,
        },
      },
      {
        title: t('activeTrips'),
        value: '12',
        icon: <DirectionsCarIcon />,
        iconColor: 'success' as const,
        trend: {
          value: 8,
          label: 'vs last week',
          isPositive: true,
        },
      },
      {
        title: t('fuelAlerts'),
        value: '3',
        icon: <WarningIcon />,
        iconColor: 'warning' as const,
        trend: {
          value: -2,
          label: 'vs yesterday',
          isPositive: true,
        },
      },
      {
        title: t('maintenanceDue'),
        value: '5',
        icon: <BuildIcon />,
        iconColor: 'error' as const,
        trend: {
          value: 2,
          label: 'this week',
          isPositive: false,
        },
      },
    ],
    [t]
  );

  return (
    <>
      {/* Welcome Banner */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={12}>
          <WelcomeBanner
            userName="Mathew Anderson"
            userAvatar="/avatar.png"
            stats={[
              { label: t('todaySales'), value: '$2,340' },
              { label: t('performance'), value: '35%' },
            ]}
          />
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <DonutChart
            title="Fleet Status"
            subtitle="Current vehicle statuses"
            data={vehicleStatusData}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <LineChart
            title="Weekly Fuel Consumption"
            subtitle="Last 7 days"
            labels={fuelConsumptionData.labels}
            datasets={fuelConsumptionData.datasets}
          />
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <LineChart
            title="Monthly Distance Traveled"
            subtitle="Total kilometers by week"
            labels={distanceTraveledData.labels}
            datasets={distanceTraveledData.datasets}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
