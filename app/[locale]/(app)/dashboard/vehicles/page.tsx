'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Avatar,
  LinearProgress,
  Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  AddOutlined,
  SearchOutlined,
  FilterListOutlined,
  GridViewOutlined,
  ViewListOutlined,
  MapOutlined,
  MoreVertOutlined,
  LocalGasStationOutlined,
  SpeedOutlined,
  PlaceOutlined,
  EditOutlined,
  DeleteOutlined,
  VisibilityOutlined,
  LocalShippingOutlined,
  RefreshOutlined,
} from '@mui/icons-material';
import { Link, useRouter } from '@/i18n/routing';
import NextLink from 'next/link';
import { StatusBadge, StatusType } from '@/components/common/status-badge';
import { ProgressRing } from '@/components/common/progress-ring';
import { MapContainer } from '@/components/maps/map-container';
import { EmptyState } from '@/components/common/empty-state';

type ViewMode = 'grid' | 'list' | 'map';

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  type: 'truck' | 'van' | 'car';
  status: StatusType;
  speed: number;
  fuelLevel: number;
  odometer: number;
  location: { lat: number; lng: number; address?: string };
  driver?: string;
  lastUpdate: Date;
}

// Mock vehicle data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Truck ABC-123',
    licensePlate: 'ARM-123-AB',
    type: 'truck',
    status: 'online',
    speed: 65,
    fuelLevel: 78,
    odometer: 45230,
    location: { lat: 40.1872, lng: 44.5152, address: 'Yerevan, Armenia' },
    driver: 'John Doe',
    lastUpdate: new Date(Date.now() - 2 * 60000),
  },
  {
    id: '2',
    name: 'Van XYZ-789',
    licensePlate: 'ARM-456-CD',
    type: 'van',
    status: 'idle',
    speed: 0,
    fuelLevel: 45,
    odometer: 32100,
    location: { lat: 40.1972, lng: 44.5252, address: 'Abovyan St, Yerevan' },
    driver: 'Jane Smith',
    lastUpdate: new Date(Date.now() - 15 * 60000),
  },
  {
    id: '3',
    name: 'Truck DEF-456',
    licensePlate: 'ARM-789-EF',
    type: 'truck',
    status: 'moving',
    speed: 72,
    fuelLevel: 90,
    odometer: 28500,
    location: { lat: 40.1772, lng: 44.5352, address: 'Mashtots Ave, Yerevan' },
    driver: 'Bob Johnson',
    lastUpdate: new Date(Date.now() - 1 * 60000),
  },
  {
    id: '4',
    name: 'Van GHI-012',
    licensePlate: 'ARM-012-GH',
    type: 'van',
    status: 'maintenance',
    speed: 0,
    fuelLevel: 60,
    odometer: 55000,
    location: { lat: 40.1672, lng: 44.5052, address: 'Service Center' },
    lastUpdate: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '5',
    name: 'Truck JKL-345',
    licensePlate: 'ARM-345-JK',
    type: 'truck',
    status: 'offline',
    speed: 0,
    fuelLevel: 25,
    odometer: 67800,
    location: { lat: 40.2072, lng: 44.4952, address: 'Warehouse A' },
    lastUpdate: new Date(Date.now() - 24 * 3600000),
  },
];

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode: ViewMode;
}

