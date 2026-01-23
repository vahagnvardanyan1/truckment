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
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  AddOutlined,
  FileDownloadOutlined,
  PictureAsPdfOutlined,
  TableChartOutlined,
  LocalGasStationOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  AttachMoneyOutlined,
  LocalShippingOutlined,
  WarningAmberOutlined,
  ReceiptOutlined,
  FilterListOutlined,
  RefreshOutlined,
} from '@mui/icons-material';
import { MetricCard } from '@/components/data/metric-card';
import { DataTable, Column } from '@/components/data/data-table';
import { TabNav, TabPanel } from '@/components/navigation/tab-nav';
import { DateRangePicker } from '@/components/forms/date-range-picker';
import { SearchInput } from '@/components/forms/search-input';
import { LineChart } from '@/components/charts/line-chart';
import { DonutChart } from '@/components/charts/donut-chart';
import { StatusBadge, StatusType } from '@/components/common/status-badge';

// Mock data
const fuelEvents = [
  {
    id: '1',
    vehicle: 'Truck ABC-123',
    vehicleId: 'v1',
    type: 'fill' as const,
    liters: 120,
    costPerLiter: 1.52,
    totalCost: 182.4,
    odometer: 45230,
    efficiency: 8.2,
    timestamp: '2026-01-23 08:30',
    location: 'Shell Station - Main St',
    driver: 'John Smith',
    receiptUploaded: true,
  },
  {
    id: '2',
    vehicle: 'Van XYZ-789',
    vehicleId: 'v2',
    type: 'fill' as const,
    liters: 65,
    costPerLiter: 1.48,
    totalCost: 96.2,
    odometer: 32100,
    efficiency: 9.5,
    timestamp: '2026-01-23 07:15',
    location: 'BP Gas Station',
    driver: 'Jane Doe',
    receiptUploaded: true,
  },
  {
    id: '3',
    vehicle: 'Truck DEF-456',
    vehicleId: 'v3',
    type: 'fill' as const,
    liters: 95,
    costPerLiter: 1.50,
    totalCost: 142.5,
    odometer: 67800,
    efficiency: 8.8,
    timestamp: '2026-01-22 16:45',
    location: 'Chevron - Highway 101',
    driver: 'Mike Johnson',
    receiptUploaded: false,
  },
  {
    id: '4',
    vehicle: 'Truck ABC-123',
    vehicleId: 'v1',
    type: 'drain' as const,
    liters: 15,
    costPerLiter: 0,
    totalCost: 0,
    odometer: 45000,
    efficiency: 0,
    timestamp: '2026-01-22 22:30',
    location: 'Depot',
    driver: 'System',
    receiptUploaded: false,
  },
  {
    id: '5',
    vehicle: 'Van GHI-012',
    vehicleId: 'v4',
    type: 'fill' as const,
    liters: 55,
    costPerLiter: 1.55,
    totalCost: 85.25,
    odometer: 28500,
    efficiency: 10.2,
    timestamp: '2026-01-21 09:00',
    location: 'ExxonMobil',
    driver: 'Sarah Wilson',
    receiptUploaded: true,
  },
];

const fuelAnomalies = [
  {
    id: 'a1',
    vehicle: 'Truck DEF-456',
    type: 'high_consumption',
    message: 'Fuel consumption 25% higher than average',
    timestamp: '2026-01-22',
    severity: 'warning' as StatusType,
  },
  {
    id: 'a2',
    vehicle: 'Van XYZ-789',
    type: 'unusual_fill',
    message: 'Fuel fill detected outside normal hours',
    timestamp: '2026-01-21',
    severity: 'info' as StatusType,
  },
];

const costByVehicleData = [
  { label: 'Truck ABC-123', value: 1820, color: '#5D87FF' },
  { label: 'Van XYZ-789', value: 1250, color: '#13DEB9' },
  { label: 'Truck DEF-456', value: 980, color: '#FFAE1F' },
  { label: 'Van GHI-012', value: 720, color: '#FA896B' },
];

const consumptionTrendData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Actual (L)',
      data: [850, 920, 780, 890],
      color: '#5D87FF',
    },
    {
      label: 'Expected (L)',
      data: [800, 800, 800, 800],
      color: '#B5B9C8',
    },
  ],
};

