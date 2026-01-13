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

import { StatCard } from '@/components/common/stat-card';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';

const MaintenancePage = () => {
  const t = useTranslations('common');

  const maintenanceRecords = [
    {
      id: '1',
      vehicle: 'Truck A-101',
      type: 'Oil Change',
      date: '2026-01-10',
      odometer: 45000,
      nextService: 50000,
      cost: 150,
      status: 'completed',
    },
    {
      id: '2',
      vehicle: 'Truck B-202',
      type: 'Tire Rotation',
      date: '2026-01-08',
      odometer: 38000,
      nextService: 44000,
      cost: 80,
      status: 'completed',
    },
    {
      id: '3',
      vehicle: 'Truck C-303',
      type: 'Brake Service',
      date: '2026-01-15',
      odometer: 52000,
      nextService: 62000,
      cost: 350,
      status: 'scheduled',
    },
  ];

  const upcomingServices = [
    {
      vehicle: 'Truck A-101',
      service: 'Tire Rotation',
      dueAt: 46000,
      currentOdometer: 45000,
      daysRemaining: 5,
    },
    {
      vehicle: 'Truck B-202',
      service: 'Oil Change',
      dueAt: 40000,
      currentOdometer: 38000,
      daysRemaining: 12,
    },
  ];

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('maintenance')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track maintenance schedules and service history
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Services This Month"
            value="8"
            icon={<BuildIcon />}
            iconColor="primary"
            trend={{ value: 12, label: 'vs last month', isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Upcoming Services"
            value="5"
            icon={<CalendarTodayIcon />}
            iconColor="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Overdue Services"
            value="2"
            icon={<WarningIcon />}
            iconColor="error"
            trend={{ value: -1, label: 'vs last week', isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Upcoming Services */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Upcoming Services
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell align="right">Current ODO</TableCell>
                      <TableCell align="right">Due At</TableCell>
                      <TableCell align="right">Remaining</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingServices.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>{service.vehicle}</TableCell>
                        <TableCell>{service.service}</TableCell>
                        <TableCell align="right">{service.currentOdometer} km</TableCell>
                        <TableCell align="right">{service.dueAt} km</TableCell>
                        <TableCell align="right">
                          {service.dueAt - service.currentOdometer} km
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${service.daysRemaining} days`}
                            color={service.daysRemaining < 7 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Maintenance History */}
      <Grid container spacing={3}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Maintenance History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Odometer</TableCell>
                      <TableCell align="right">Next Service</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {maintenanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.vehicle}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell align="right">{record.odometer} km</TableCell>
                        <TableCell align="right">{record.nextService} km</TableCell>
                        <TableCell align="right">${record.cost}</TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            color={record.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
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

export default MaintenancePage;
