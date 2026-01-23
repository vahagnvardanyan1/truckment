'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  FileDownloadOutlined,
  PictureAsPdfOutlined,
  TableChartOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  LocalShippingOutlined,
  LocalGasStationOutlined,
  BuildOutlined,
  AttachMoneyOutlined,
  DateRangeOutlined,
} from '@mui/icons-material';
import { MetricCard } from '@/components/data/metric-card';
import { TabNav, TabPanel } from '@/components/navigation/tab-nav';
import { DateRangePicker } from '@/components/forms/date-range-picker';
import { LineChart } from '@/components/charts/line-chart';
import { DonutChart } from '@/components/charts/donut-chart';

// Mock data for reports
const distanceByVehicleData = [
  { label: 'Truck ABC-123', value: 4520, color: '#5D87FF' },
  { label: 'Van XYZ-789', value: 3200, color: '#13DEB9' },
  { label: 'Truck DEF-456', value: 2800, color: '#FFAE1F' },
  { label: 'Van GHI-012', value: 1930, color: '#FA896B' },
];

const costBreakdownData = [
  { label: 'Fuel', value: 4320, color: '#5D87FF' },
  { label: 'Maintenance', value: 1850, color: '#7C4DFF' },
  { label: 'Insurance', value: 1200, color: '#13DEB9' },
  { label: 'Other', value: 630, color: '#FFAE1F' },
];

const monthlyDistanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'This Year',
      data: [8500, 9200, 10100, 9800, 11200, 12450],
      color: '#5D87FF',
    },
    {
      label: 'Last Year',
      data: [7800, 8100, 8900, 9100, 9500, 10200],
      color: '#B5B9C8',
    },
  ],
};

const fuelEfficiencyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'L/100km',
      data: [9.2, 8.8, 8.5, 8.7, 8.3, 8.5],
      color: '#13DEB9',
    },
  ],
};

const tabs = [
  { id: 'overview', label: 'Fleet Overview' },
  { id: 'fuel', label: 'Fuel Analysis' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'costs', label: 'Costs' },
];

export default function ReportsPage() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: new Date(Date.now() - 30 * 24 * 3600000),
    endDate: new Date(),
  });
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExport = (format: string) => {
    // TODO: Implement actual export functionality
    console.log(`Exporting as ${format}`);
    handleExportClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analytics and insights for your fleet operations
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            presets={['today', 'last7days', 'last30days', 'thisMonth', 'lastMonth']}
          />
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlined />}
            onClick={handleExportClick}
          >
            Export
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
            title="Total Distance"
            value="12,450 km"
            icon={<LocalShippingOutlined />}
            iconColor="primary"
            trend={{ value: 12, label: 'vs last period' }}
            sparkline={{ values: [8500, 9200, 10100, 9800, 11200, 12450], color: theme.palette.primary.main }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Fuel Cost"
            value="$4,320"
            icon={<LocalGasStationOutlined />}
            iconColor="success"
            trend={{ value: -5, label: 'vs last period' }}
            sparkline={{ values: [4800, 4600, 4500, 4400, 4350, 4320], color: theme.palette.success.main }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Maintenance Cost"
            value="$1,850"
            icon={<BuildOutlined />}
            iconColor="warning"
            trend={{ value: 8, label: 'vs last period' }}
            sparkline={{ values: [1200, 1400, 1550, 1600, 1700, 1850], color: theme.palette.warning.main }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Costs"
            value="$8,000"
            icon={<AttachMoneyOutlined />}
            iconColor="info"
            trend={{ value: 3, label: 'vs last period' }}
            sparkline={{ values: [7200, 7500, 7600, 7800, 7900, 8000], color: theme.palette.info.main }}
          />
        </Grid>
      </Grid>

      {/* Tab Navigation */}
      <Card>
        <CardContent>
          <TabNav tabs={tabs} value={activeTab} onChange={setActiveTab} />

          {/* Fleet Overview Tab */}
          <TabPanel value="overview" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Monthly Distance Traveled
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Comparison with last year
                    </Typography>
                    <Box sx={{ height: 350 }}>
                      <LineChart
                        title=""
                        labels={monthlyDistanceData.labels}
                        datasets={monthlyDistanceData.datasets}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <DonutChart
                  title="Distance by Vehicle"
                  subtitle="Total kilometers traveled"
                  data={distanceByVehicleData}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Fuel Analysis Tab */}
          <TabPanel value="fuel" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Fuel Efficiency Trend
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Average liters per 100km
                    </Typography>
                    <Box sx={{ height: 350 }}>
                      <LineChart
                        title=""
                        labels={fuelEfficiencyData.labels}
                        datasets={fuelEfficiencyData.datasets}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Fuel Stats
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Total Fuel Consumed
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          2,850 L
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Average Consumption
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          8.5 L/100km
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Cost per Kilometer
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          $0.35
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Maintenance Tab */}
          <TabPanel value="maintenance" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Maintenance Summary
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Completed Services</Typography>
                        <Typography variant="body1" fontWeight={600}>12</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Scheduled Services</Typography>
                        <Typography variant="body1" fontWeight={600}>5</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Overdue Services</Typography>
                        <Typography variant="body1" fontWeight={600} color="error">2</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Total Parts Cost</Typography>
                        <Typography variant="body1" fontWeight={600}>$1,250</Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Total Labor Cost</Typography>
                        <Typography variant="body1" fontWeight={600}>$600</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Service Types Breakdown
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      {[
                        { label: 'Oil Change', count: 5, cost: '$450' },
                        { label: 'Tire Rotation', count: 4, cost: '$320' },
                        { label: 'Brake Service', count: 2, cost: '$680' },
                        { label: 'General Inspection', count: 1, cost: '$400' },
                      ].map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            py: 1.5,
                            borderBottom: index < 3 ? 1 : 0,
                            borderColor: 'divider',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {item.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.count} services
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            {item.cost}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Costs Tab */}
          <TabPanel value="costs" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <DonutChart
                  title="Cost Breakdown"
                  subtitle="Distribution by category"
                  data={costBreakdownData}
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cost Details
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      {costBreakdownData.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                            borderBottom: index < costBreakdownData.length - 1 ? 1 : 0,
                            borderColor: 'divider',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: item.color,
                              }}
                            />
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                {item.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {((item.value / 8000) * 100).toFixed(1)}% of total
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="h6" fontWeight={700}>
                            ${item.value.toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
