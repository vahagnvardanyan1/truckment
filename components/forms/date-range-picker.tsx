'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  TextField,
  Popover,
  IconButton,
  Divider,
  Grid2 as Grid,
  SxProps,
  Theme,
} from '@mui/material';
import {
  CalendarTodayOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

type PresetRange = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  presets?: PresetRange[];
  disabled?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const presetLabels: Record<PresetRange, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7days: 'Last 7 days',
  last30days: 'Last 30 days',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  custom: 'Custom',
};

const defaultPresets: PresetRange[] = ['today', 'last7days', 'last30days', 'thisMonth'];

function getPresetRange(preset: PresetRange): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'today':
      return { startDate: today, endDate: today };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { startDate: yesterday, endDate: yesterday };
    }
    case 'last7days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { startDate: start, endDate: today };
    }
    case 'last30days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { startDate: start, endDate: today };
    }
    case 'thisMonth':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: today,
      };
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: start, endDate: end };
    }
    default:
      return { startDate: null, endDate: null };
  }
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRangeLabel(range: DateRange): string {
  if (!range.startDate && !range.endDate) return 'Select dates';
  if (!range.endDate) return formatDate(range.startDate);
  if (range.startDate?.getTime() === range.endDate?.getTime()) {
    return formatDate(range.startDate);
  }
  return `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`;
}

interface CalendarProps {
  month: Date;
  selectedRange: DateRange;
  onDateClick: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

function Calendar({ month, selectedRange, onDateClick, minDate, maxDate }: CalendarProps) {
  const theme = useTheme();
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const startOffset = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }

  const isInRange = (date: Date): boolean => {
    if (!selectedRange.startDate || !selectedRange.endDate) return false;
    return date >= selectedRange.startDate && date <= selectedRange.endDate;
  };

  const isStartDate = (date: Date): boolean => {
    return selectedRange.startDate?.getTime() === date.getTime();
  };

  const isEndDate = (date: Date): boolean => {
    return selectedRange.endDate?.getTime() === date.getTime();
  };

  const isDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <Box>
      <Grid container spacing={0}>
        {daysOfWeek.map((day) => (
          <Grid key={day} size={12/7}>
            <Box
              sx={{
                textAlign: 'center',
                py: 1,
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {day}
            </Box>
          </Grid>
        ))}
        {days.map((day, index) => (
          <Grid key={index} size={12/7}>
            {day ? (
              <Box
                onClick={() => !isDisabled(day) && onDateClick(day)}
                sx={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '2px auto',
                  borderRadius: isStartDate(day)
                    ? '50% 0 0 50%'
                    : isEndDate(day)
                      ? '0 50% 50% 0'
                      : isInRange(day)
                        ? 0
                        : '50%',
                  backgroundColor:
                    isStartDate(day) || isEndDate(day)
                      ? theme.palette.primary.main
                      : isInRange(day)
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                  color:
                    isStartDate(day) || isEndDate(day)
                      ? '#fff'
                      : isDisabled(day)
                        ? 'text.disabled'
                        : 'text.primary',
                  cursor: isDisabled(day) ? 'default' : 'pointer',
                  fontSize: '0.875rem',
                  ...(!isDisabled(day) && {
                    '&:hover': {
                      backgroundColor:
                        isStartDate(day) || isEndDate(day)
                          ? theme.palette.primary.dark
                          : alpha(theme.palette.primary.main, 0.15),
                    },
                  }),
                }}
              >
                {day.getDate()}
              </Box>
            ) : (
              <Box sx={{ height: 36 }} />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  presets = defaultPresets,
  disabled = false,
  size = 'medium',
  fullWidth = false,
  sx,
}: DateRangePickerProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [viewMonth, setViewMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const [tempRange, setTempRange] = useState<DateRange>(value);

  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
      setTempRange(value);
    }
  }, [disabled, value]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handlePresetClick = useCallback((preset: PresetRange) => {
    const range = getPresetRange(preset);
    onChange(range);
    handleClose();
  }, [onChange, handleClose]);

  const handleDateClick = useCallback((date: Date) => {
    if (selecting === 'start') {
      setTempRange({ startDate: date, endDate: null });
      setSelecting('end');
    } else {
      if (tempRange.startDate && date < tempRange.startDate) {
        setTempRange({ startDate: date, endDate: tempRange.startDate });
      } else {
        setTempRange({ ...tempRange, endDate: date });
      }
      setSelecting('start');
    }
  }, [selecting, tempRange]);

  const handleApply = useCallback(() => {
    onChange(tempRange);
    handleClose();
  }, [onChange, tempRange, handleClose]);

  const handlePrevMonth = useCallback(() => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleClick}
        disabled={disabled}
        startIcon={<CalendarTodayOutlined />}
        size={size}
        fullWidth={fullWidth}
        sx={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          fontWeight: 400,
          color: 'text.primary',
          borderColor: 'divider',
          minWidth: 200,
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        {formatRangeLabel(value)}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { mt: 1, borderRadius: 2, minWidth: 320 },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {presets.map((preset) => (
              <Button
                key={preset}
                size="small"
                variant="outlined"
                onClick={() => handlePresetClick(preset)}
                sx={{ textTransform: 'none' }}
              >
                {presetLabels[preset]}
              </Button>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton size="small" onClick={handlePrevMonth}>
              <ChevronLeftOutlined />
            </IconButton>
            <Typography variant="subtitle2" fontWeight={600}>
              {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton size="small" onClick={handleNextMonth}>
              <ChevronRightOutlined />
            </IconButton>
          </Box>

          <Calendar
            month={viewMonth}
            selectedRange={tempRange}
            onDateClick={handleDateClick}
            minDate={minDate}
            maxDate={maxDate}
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {formatRangeLabel(tempRange)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleApply}
                disabled={!tempRange.startDate || !tempRange.endDate}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
