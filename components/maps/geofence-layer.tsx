'use client';

import { ReactNode, useMemo } from 'react';
import { Box, Typography, Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  PlaceOutlined,
  CropFreeOutlined,
  RadioButtonUncheckedOutlined,
  SquareOutlined,
} from '@mui/icons-material';

export type GeofenceType = 'circle' | 'polygon' | 'rectangle';

export interface GeofenceData {
  id: string;
  name: string;
  type: GeofenceType;
  color?: string;
  // For circle
  center?: { lat: number; lng: number };
  radius?: number; // in meters
  // For polygon/rectangle
  coordinates?: Array<{ lat: number; lng: number }>;
  // Metadata
  description?: string;
  isActive?: boolean;
  alertOnEnter?: boolean;
  alertOnExit?: boolean;
  vehiclesInside?: number;
}

interface GeofenceLayerProps {
  geofences: GeofenceData[];
  selectedId?: string;
  onSelect?: (geofence: GeofenceData) => void;
  showLabels?: boolean;
  opacity?: number;
}

const typeIcons: Record<GeofenceType, ReactNode> = {
  circle: <RadioButtonUncheckedOutlined />,
  polygon: <CropFreeOutlined />,
  rectangle: <SquareOutlined />,
};

const defaultColors = [
  '#5D87FF',
  '#13DEB9',
  '#FFAE1F',
  '#FA896B',
  '#7C4DFF',
  '#49BEFF',
  '#FF6B9D',
  '#6B5AFF',
];

export function GeofenceLayer({
  geofences,
  selectedId,
  onSelect,
  showLabels = true,
  opacity = 0.3,
}: GeofenceLayerProps) {
  const theme = useTheme();

  // This is a visual representation for when a map isn't available
  // In a real implementation, this would render actual map polygons
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Geofences ({geofences.length})
      </Typography>
      <List disablePadding>
        {geofences.map((geofence, index) => {
          const color = geofence.color || defaultColors[index % defaultColors.length];
          const isSelected = selectedId === geofence.id;

          return (
            <ListItem
              key={geofence.id}
              onClick={() => onSelect?.(geofence)}
              sx={{
                mb: 1,
                borderRadius: 2,
                border: 1,
                borderColor: isSelected ? 'primary.main' : 'divider',
                backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                cursor: onSelect ? 'pointer' : 'default',
                '&:hover': onSelect
                  ? {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }
                  : undefined,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: alpha(color, 0.15),
                    color: color,
                  }}
                >
                  {typeIcons[geofence.type]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {geofence.name}
                    </Typography>
                    {!geofence.isActive && (
                      <Chip label="Inactive" size="small" color="default" />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {geofence.type === 'circle'
                        ? `Radius: ${geofence.radius?.toLocaleString()}m`
                        : `${geofence.coordinates?.length || 0} points`}
                    </Typography>
                    {geofence.vehiclesInside !== undefined && (
                      <Typography variant="caption" color="text.secondary">
                        Vehicles inside: {geofence.vehiclesInside}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {geofence.alertOnEnter && (
                        <Chip label="Entry alert" size="small" variant="outlined" color="success" />
                      )}
                      {geofence.alertOnExit && (
                        <Chip label="Exit alert" size="small" variant="outlined" color="warning" />
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

// Geofence shape rendering component (for future map integration)
interface GeofenceShapeProps {
  geofence: GeofenceData;
  opacity?: number;
  showLabel?: boolean;
}

export function GeofenceShape({ geofence, opacity = 0.3, showLabel = true }: GeofenceShapeProps) {
  const theme = useTheme();
  const color = geofence.color || defaultColors[0];

  // This is a placeholder SVG representation
  // In a real implementation with a map library, you would render actual map shapes
  if (geofence.type === 'circle') {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill={alpha(color, opacity)}
            stroke={color}
            strokeWidth="2"
          />
        </svg>
        {showLabel && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 600,
              color: color,
            }}
          >
            {geofence.name}
          </Typography>
        )}
      </Box>
    );
  }

  if (geofence.type === 'rectangle' && geofence.coordinates && geofence.coordinates.length >= 4) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <svg width="120" height="80" viewBox="0 0 120 80">
          <rect
            x="5"
            y="5"
            width="110"
            height="70"
            fill={alpha(color, opacity)}
            stroke={color}
            strokeWidth="2"
            rx="4"
          />
        </svg>
        {showLabel && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 600,
              color: color,
            }}
          >
            {geofence.name}
          </Typography>
        )}
      </Box>
    );
  }

  // Polygon
  if (geofence.coordinates && geofence.coordinates.length >= 3) {
    const points = geofence.coordinates
      .map((coord, index) => {
        const angle = (index * 360) / geofence.coordinates!.length;
        const x = 50 + 40 * Math.cos((angle * Math.PI) / 180);
        const y = 50 + 40 * Math.sin((angle * Math.PI) / 180);
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon
            points={points}
            fill={alpha(color, opacity)}
            stroke={color}
            strokeWidth="2"
          />
        </svg>
        {showLabel && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 600,
              color: color,
            }}
          >
            {geofence.name}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
}

// Preview component for geofences (for documentation/testing)
export function GeofencePreview() {
  const mockGeofences: GeofenceData[] = [
    {
      id: '1',
      name: 'Warehouse A',
      type: 'circle',
      color: '#5D87FF',
      center: { lat: 40.1872, lng: 44.5152 },
      radius: 500,
      isActive: true,
      alertOnEnter: true,
      alertOnExit: true,
      vehiclesInside: 3,
    },
    {
      id: '2',
      name: 'Delivery Zone',
      type: 'polygon',
      color: '#13DEB9',
      coordinates: [
        { lat: 40.19, lng: 44.51 },
        { lat: 40.19, lng: 44.53 },
        { lat: 40.17, lng: 44.53 },
        { lat: 40.17, lng: 44.51 },
      ],
      isActive: true,
      alertOnEnter: true,
      vehiclesInside: 1,
    },
    {
      id: '3',
      name: 'Restricted Area',
      type: 'rectangle',
      color: '#FA896B',
      coordinates: [
        { lat: 40.18, lng: 44.5 },
        { lat: 40.18, lng: 44.52 },
        { lat: 40.16, lng: 44.52 },
        { lat: 40.16, lng: 44.5 },
      ],
      isActive: false,
      alertOnEnter: true,
      alertOnExit: false,
      vehiclesInside: 0,
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Geofence Shapes
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        {mockGeofences.map((geofence) => (
          <GeofenceShape key={geofence.id} geofence={geofence} />
        ))}
      </Box>

      <Typography variant="h6" gutterBottom>
        Geofence List
      </Typography>
      <GeofenceLayer geofences={mockGeofences} />
    </Box>
  );
}
