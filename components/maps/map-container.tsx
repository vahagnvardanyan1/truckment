'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

import { useMapStore } from '@/lib/stores/map-store';
import type { MapCoordinates, MapMarker } from '@/lib/map-providers/map-provider.interface';

interface MapContainerProps {
  center?: MapCoordinates;
  zoom?: number;
  markers?: MapMarker[];
  height?: number | string;
}

export const MapContainer = ({
  center = { lat: 40.1872, lng: 44.5152 }, // Yerevan, Armenia
  zoom = 12,
  markers = [],
  height = 500,
}: MapContainerProps) => {
  const theme = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const provider = useMapStore((state) => state.provider);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, show a placeholder until we implement the actual providers
        // In a real implementation, we would load the appropriate map provider here
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setLoading(false);
      } catch (err) {
        setError('Failed to load map. Please try again later.');
        setLoading(false);
      }
    };

    loadMap();
  }, [provider, center, zoom]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.grey[100],
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {!loading && !error && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grey[200],
              backgroundImage: `linear-gradient(45deg, ${theme.palette.grey[300]} 25%, transparent 25%),
                               linear-gradient(-45deg, ${theme.palette.grey[300]} 25%, transparent 25%),
                               linear-gradient(45deg, transparent 75%, ${theme.palette.grey[300]} 75%),
                               linear-gradient(-45deg, transparent 75%, ${theme.palette.grey[300]} 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          >
            <Box
              sx={{
                p: 4,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              <Box sx={{ fontSize: 48, mb: 2 }}>🗺️</Box>
              <Box sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
                Map Placeholder
              </Box>
              <Box sx={{ color: 'text.secondary', fontSize: 14 }}>
                Provider: {provider}
                <br />
                Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                <br />
                Markers: {markers.length}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
