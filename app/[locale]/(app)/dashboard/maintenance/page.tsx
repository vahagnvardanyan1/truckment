'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  LinearProgress,
  Divider,
  Badge,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  AddOutlined,
  FileDownloadOutlined,
  PictureAsPdfOutlined,
  TableChartOutlined,
  BuildOutlined,
  CalendarTodayOutlined,
  WarningAmberOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  LocalShippingOutlined,
  AttachMoneyOutlined,
  AttachFileOutlined,
  NotificationsOutlined,
  StorefrontOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  EventOutlined,
} from '@mui/icons-material';
import { MetricCard } from '@/components/data/metric-card';
import { DataTable, Column } from '@/components/data/data-table';
import { TabNav, TabPanel } from '@/components/navigation/tab-nav';
import { Timeline, TimelineEvent } from '@/components/data/timeline';
import { SearchInput } from '@/components/forms/search-input';
import { DonutChart } from '@/components/charts/donut-chart';
import { StatusBadge, StatusType } from '@/components/common/status-badge';

// Mock data
const maintenanceRecords = [
  {
    id: '1',
    vehicle: 'Truck ABC-123',
    vehicleId: 'v1',
    type: 'Oil Change',
    category: 'routine',
    date: '2026-01-20',
    odometer: 45230,
    nextService: 50230,
    partsCost: 85,
    laborCost: 65,
    totalCost: 150,
    technician: 'Mike\'s Auto',
    status: 'completed' as const,
    notes: 'Used synthetic oil as recommended',
    documents: 2,
  },
  {
    id: '2',
    vehicle: 'Van XYZ-789',
    vehicleId: 'v2',
    type: 'Tire Rotation',
    category: 'routine',
    date: '2026-01-18',
    odometer: 32100,
    nextService: 38100,
    partsCost: 0,
    laborCost: 45,
    totalCost: 45,
    technician: 'Quick Tire Center',
    status: 'completed' as const,
    notes: 'Front tires showing moderate wear',
    documents: 1,
  },
  {
    id: '3',
    vehicle: 'Truck DEF-456',
    vehicleId: 'v3',
    type: 'Brake Service',
    category: 'repair',
    date: '2026-01-25',
    odometer: 67800,
    nextService: 87800,
    partsCost: 280,
    laborCost: 120,
    totalCost: 400,
    technician: 'Fleet Pro Services',
    status: 'scheduled' as const,
    notes: 'Replace front brake pads and rotors',
    documents: 0,
  },
  {
    id: '4',
    vehicle: 'Van GHI-012',
    vehicleId: 'v4',
    type: 'Engine Diagnostics',
    category: 'inspection',
    date: '2026-01-15',
    odometer: 28500,
    nextService: 33500,
    partsCost: 0,
    laborCost: 75,
    totalCost: 75,
    technician: 'Fleet Pro Services',
    status: 'completed' as const,
    notes: 'Check engine light investigation - O2 sensor replaced',
    documents: 3,
  },
  {
    id: '5',
    vehicle: 'Truck ABC-123',
    vehicleId: 'v1',
    type: 'AC Service',
    category: 'repair',
    date: '2026-01-28',
    odometer: 45500,
    nextService: 55500,
    partsCost: 120,
    laborCost: 80,
    totalCost: 200,
    technician: 'Cool Air Auto',
    status: 'scheduled' as const,
    notes: 'Recharge AC and check for leaks',
    documents: 0,
  },
];

const upcomingServices = [
  {
    id: 'u1',
    vehicle: 'Truck ABC-123',
    service: 'Tire Rotation',
    dueAt: 46000,
    currentOdometer: 45500,
    dueDate: '2026-01-28',
    priority: 'normal' as StatusType,
  },
  {
    id: 'u2',
    vehicle: 'Van XYZ-789',
    service: 'Oil Change',
    dueAt: 33000,
    currentOdometer: 32800,
    dueDate: '2026-01-30',
    priority: 'warning' as StatusType,
  },
  {
    id: 'u3',
    vehicle: 'Truck DEF-456',
    service: 'Transmission Fluid',
    dueAt: 70000,
    currentOdometer: 69500,
    dueDate: '2026-02-05',
    priority: 'warning' as StatusType,
  },
  {
    id: 'u4',
    vehicle: 'Van GHI-012',
    service: 'Air Filter',
    dueAt: 30000,
    currentOdometer: 28500,
    dueDate: '2026-02-15',
    priority: 'success' as StatusType,
  },
];