const efficiencyTrendData = {
  labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22'],
  datasets: [
    {
      label: 'Fleet Average (L/100km)',
      data: [9.2, 8.8, 8.5, 8.7],
      color: '#13DEB9',
    },
  ],
};

const tabs = [
  { id: 'events', label: 'Fuel Events' },
  { id: 'analysis', label: 'Cost Analysis' },
  { id: 'efficiency', label: 'Efficiency' },
  { id: 'anomalies', label: 'Anomalies' },
];

const vehicleOptions = [
  { id: 'v1', name: 'Truck ABC-123' },
  { id: 'v2', name: 'Van XYZ-789' },
  { id: 'v3', name: 'Truck DEF-456' },
  { id: 'v4', name: 'Van GHI-012' },
];

export default function FuelPage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('events');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: new Date(Date.now() - 30 * 24 * 3600000),
    endDate: new Date(),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [newEvent, setNewEvent] = useState({
    vehicleId: '',
    type: 'fill',
    liters: '',
    costPerLiter: '',
    odometer: '',
    location: '',
  });

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

  const handleAddEvent = () => {
    console.log('Adding fuel event:', newEvent);
    setAddDialogOpen(false);
    setNewEvent({
      vehicleId: '',
      type: 'fill',
      liters: '',
      costPerLiter: '',
      odometer: '',
      location: '',
    });
  };

  const filteredEvents = useMemo(() => {
    return fuelEvents.filter((event) =>
      event.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.driver.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const columns: Column<typeof fuelEvents[0]>[] = [
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
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.vehicle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.driver}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'type',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <Chip
          label={row.type === 'fill' ? 'Fill' : 'Drain'}
          color={row.type === 'fill' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'liters',
      label: 'Liters',
      sortable: true,
      align: 'right',
      render: (row) => `${row.liters} L`,
    },
    {
      id: 'totalCost',
      label: 'Cost',
      sortable: true,
      align: 'right',
      render: (row) => (row.totalCost > 0 ? `$${row.totalCost.toFixed(2)}` : '-'),
    },
    {
      id: 'efficiency',
      label: 'Efficiency',
      sortable: true,
      align: 'right',
      render: (row) => (
        row.efficiency > 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
            <Typography variant="body2">{row.efficiency} L/100km</Typography>
            {row.efficiency < 9 ? (
              <TrendingDownOutlined sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingUpOutlined sx={{ fontSize: 16, color: 'warning.main' }} />
            )}
          </Box>
        ) : '-'
      ),
    },
    {
      id: 'timestamp',
      label: 'Date',
      sortable: true,
    },
    {
      id: 'location',
      label: 'Location',
      render: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
          {row.location}
        </Typography>
      ),
    },
    {
      id: 'receiptUploaded',
      label: 'Receipt',
      align: 'center',
      render: (row) => (
        <Tooltip title={row.receiptUploaded ? 'Receipt uploaded' : 'No receipt'}>
          <ReceiptOutlined
            sx={{
              fontSize: 20,
              color: row.receiptUploaded ? 'success.main' : 'text.disabled',
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Fuel Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track fuel consumption, costs, and efficiency across your fleet
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            presets={['today', 'last7days', 'last30days', 'thisMonth']}
          />
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
            Add Event
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
            title="Total Fuel Consumed"
            value="2,850 L"
            icon={<LocalGasStationOutlined />}
            iconColor="primary"
            trend={{ value: 5, label: 'vs last period' }}
            sparkline={{ values: [2400, 2550, 2700, 2650, 2800, 2850], color: theme.palette.primary.main }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Avg. Efficiency"
            value="8.5 L/100km"
            icon={<TrendingDownOutlined />}
            iconColor="success"
            trend={{ value: -3, label: 'improvement' }}
            sparkline={{ values: [9.2, 9.0, 8.8, 8.6, 8.5, 8.5], color: theme.palette.success.main }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Fuel Cost"
            value="$4,320"
            icon={<AttachMoneyOutlined />}
            iconColor="warning"
            trend={{ value: 8, label: 'vs last period' }}
            sparkline={{ values: [3800, 3950, 4100, 4200, 4280, 4320], color: theme.palette.warning.main }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Anomalies Detected"
            value="2"
            icon={<WarningAmberOutlined />}
            iconColor="error"
            subtitle="Requires attention"
          />
        </Grid>
      </Grid>

      {/* Tab Content */}
      <Card>
        <CardContent>
          <TabNav tabs={tabs} value={activeTab} onChange={setActiveTab} />

          {/* Fuel Events Tab */}
          <TabPanel value="events" activeValue={activeTab}>
            <Box sx={{ mb: 2 }}>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by vehicle, location, or driver..."
              />
            </Box>
            <DataTable
              columns={columns}
              data={filteredEvents}
              defaultSortColumn="timestamp"
              defaultSortDirection="desc"
              rowsPerPageOptions={[10, 25, 50]}
              onRowClick={(row) => console.log('Row clicked:', row)}
            />
          </TabPanel>

          {/* Cost Analysis Tab */}
          <TabPanel value="analysis" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Fuel Consumption Trend
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Actual vs expected consumption
                    </Typography>
                    <Box sx={{ height: 350 }}>
                      <LineChart
                        title=""
                        labels={consumptionTrendData.labels}
                        datasets={consumptionTrendData.datasets}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <DonutChart
                  title="Cost by Vehicle"
                  subtitle="Total fuel expenses"
                  data={costByVehicleData}
                />
              </Grid>
              <Grid size={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cost Breakdown
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {costByVehicleData.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{item.label}</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ${item.value.toLocaleString()}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(item.value / 1820) * 100}
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
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Efficiency Tab */}
          <TabPanel value="efficiency" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Fleet Efficiency Trend
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Average liters per 100km over time
                    </Typography>
                    <Box sx={{ height: 350 }}>
                      <LineChart
                        title=""
                        labels={efficiencyTrendData.labels}
                        datasets={efficiencyTrendData.datasets}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Vehicle Efficiency Ranking
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {[
                        { vehicle: 'Van GHI-012', efficiency: 7.8, rank: 1 },
                        { vehicle: 'Truck ABC-123', efficiency: 8.2, rank: 2 },
                        { vehicle: 'Truck DEF-456', efficiency: 8.8, rank: 3 },
                        { vehicle: 'Van XYZ-789', efficiency: 9.5, rank: 4 },
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
                                width: 28,
                                height: 28,
                                bgcolor: item.rank <= 2 ? 'success.main' : 'warning.main',
                                fontSize: '0.75rem',
                              }}
                            >
                              {item.rank}
                            </Avatar>
                            <Typography variant="body2">{item.vehicle}</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            {item.efficiency} L/100km
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Anomalies Tab */}
          <TabPanel value="anomalies" activeValue={activeTab}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fuelAnomalies.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    No anomalies detected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All fuel consumption patterns appear normal
                  </Typography>
                </Box>
              ) : (
                fuelAnomalies.map((anomaly) => (
                  <Card key={anomaly.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(
                                anomaly.severity === 'warning'
                                  ? theme.palette.warning.main
                                  : theme.palette.info.main,
                                0.1
                              ),
                              color: anomaly.severity === 'warning'
                                ? theme.palette.warning.main
                                : theme.palette.info.main,
                            }}
                          >
                            <WarningAmberOutlined />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {anomaly.vehicle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {anomaly.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Detected on {anomaly.timestamp}
                            </Typography>
                          </Box>
                        </Box>
                        <StatusBadge status={anomaly.severity} size="small" />
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add Fuel Event Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Fuel Event</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Vehicle"
              value={newEvent.vehicleId}
              onChange={(e) => setNewEvent({ ...newEvent, vehicleId: e.target.value })}
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
              label="Event Type"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              fullWidth
            >
              <MenuItem value="fill">Fill</MenuItem>
              <MenuItem value="drain">Drain</MenuItem>
            </TextField>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  label="Liters"
                  type="number"
                  value={newEvent.liters}
                  onChange={(e) => setNewEvent({ ...newEvent, liters: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Cost per Liter ($)"
                  type="number"
                  value={newEvent.costPerLiter}
                  onChange={(e) => setNewEvent({ ...newEvent, costPerLiter: e.target.value })}
                  fullWidth
                  disabled={newEvent.type === 'drain'}
                />
              </Grid>
            </Grid>
            <TextField
              label="Odometer (km)"
              type="number"
              value={newEvent.odometer}
              onChange={(e) => setNewEvent({ ...newEvent, odometer: e.target.value })}
              fullWidth
            />
            <TextField
              label="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              fullWidth
            />
            <Box
              sx={{
                border: 2,
                borderStyle: 'dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <ReceiptOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Click to upload receipt (optional)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEvent}>
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
