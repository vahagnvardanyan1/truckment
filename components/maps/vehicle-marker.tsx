'use client';

import { ReactNode } from 'react';
import { Box, Typography, Tooltip, Avatar } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  LocalShippingOutlined,
  DirectionsCarOutlined,
} from '@mui/icons-material';
import { StatusType } from '@/components/common/status-badge';

export interface VehicleMarkerData {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'car' | 'bus';
  status: StatusType;
  position: {
    lat: number;
    lng: number;
  };
  heading?: number; // Direction in degrees
  speed?: number;
  driver?: string;
}

interface VehicleMarkerProps {
  vehicle: VehicleMarkerData;
  selected?: boolean;
  onClick?: (vehicle: VehicleMarkerData) => void;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const statusColors: Record<StatusType, string> = {
  online: '#13DEB9',
  offline: '#5A6A85',
  moving: '#5D87FF',
  idle: '#FFAE1F',
  alert: '#FA896B',
  maintenance: '#7C4DFF',
  success: '#13DEB9',
  warning: '#FFAE1F',
  error: '#FA896B',
  info: '#5D87FF',
  normal: '#5A6A85',
};

const vehicleIcons: Record<string, ReactNode> = {
  truck: <LocalShippingOutlined />,
  van: <LocalShippingOutlined />,
  car: <DirectionsCarOutlined />,
  bus: <DirectionsCarOutlined />,
};

const sizeConfig = {
  small: { marker: 32, icon: 16, pulse: 40 },
  medium: { marker: 40, icon: 20, pulse: 52 },
  large: { marker: 48, icon: 24, pulse: 64 },
};

export function VehicleMarker({
  vehicle,
  selected = false,
  onClick,
  showLabel = false,
  size = 'medium',
}: VehicleMarkerProps) {
  const theme = useTheme();
  const color = statusColors[vehicle.status] || statusColors.offline;
  const { marker: markerSize, icon: iconSize, pulse: pulseSize } = sizeConfig[size];

  const isMoving = vehicle.status === 'moving' || vehicle.status === 'online';

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {vehicle.name}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Status: {vehicle.status}
          </Typography>
          {vehicle.speed !== undefined && (
            <Typography variant="caption" sx={{ display: 'block' }}>
              Speed: {vehicle.speed} km/h
            </Typography>
          )}
          {vehicle.driver && (
            <Typography variant="caption" sx={{ display: 'block' }}>
              Driver: {vehicle.driver}
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <Box
        onClick={() => onClick?.(vehicle)}
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s',
          transform: selected ? 'scale(1.2)' : 'scale(1)',
          '&:hover': {
            transform: 'scale(1.15)',
          },
        }}
      >
        {/* Pulse animation for moving vehicles */}
        {isMoving && (
          <Box
            sx={{
              position: 'absolute',
              width: pulseSize,
              height: pulseSize,
              borderRadius: '50%',
              backgroundColor: alpha(color, 0.3),
              animation: 'vehiclePulse 2s ease-out infinite',
              '@keyframes vehiclePulse': {
                '0%': {
                  transform: 'scale(0.8)',
                  opacity: 1,
                },
                '100%': {
                  transform: 'scale(1.5)',
                  opacity: 0,
                },
              },
            }}
          />
        )}

        {/* Main marker */}
        <Box
          sx={{
            position: 'relative',
            width: markerSize,
            height: markerSize,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${alpha(color, 0.4)}`,
            border: selected ? `3px solid ${theme.palette.background.paper}` : 'none',
            transform: vehicle.heading ? `rotate(${vehicle.heading}deg)` : 'none',
            transition: 'all 0.3s ease',
            '& svg': {
              fontSize: iconSize,
              color: '#fff',
              transform: vehicle.heading ? `rotate(-${vehicle.heading}deg)` : 'none',
            },
          }}
        >
          {vehicleIcons[vehicle.type] || <LocalShippingOutlined />}
        </Box>

        {/* Direction indicator */}
        {vehicle.heading !== undefined && isMoving && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: `translateX(-50%) rotate(${vehicle.heading}deg)`,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: `10px solid ${color}`,
              transformOrigin: 'center bottom',
            }}
          />
        )}

        {/* Label */}
        {showLabel && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -24,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: theme.palette.background.paper,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              boxShadow: theme.shadows[2],
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="caption" fontWeight={500}>
              {vehicle.name}
            </Typography>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}

// Preview component for vehicle marker (for documentation/testing)
export function VehicleMarkerPreview() {
  const mockVehicles: VehicleMarkerData[] = [
    {
      id: '1',
      name: 'Truck ABC-123',
      type: 'truck',
      status: 'moving',
      position: { lat: 0, lng: 0 },
      heading: 45,
      speed: 65,
      driver: 'John Doe',
    },
    {
      id: '2',
      name: 'Van XYZ-789',
      type: 'van',
      status: 'idle',
      position: { lat: 0, lng: 0 },
      speed: 0,
    },
    {
      id: '3',
      name: 'Car DEF-456',
      type: 'car',
      status: 'offline',
      position: { lat: 0, lng: 0 },
    },
    {
      id: '4',
      name: 'Truck GHI-012',
      type: 'truck',
      status: 'alert',
      position: { lat: 0, lng: 0 },
      speed: 45,
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 4, flexWrap: 'wrap' }}>
      {mockVehicles.map((vehicle) => (
        <Box key={vehicle.id} sx={{ textAlign: 'center' }}>
          <VehicleMarker vehicle={vehicle} showLabel />
          <Typography variant="caption" sx={{ mt: 4, display: 'block' }}>
            {vehicle.status}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
