'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Avatar,
  Typography,
  Chip,
  InputAdornment,
  SxProps,
  Theme,
} from '@mui/material';
import { DirectionsCarOutlined, LocalShippingOutlined } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { Vehicle } from '@/types';
import { StatusBadge, StatusType } from '@/components/common/status-badge';

interface VehicleOption {
  id: string;
  name: string;
  licensePlate: string;
  type: 'truck' | 'van' | 'car' | 'bus';
  status: StatusType;
  fuelLevel?: number;
}

interface VehicleSelectProps {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  options: VehicleOption[];
  multiple?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  showStatus?: boolean;
  filterByStatus?: StatusType[];
  sx?: SxProps<Theme>;
}

const vehicleIcons: Record<string, React.ReactNode> = {
  truck: <LocalShippingOutlined />,
  van: <LocalShippingOutlined />,
  car: <DirectionsCarOutlined />,
  bus: <DirectionsCarOutlined />,
};

function VehicleOptionComponent({
  option,
  showStatus,
  ...props
}: {
  option: VehicleOption;
  showStatus: boolean;
} & React.HTMLAttributes<HTMLLIElement>) {
  const theme = useTheme();

  return (
    <Box
      component="li"
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        }}
      >
        {vehicleIcons[option.type] || <DirectionsCarOutlined />}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {option.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {option.licensePlate}
        </Typography>
      </Box>
      {showStatus && <StatusBadge status={option.status} size="small" />}
    </Box>
  );
}

export function VehicleSelect({
  value,
  onChange,
  options,
  multiple = false,
  label,
  placeholder = 'Select vehicle',
  error,
  helperText,
  disabled = false,
  loading = false,
  size = 'medium',
  fullWidth = true,
  showStatus = true,
  filterByStatus,
  sx,
}: VehicleSelectProps) {
  const theme = useTheme();

  const filteredOptions = useMemo(() => {
    if (!filterByStatus || filterByStatus.length === 0) return options;
    return options.filter((opt) => filterByStatus.includes(opt.status));
  }, [options, filterByStatus]);

  const getSelectedValue = () => {
    if (multiple) {
      return filteredOptions.filter((opt) => (value as string[])?.includes(opt.id)) || [];
    }
    return filteredOptions.find((opt) => opt.id === value) || null;
  };

  const handleChange = useCallback(
    (_: any, newValue: VehicleOption | VehicleOption[] | null) => {
      if (multiple) {
        onChange((newValue as VehicleOption[])?.map((v) => v.id) || []);
      } else {
        onChange((newValue as VehicleOption)?.id || null);
      }
    },
    [multiple, onChange]
  );

  return (
    <Autocomplete
      multiple={multiple}
      options={filteredOptions}
      value={getSelectedValue()}
      onChange={handleChange}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth={fullWidth}
      size={size}
      sx={sx}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <VehicleOptionComponent
            key={option.id}
            option={option}
            showStatus={showStatus}
            {...otherProps}
          />
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error || helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {!multiple && !value && (
                  <InputAdornment position="start">
                    <DirectionsCarOutlined sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )}
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
          <Chip
            key={option.id}
            {...tagProps}
            label={option.name}
            size="small"
            avatar={
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                {vehicleIcons[option.type] || <DirectionsCarOutlined sx={{ fontSize: 14 }} />}
              </Avatar>
            }
          />
        );
        })
      }
    />
  );
}
