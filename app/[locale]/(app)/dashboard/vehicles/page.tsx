import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { MapContainer } from '@/components/maps/map-container';

const VehiclesPage = () => {
  const t = useTranslations('common');

  // Mock vehicle data
  const vehicles = [
    {
      id: '1',
      name: 'Truck A-101',
      licensePlate: 'ARM-123-AB',
      status: 'active',
      speed: 65,
      fuelLevel: 78,
      location: { lat: 40.1872, lng: 44.5152 },
    },
    {
      id: '2',
      name: 'Truck B-202',
      licensePlate: 'ARM-456-CD',
      status: 'idle',
      speed: 0,
      fuelLevel: 45,
      location: { lat: 40.1972, lng: 44.5252 },
    },
    {
      id: '3',
      name: 'Truck C-303',
      licensePlate: 'ARM-789-EF',
      status: 'active',
      speed: 52,
      fuelLevel: 90,
      location: { lat: 40.1772, lng: 44.5352 },
    },
  ];

  const markers = vehicles.map((vehicle) => ({
    id: vehicle.id,
    position: vehicle.location,
    title: vehicle.name,
    info: vehicle,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'idle':
        return 'warning';
      case 'maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('vehicles')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your fleet in real-time
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Map */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Live Vehicle Tracking
              </Typography>
              <Box sx={{ mt: 2 }}>
                <MapContainer
                  center={{ lat: 40.1872, lng: 44.5152 }}
                  zoom={13}
                  markers={markers}
                  height={500}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle List */}
        {vehicles.map((vehicle) => (
          <Grid key={vehicle.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {vehicle.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.licensePlate}
                    </Typography>
                  </Box>
                  <Chip
                    label={vehicle.status}
                    color={getStatusColor(vehicle.status) as any}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Speed
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.speed} km/h
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Fuel Level
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.fuelLevel}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default VehiclesPage;