function VehicleCard({ vehicle, viewMode }: VehicleCardProps) {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const timeSinceUpdate = useMemo(() => {
    const diffMs = Date.now() - vehicle.lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffMs / 86400000)}d ago`;
  }, [vehicle.lastUpdate]);

  if (viewMode === 'list') {
    return (
      <Card sx={{ mb: 1 }}>
        <CardActionArea component={NextLink} href={`/dashboard/vehicles/${vehicle.id}`}>
          <CardContent sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                <LocalShippingOutlined />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>
                    {vehicle.name}
                  </Typography>
                  <StatusBadge status={vehicle.status} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {vehicle.licensePlate} • {vehicle.driver || 'Unassigned'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Speed
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {vehicle.speed} km/h
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Fuel
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {vehicle.fuelLevel}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Updated
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {timeSinceUpdate}
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertOutlined fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </CardActionArea>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem component={NextLink} href={`/dashboard/vehicles/${vehicle.id}`}>
            <ListItemIcon><VisibilityOutlined fontSize="small" /></ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><EditOutlined fontSize="small" /></ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><DeleteOutlined fontSize="small" color="error" /></ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        component={NextLink}
        href={`/dashboard/vehicles/${vehicle.id}`}
        sx={{ height: '100%' }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                <LocalShippingOutlined />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {vehicle.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {vehicle.licensePlate}
                </Typography>
              </Box>
            </Box>
            <StatusBadge status={vehicle.status} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SpeedOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600}>
                {vehicle.speed} km/h
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocalGasStationOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600}>
                {vehicle.fuelLevel}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Fuel Level
            </Typography>
            <LinearProgress
              variant="determinate"
              value={vehicle.fuelLevel}
              sx={{
                height: 6,
                borderRadius: 3,
                mt: 0.5,
                bgcolor: alpha(
                  vehicle.fuelLevel > 30 ? theme.palette.success.main : theme.palette.error.main,
                  0.1
                ),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: vehicle.fuelLevel > 30 ? 'success.main' : 'error.main',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlaceOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {vehicle.location.address || `${vehicle.location.lat.toFixed(4)}, ${vehicle.location.lng.toFixed(4)}`}
            </Typography>
          </Box>

          {vehicle.driver && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                Driver: {vehicle.driver}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function VehiclesPage() {
  const t = useTranslations('common');
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');

  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vehicle.driver?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const markers = filteredVehicles.map((vehicle) => ({
    id: vehicle.id,
    position: vehicle.location,
    title: vehicle.name,
    info: vehicle,
  }));

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockVehicles.length };
    mockVehicles.forEach((v) => {
      counts[v.status] = (counts[v.status] || 0) + 1;
    });
    return counts;
  }, []);

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode) setViewMode(newMode);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('vehicles')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredVehicles.length} vehicles • {statusCounts['online'] || 0} online
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<AddOutlined />}>
            Add Vehicle
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search vehicles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListOutlined />}
          onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
        >
          {statusFilter === 'all' ? 'All Status' : statusFilter}
        </Button>
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
        >
          {['all', 'online', 'moving', 'idle', 'maintenance', 'offline'].map((status) => (
            <MenuItem
              key={status}
              selected={statusFilter === status}
              onClick={() => {
                setStatusFilter(status as StatusType | 'all');
                setFilterMenuAnchor(null);
              }}
            >
              {status === 'all' ? `All (${statusCounts.all})` : `${status} (${statusCounts[status] || 0})`}
            </MenuItem>
          ))}
        </Menu>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Refresh">
          <IconButton>
            <RefreshOutlined />
          </IconButton>
        </Tooltip>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="grid">
            <Tooltip title="Grid view">
              <GridViewOutlined />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="list">
            <Tooltip title="List view">
              <ViewListOutlined />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="map">
            <Tooltip title="Map view">
              <MapOutlined />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Map (always visible in map mode, collapsible otherwise) */}
      {viewMode === 'map' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <MapContainer
              center={{ lat: 40.1872, lng: 44.5152 }}
              zoom={13}
              markers={markers}
              height={500}
            />
          </CardContent>
        </Card>
      )}

      {/* Vehicle Grid/List */}
      {viewMode !== 'map' && (
        <>
          {filteredVehicles.length === 0 ? (
            <EmptyState
              variant={searchQuery ? 'search' : 'vehicles'}
              action={
                searchQuery
                  ? { label: 'Clear search', onClick: () => setSearchQuery('') }
                  : { label: 'Add Vehicle', onClick: () => {} }
              }
            />
          ) : viewMode === 'list' ? (
            <Box>
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode="list" />
              ))}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredVehicles.map((vehicle) => (
                <Grid key={vehicle.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                  <VehicleCard vehicle={vehicle} viewMode="grid" />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