const overdueServices = [
  {
    id: 'o1',
    vehicle: 'Truck DEF-456',
    service: 'Oil Change',
    dueAt: 65000,
    currentOdometer: 67800,
    overdue: 2800,
    priority: 'error' as StatusType,
  },
  {
    id: 'o2',
    vehicle: 'Van GHI-012',
    service: 'Brake Inspection',
    dueAt: 25000,
    currentOdometer: 28500,
    overdue: 3500,
    priority: 'error' as StatusType,
  },
];

const costByCategoryData = [
  { label: 'Routine', value: 450, color: '#5D87FF' },
  { label: 'Repairs', value: 680, color: '#FA896B' },
  { label: 'Inspections', value: 150, color: '#13DEB9' },
  { label: 'Parts', value: 485, color: '#FFAE1F' },
];

const vendors = [
  { id: 'v1', name: 'Fleet Pro Services', contact: '555-0101', specialty: 'Full Service' },
  { id: 'v2', name: 'Mike\'s Auto', contact: '555-0102', specialty: 'Oil & Lube' },
  { id: 'v3', name: 'Quick Tire Center', contact: '555-0103', specialty: 'Tires' },
  { id: 'v4', name: 'Cool Air Auto', contact: '555-0104', specialty: 'AC & Heating' },
];

const serviceHistory: TimelineEvent[] = [
  {
    id: '1',
    type: 'success',
    title: 'Oil Change Completed',
    description: 'Truck ABC-123 - Mike\'s Auto',
    timestamp: '2026-01-20 14:30',
  },
  {
    id: '2',
    type: 'success',
    title: 'Tire Rotation Completed',
    description: 'Van XYZ-789 - Quick Tire Center',
    timestamp: '2026-01-18 11:00',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Service Scheduled',
    description: 'Truck DEF-456 - Brake Service on Jan 25',
    timestamp: '2026-01-17 09:15',
  },
  {
    id: '4',
    type: 'success',
    title: 'Engine Diagnostics Completed',
    description: 'Van GHI-012 - O2 Sensor replaced',
    timestamp: '2026-01-15 16:45',
  },
  {
    id: '5',
    type: 'error',
    title: 'Overdue Alert',
    description: 'Truck DEF-456 - Oil change overdue by 2,800 km',
    timestamp: '2026-01-14 08:00',
  },
];

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'history', label: 'Service History' },
  { id: 'costs', label: 'Cost Analysis' },
  { id: 'vendors', label: 'Vendors' },
];

const vehicleOptions = [
  { id: 'v1', name: 'Truck ABC-123' },
  { id: 'v2', name: 'Van XYZ-789' },
  { id: 'v3', name: 'Truck DEF-456' },
  { id: 'v4', name: 'Van GHI-012' },
];

const serviceTypes = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Engine Diagnostics',
  'AC Service',
  'Transmission Service',
  'Air Filter',
  'Battery Replacement',
  'General Inspection',
  'Other',
];

