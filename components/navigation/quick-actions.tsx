'use client';

import { useState, useCallback, ReactNode } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Fab,
  Box,
  Tooltip,
  SxProps,
  Theme,
} from '@mui/material';
import {
  AddOutlined,
  CloseOutlined,
  DirectionsCarOutlined,
  LocalGasStationOutlined,
  BuildOutlined,
  NoteAddOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface QuickAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

interface QuickActionsProps {
  actions: QuickAction[];
  direction?: 'up' | 'down' | 'left' | 'right';
  position?: {
    bottom?: number;
    right?: number;
    top?: number;
    left?: number;
  };
  hidden?: boolean;
  sx?: SxProps<Theme>;
}

export function QuickActions({
  actions,
  direction = 'up',
  position = { bottom: 24, right: 24 },
  hidden = false,
  sx,
}: QuickActionsProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleActionClick = useCallback(
    (action: QuickAction) => {
      action.onClick();
      handleClose();
    },
    [handleClose]
  );

  return (
    <SpeedDial
      ariaLabel="Quick actions"
      hidden={hidden}
      icon={<SpeedDialIcon openIcon={<CloseOutlined />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction={direction}
      FabProps={{
        color: 'primary',
        sx: {
          boxShadow: theme.shadows[8],
        },
      }}
      sx={{
        position: 'fixed',
        ...position,
        ...sx,
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.id}
          icon={action.icon}
          tooltipTitle={action.label}
          tooltipOpen
          onClick={() => handleActionClick(action)}
          FabProps={{
            disabled: action.disabled,
            sx: {
              bgcolor: action.color ? theme.palette[action.color].main : undefined,
              color: action.color ? '#fff' : undefined,
              '&:hover': {
                bgcolor: action.color ? theme.palette[action.color].dark : undefined,
              },
            },
          }}
        />
      ))}
    </SpeedDial>
  );
}

// Pre-configured fleet management quick actions
export function FleetQuickActions({
  onAddVehicle,
  onAddFuelEvent,
  onAddMaintenance,
  onAddNote,
  hidden,
}: {
  onAddVehicle?: () => void;
  onAddFuelEvent?: () => void;
  onAddMaintenance?: () => void;
  onAddNote?: () => void;
  hidden?: boolean;
}) {
  const actions: QuickAction[] = [];

  if (onAddVehicle) {
    actions.push({
      id: 'add-vehicle',
      label: 'Add Vehicle',
      icon: <DirectionsCarOutlined />,
      onClick: onAddVehicle,
      color: 'primary',
    });
  }

  if (onAddFuelEvent) {
    actions.push({
      id: 'add-fuel',
      label: 'Log Fuel',
      icon: <LocalGasStationOutlined />,
      onClick: onAddFuelEvent,
      color: 'success',
    });
  }

  if (onAddMaintenance) {
    actions.push({
      id: 'add-maintenance',
      label: 'Schedule Maintenance',
      icon: <BuildOutlined />,
      onClick: onAddMaintenance,
      color: 'warning',
    });
  }

  if (onAddNote) {
    actions.push({
      id: 'add-note',
      label: 'Add Note',
      icon: <NoteAddOutlined />,
      onClick: onAddNote,
    });
  }

  if (actions.length === 0) return null;

  return <QuickActions actions={actions} hidden={hidden} />;
}

// Single floating action button (simpler alternative)
interface FloatingActionProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  position?: {
    bottom?: number;
    right?: number;
    top?: number;
    left?: number;
  };
  extended?: boolean;
  hidden?: boolean;
  sx?: SxProps<Theme>;
}

export function FloatingAction({
  label,
  icon = <AddOutlined />,
  onClick,
  color = 'primary',
  position = { bottom: 24, right: 24 },
  extended = false,
  hidden = false,
  sx,
}: FloatingActionProps) {
  const theme = useTheme();

  if (hidden) return null;

  return (
    <Tooltip title={!extended ? label : ''} placement="left">
      <Fab
        color={color}
        variant={extended ? 'extended' : 'circular'}
        onClick={onClick}
        sx={{
          position: 'fixed',
          boxShadow: theme.shadows[8],
          ...position,
          ...sx,
        }}
      >
        {icon}
        {extended && <Box sx={{ ml: 1 }}>{label}</Box>}
      </Fab>
    </Tooltip>
  );
}
