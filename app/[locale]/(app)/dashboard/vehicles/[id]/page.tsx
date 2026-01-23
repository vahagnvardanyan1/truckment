'use client';

import { useState, useMemo, use } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  ArrowBackOutlined,
  EditOutlined,
  DeleteOutlined,
  LocalGasStationOutlined,
  SpeedOutlined,
  PlaceOutlined,
  BuildOutlined,
  DirectionsCarOutlined,
  TrendingUpOutlined,
  HistoryOutlined,
  DescriptionOutlined,
  LocalShippingOutlined,
} from '@mui/icons-material';
import { Link, useRouter } from '@/i18n/routing';
import { StatusBadge } from '@/components/common/status-badge';
import { ProgressRing } from '@/components/common/progress-ring';
import { TabNav, TabPanel } from '@/components/navigation/tab-nav';
import { Timeline, TimelineEventType } from '@/components/data/timeline';
import { LineChart } from '@/components/charts/line-chart';

// Mock vehicle data (in real app, this would come from an API)
const mockVehicle = {
  id: 'v1',
  name: 'Truck ABC-123',
  licensePlate: 'ABC-123',
  type: 'truck' as const,
  status: 'online' as const,
  currentSpeed: 65,
  fuelLevel: 78,
  odometer: 45230,
  lastService: '2024-01-10',
  nextServiceOdometer: 50000,
  engineOn: true,
  location: {
    lat: 40.1772,
    lng: 44.5035,
    address: 'Yerevan, Armenia',
  },
  driver: {
    name: 'John Doe',
    phone: '+374 99 123456',
  },
  specs: {
    make: 'Mercedes-Benz',
    model: 'Actros',
    year: 2022,
    vin: 'WDB96340310123456',
    fuelType: 'Diesel',
    tankCapacity: 400,
  },
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: <DirectionsCarOutlined /> },
  { id: 'trips', label: 'Trips', icon: <HistoryOutlined /> },
  { id: 'fuel', label: 'Fuel', icon: <LocalGasStationOutlined /> },
  { id: 'maintenance', label: 'Maintenance', icon: <BuildOutlined /> },
  { id: 'documents', label: 'Documents', icon: <DescriptionOutlined /> },
];

const recentActivity = [
  {
    id: '1',
    type: 'trip_start' as TimelineEventType,
    title: 'Trip Started',
    description: 'Route: Warehouse A to Customer B',
    timestamp: new Date(Date.now() - 30 * 60000),
  },
  {
    id: '2',
    type: 'fuel' as TimelineEventType,
    title: 'Fuel Refill',
    description: '45L at Shell Station - $67.50',
    timestamp: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '3',
    type: 'geofence' as TimelineEventType,
    title: 'Geofence Entry',
    description: 'Arrived at Warehouse A',
    timestamp: new Date(Date.now() - 4 * 3600000),
  },
];

const fuelHistoryData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Fuel Consumption (L)',
      data: [120, 145, 130, 125],
      color: '#5D87FF',
    },
  ],
};

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const theme = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // In real app, fetch vehicle data based on resolvedParams.id
  const vehicle = mockVehicle;

  const serviceRemaining = vehicle.nextServiceOdometer - vehicle.odometer;
  const serviceProgress = ((vehicle.odometer % 5000) / 5000) * 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackOutlined />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" fontWeight={700}>
              {vehicle.name}
            </Typography>
            <StatusBadge status={vehicle.status} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {vehicle.licensePlate} • {vehicle.specs.make} {vehicle.specs.model} {vehicle.specs.year}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<EditOutlined />}>
          Edit
        </Button>
        <Button variant="outlined" color="error" startIcon={<DeleteOutlined />}>
          Delete
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ProgressRing
                value={vehicle.fuelLevel}
                size={80}
                thickness={6}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Fuel Level
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {vehicle.fuelLevel}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                <SpeedOutlined sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Current Speed
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {vehicle.currentSpeed} km/h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                <TrendingUpOutlined sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Odometer
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {vehicle.odometer.toLocaleString()} km
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: 'warning.main',
                  mx: 'auto',
                  mb: 1,
                }}
              >
                <BuildOutlined sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Next Service
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {serviceRemaining.toLocaleString()} km
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <CardContent>
          <TabNav tabs={tabs} value={activeTab} onChange={setActiveTab} />

          {/* Overview Tab */}
          <TabPanel value="overview" activeValue={activeTab}>
            <Grid container spacing={3}>
              {/* Vehicle Image & Info */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined">
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalShippingOutlined sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5 }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Vehicle Specifications
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {[
                        { label: 'Make', value: vehicle.specs.make },
                        { label: 'Model', value: vehicle.specs.model },
                        { label: 'Year', value: vehicle.specs.year },
                        { label: 'VIN', value: vehicle.specs.vin },
                        { label: 'Fuel Type', value: vehicle.specs.fuelType },
                        { label: 'Tank Capacity', value: `${vehicle.specs.tankCapacity}L` },
                      ].map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Map & Location */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Current Location
                    </Typography>
                    <Box
                      sx={{
                        height: 250,
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Map view will display here
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlaceOutlined color="primary" />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {vehicle.location.address}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Recent Activity
                    </Typography>
                    <Timeline events={recentActivity} compact />
                  </CardContent>
                </Card>
              </Grid>

              {/* Driver Info */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Assigned Driver
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ width: 56, height: 56 }}>
                        {vehicle.driver.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {vehicle.driver.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.driver.phone}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Service Progress
                    </Typography>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Until next service
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {serviceRemaining.toLocaleString()} km
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={serviceProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: serviceProgress > 80 ? 'warning.main' : 'success.main',
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Fuel Tab */}
          <TabPanel value="fuel" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <LineChart
                  title="Fuel Consumption History"
                  subtitle="Last 4 weeks"
                  labels={fuelHistoryData.labels}
                  datasets={fuelHistoryData.datasets}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Trips Tab */}
          <TabPanel value="trips" activeValue={activeTab}>
            <Typography variant="body1" color="text.secondary">
              Trip history will be displayed here.
            </Typography>
          </TabPanel>

          {/* Maintenance Tab */}
          <TabPanel value="maintenance" activeValue={activeTab}>
            <Typography variant="body1" color="text.secondary">
              Maintenance records will be displayed here.
            </Typography>
          </TabPanel>

          {/* Documents Tab */}
          <TabPanel value="documents" activeValue={activeTab}>
            <Typography variant="body1" color="text.secondary">
              Vehicle documents will be displayed here.
            </Typography>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
