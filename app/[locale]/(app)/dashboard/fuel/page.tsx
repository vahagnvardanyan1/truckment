import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

import { LineChart } from '@/components/charts/line-chart';
import { StatCard } from '@/components/common/stat-card';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const FuelPage = () => {
  const t = useTranslations('common');

  const fuelEvents = [
    {
      id: '1',
      vehicle: 'Truck A-101',
      type: 'fill',
      liters: 120,
      cost: 180,
      timestamp: '2026-01-13 08:30',
      location: 'Station A',
    },
    {
      id: '2',
      vehicle: 'Truck B-202',
      type: 'fill',
      liters: 95,
      cost: 142.5,
      timestamp: '2026-01-13 07:15',
      location: 'Station B',
    },
    {
      id: '3',
      vehicle: 'Truck C-303',
      type: 'drain',
      liters: 15,
      cost: 0,
      timestamp: '2026-01-12 22:45',
      location: 'Depot',
    },
  ];

  const fuelChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Fuel Consumed (L)',
        data: [450, 520, 480, 510, 490, 380, 420],
      },
    ],
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('fuel')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor fuel consumption and manage refueling events
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Fuel Consumed"
            value="2,850 L"
            icon={<LocalGasStationIcon />}
            iconColor="primary"
            trend={{ value: 5, label: 'vs last week', isPositive: false }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Avg. Consumption"
            value="8.5 L/100km"
            icon={<TrendingUpIcon />}
            iconColor="success"
            trend={{ value: -3, label: 'improvement', isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Fuel Cost"
            value="$4,275"
            icon={<AttachMoneyIcon />}
            iconColor="warning"
            trend={{ value: 8, label: 'vs last month', isPositive: false }}
          />
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={12}>
          <LineChart
            title="Weekly Fuel Consumption"
            subtitle="Liters consumed per day"
            labels={fuelChartData.labels}
            datasets={fuelChartData.datasets}
          />
        </Grid>
      </Grid>

      {/* Events Table */}
      <Grid container spacing={3}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Fuel Events
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Liters</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fuelEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.vehicle}</TableCell>
                        <TableCell>
                          <Chip
                            label={event.type}
                            color={event.type === 'fill' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{event.liters} L</TableCell>
                        <TableCell align="right">
                          {event.cost > 0 ? `$${event.cost}` : '-'}
                        </TableCell>
                        <TableCell>{event.timestamp}</TableCell>
                        <TableCell>{event.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default FuelPage;