// Generate calendar days
function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const days = [];

  // Previous month days
  for (let i = 0; i < startingDay; i++) {
    const prevMonthDay = new Date(year, month, -startingDay + i + 1);
    days.push({ date: prevMonthDay, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }

  // Next month days to complete the grid
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
}

export default function MaintenancePage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [newRecord, setNewRecord] = useState({
    vehicleId: '',
    type: '',
    scheduledDate: '',
    odometer: '',
    partsCost: '',
    laborCost: '',
    technician: '',
    notes: '',
  });

  const calendarDays = useMemo(() => {
    return generateCalendarDays(calendarDate.getFullYear(), calendarDate.getMonth());
  }, [calendarDate]);

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return maintenanceRecords.filter((r) => r.date === dateStr);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    handleExportClose();
  };

  const handleAddRecord = () => {
    console.log('Adding maintenance record:', newRecord);
    setAddDialogOpen(false);
    setNewRecord({
      vehicleId: '',
      type: '',
      scheduledDate: '',
      odometer: '',
      partsCost: '',
      laborCost: '',
      technician: '',
      notes: '',
    });
  };

  const filteredRecords = useMemo(() => {
    return maintenanceRecords.filter((record) =>
      record.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const columns: Column<typeof maintenanceRecords[0]>[] = [
    {
      id: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <LocalShippingOutlined sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {row.vehicle}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'type',
      label: 'Service Type',
      sortable: true,
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.type}
          </Typography>
          <Chip
            label={row.category}
            size="small"
            sx={{ mt: 0.5, textTransform: 'capitalize' }}
          />
        </Box>
      ),
    },
    {
      id: 'date',
      label: 'Date',
      sortable: true,
    },
    {
      id: 'odometer',
      label: 'Odometer',
      sortable: true,
      align: 'right',
      render: (row) => `${row.odometer.toLocaleString()} km`,
    },
    {
      id: 'totalCost',
      label: 'Cost',
      sortable: true,
      align: 'right',
      render: (row) => (
        <Tooltip title={`Parts: $${row.partsCost} | Labor: $${row.laborCost}`}>
          <Typography variant="body2" fontWeight={600}>
            ${row.totalCost}
          </Typography>
        </Tooltip>
      ),
    },
    {
      id: 'technician',
      label: 'Vendor',
      render: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
          {row.technician}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.status}
          color={row.status === 'completed' ? 'success' : 'warning'}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      id: 'documents',
      label: 'Docs',
      align: 'center',
      render: (row) => (
        <Badge badgeContent={row.documents} color="primary">
          <AttachFileOutlined sx={{ color: row.documents > 0 ? 'primary.main' : 'text.disabled' }} />
        </Badge>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Maintenance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track service schedules, costs, and maintenance history
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            onClick={handleExportClick}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => setAddDialogOpen(true)}
          >
            Schedule Service
          </Button>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={() => handleExport('pdf')}>
              <ListItemIcon>
                <PictureAsPdfOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export as PDF</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleExport('csv')}>
              <ListItemIcon>
                <TableChartOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export as CSV</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Services This Month"
            value="12"
            icon={<BuildOutlined />}
            iconColor="primary"
            trend={{ value: 15, label: 'vs last month' }}
            sparkline={{ values: [8, 10, 9, 11, 10, 12], color: theme.palette.primary.main }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Scheduled"
            value="5"
            icon={<CalendarTodayOutlined />}
            iconColor="info"
            subtitle="Upcoming services"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Overdue"
            value="2"
            icon={<WarningAmberOutlined />}
            iconColor="error"
            subtitle="Requires immediate attention"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Cost"
            value="$1,765"
            icon={<AttachMoneyOutlined />}
            iconColor="warning"
            trend={{ value: -8, label: 'vs last month' }}
            sparkline={{ values: [2100, 1950, 1800, 1850, 1780, 1765], color: theme.palette.warning.main }}
          />
        </Grid>
      </Grid>

      {/* Tab Content */}
      <Card>
        <CardContent>
          <TabNav tabs={tabs} value={activeTab} onChange={setActiveTab} />

          {/* Overview Tab */}
          <TabPanel value="overview" activeValue={activeTab}>
            <Grid container spacing={3}>
              {/* Overdue Services Alert */}
              {overdueServices.length > 0 && (
                <Grid size={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.04),
                      borderColor: alpha(theme.palette.error.main, 0.3),
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <WarningAmberOutlined color="error" />
                        <Typography variant="h6" fontWeight={600} color="error">
                          Overdue Services ({overdueServices.length})
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {overdueServices.map((service) => (
                          <Grid key={service.id} size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={{
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                border: 1,
                                borderColor: 'divider',
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    {service.vehicle}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {service.service}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`${service.overdue.toLocaleString()} km overdue`}
                                  color="error"
                                  size="small"
                                />
                              </Box>
                              <Button size="small" sx={{ mt: 1 }}>
                                Schedule Now
                              </Button>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Upcoming Services */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Upcoming Services
                      </Typography>
                      <Chip label={upcomingServices.length} size="small" color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {upcomingServices.map((service) => (
                        <Box
                          key={service.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.background.default, 0.5),
                            border: 1,
                            borderColor: 'divider',
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {service.vehicle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {service.service} - Due {service.dueDate}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {service.dueAt - service.currentOdometer} km remaining
                            </Typography>
                          </Box>
                          <StatusBadge status={service.priority} size="small" />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Recent Activity
                    </Typography>
                    <Timeline events={serviceHistory.slice(0, 4)} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Calendar Tab */}
          <TabPanel value="calendar" activeValue={activeTab}>
            <Card variant="outlined">
              <CardContent>
                {/* Calendar Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </Typography>
                  <Box>
                    <IconButton onClick={handlePrevMonth}>
                      <ChevronLeftOutlined />
                    </IconButton>
                    <IconButton onClick={handleNextMonth}>
                      <ChevronRightOutlined />
                    </IconButton>
                  </Box>
                </Box>

                {/* Calendar Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 1,
                  }}
                >
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Box
                      key={day}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'text.secondary',
                      }}
                    >
                      {day}
                    </Box>
                  ))}

                  {/* Calendar Days */}
                  {calendarDays.map((day, index) => {
                    const events = getEventsForDate(day.date);
                    const isToday = day.date.toDateString() === new Date().toDateString();

                    return (
                      <Box
                        key={index}
                        sx={{
                          minHeight: 80,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: day.isCurrentMonth ? 'background.paper' : alpha(theme.palette.action.disabled, 0.05),
                          border: 1,
                          borderColor: isToday ? 'primary.main' : 'divider',
                          opacity: day.isCurrentMonth ? 1 : 0.5,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={isToday ? 700 : 400}
                          color={isToday ? 'primary.main' : 'text.primary'}
                        >
                          {day.date.getDate()}
                        </Typography>
                        {events.map((event) => (
                          <Chip
                            key={event.id}
                            label={event.type}
                            size="small"
                            color={event.status === 'completed' ? 'success' : 'warning'}
                            sx={{
                              mt: 0.5,
                              fontSize: '0.625rem',
                              height: 20,
                              width: '100%',
                              '& .MuiChip-label': { px: 0.5 },
                            }}
                          />
                        ))}
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Service History Tab */}
          <TabPanel value="history" activeValue={activeTab}>
            <Box sx={{ mb: 2 }}>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by vehicle, service type, or vendor..."
              />
            </Box>
            <DataTable
              columns={columns}
              data={filteredRecords}
              defaultSortColumn="date"
              defaultSortDirection="desc"
              rowsPerPageOptions={[10, 25, 50]}
              onRowClick={(row) => console.log('Row clicked:', row)}
            />
          </TabPanel>

          {/* Cost Analysis Tab */}
          <TabPanel value="costs" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <DonutChart
                  title="Cost by Category"
                  subtitle="This month's breakdown"
                  data={costByCategoryData}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cost Details
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {costByCategoryData.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{item.label}</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ${item.value.toLocaleString()}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(item.value / 680) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: alpha(item.color, 0.2),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: item.color,
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Total
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        $1,765
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cost by Vehicle
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {[
                        { vehicle: 'Truck ABC-123', costs: { parts: 205, labor: 145 } },
                        { vehicle: 'Van XYZ-789', costs: { parts: 0, labor: 45 } },
                        { vehicle: 'Truck DEF-456', costs: { parts: 280, labor: 120 } },
                        { vehicle: 'Van GHI-012', costs: { parts: 0, labor: 75 } },
                      ].map((item) => (
                        <Box
                          key={item.vehicle}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1.5,
                            borderBottom: 1,
                            borderColor: 'divider',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                              }}
                            >
                              <LocalShippingOutlined sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {item.vehicle}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="text.secondary">
                                Parts
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                ${item.costs.parts}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="text.secondary">
                                Labor
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                ${item.costs.labor}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                              <Typography variant="caption" color="text.secondary">
                                Total
                              </Typography>
                              <Typography variant="body2" fontWeight={700} color="primary">
                                ${item.costs.parts + item.costs.labor}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Vendors Tab */}
          <TabPanel value="vendors" activeValue={activeTab}>
            <Grid container spacing={3}>
              {vendors.map((vendor) => (
                <Grid key={vendor.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <StorefrontOutlined />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {vendor.name}
                          </Typography>
                          <Chip label={vendor.specialty} size="small" variant="outlined" />
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Contact: {vendor.contact}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined" fullWidth>
                          View History
                        </Button>
                        <Button size="small" variant="contained" fullWidth>
                          Schedule
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add Maintenance Record Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Service</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Vehicle"
              value={newRecord.vehicleId}
              onChange={(e) => setNewRecord({ ...newRecord, vehicleId: e.target.value })}
              fullWidth
            >
              {vehicleOptions.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Service Type"
              value={newRecord.type}
              onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
              fullWidth
            >
              {serviceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Scheduled Date"
              type="date"
              value={newRecord.scheduledDate}
              onChange={(e) => setNewRecord({ ...newRecord, scheduledDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Current Odometer (km)"
              type="number"
              value={newRecord.odometer}
              onChange={(e) => setNewRecord({ ...newRecord, odometer: e.target.value })}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  label="Estimated Parts Cost ($)"
                  type="number"
                  value={newRecord.partsCost}
                  onChange={(e) => setNewRecord({ ...newRecord, partsCost: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Estimated Labor Cost ($)"
                  type="number"
                  value={newRecord.laborCost}
                  onChange={(e) => setNewRecord({ ...newRecord, laborCost: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              select
              label="Service Provider"
              value={newRecord.technician}
              onChange={(e) => setNewRecord({ ...newRecord, technician: e.target.value })}
              fullWidth
            >
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.name}>
                  {v.name} ({v.specialty})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              fullWidth
            />
            <Box
              sx={{
                border: 2,
                borderStyle: 'dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <AttachFileOutlined sx={{ fontSize: 32, color: 'text.secondary', mb: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Attach documents (optional)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddRecord}>
            Schedule Service
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
