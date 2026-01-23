'use client';

import { useMemo, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import {
  FileDownloadOutlined,
  ImageOutlined,
  TableChartOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartDataset {
  label: string;
  data: number[];
  color?: string;
}

interface BarChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  datasets: BarChartDataset[];
  horizontal?: boolean;
  stacked?: boolean;
  showExport?: boolean;
  height?: number;
  onBarClick?: (label: string, value: number, datasetIndex: number) => void;
}

export function BarChart({
  title,
  subtitle,
  labels,
  datasets,
  horizontal = false,
  stacked = false,
  showExport = true,
  height = 300,
  onBarClick,
}: BarChartProps) {
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  const chartColors = useMemo(
    () => [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.secondary.main,
      '#49BEFF',
      '#FF6B9D',
      '#6B5AFF',
    ],
    [theme]
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: datasets.map((dataset, index) => {
        const color = dataset.color || chartColors[index % chartColors.length];
        return {
          label: dataset.label,
          data: dataset.data,
          backgroundColor: alpha(color, 0.8),
          hoverBackgroundColor: color,
          borderColor: color,
          borderWidth: 0,
          borderRadius: 6,
          borderSkipped: false as const,
        };
      }),
    }),
    [labels, datasets, chartColors]
  );

  const options = useMemo(
    () => ({
      indexAxis: horizontal ? ('y' as const) : ('x' as const),
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'top' as const,
          align: 'end' as const,
          labels: {
            usePointStyle: true,
            padding: 15,
            color: theme.palette.text.primary,
            font: {
              size: 13,
              family: theme.typography.fontFamily,
            },
          },
        },
        tooltip: {
          backgroundColor: theme.palette.background.paper,
          titleColor: theme.palette.text.primary,
          bodyColor: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (context: any) => {
              const value = context.parsed[horizontal ? 'x' : 'y'];
              return `${context.dataset.label}: ${value.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked,
          grid: {
            display: horizontal,
            color: theme.palette.divider,
          },
          ticks: {
            color: theme.palette.text.secondary,
            font: {
              size: 12,
            },
          },
        },
        y: {
          stacked,
          grid: {
            display: !horizontal,
            color: theme.palette.divider,
          },
          ticks: {
            color: theme.palette.text.secondary,
            font: {
              size: 12,
            },
          },
        },
      },
      onClick: onBarClick
        ? (_: any, elements: any[]) => {
            if (elements.length > 0) {
              const element = elements[0];
              const datasetIndex = element.datasetIndex;
              const index = element.index;
              const label = labels[index];
              const value = datasets[datasetIndex].data[index];
              onBarClick(label, value, datasetIndex);
            }
          }
        : undefined,
    }),
    [theme, datasets.length, horizontal, stacked, onBarClick, labels, datasets]
  );

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportImage = useCallback(() => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
    handleExportClose();
  }, [title]);

  const handleExportCSV = useCallback(() => {
    const headers = ['Label', ...datasets.map((d) => d.label)];
    const rows = labels.map((label, index) => [
      label,
      ...datasets.map((d) => d.data[index].toString()),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
    handleExportClose();
  }, [title, labels, datasets]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {subtitle}
              </Typography>
            )}
          </Box>
          {showExport && (
            <>
              <IconButton size="small" onClick={handleExportClick}>
                <FileDownloadOutlined />
              </IconButton>
              <Menu
                anchorEl={exportMenuAnchor}
                open={Boolean(exportMenuAnchor)}
                onClose={handleExportClose}
              >
                <MenuItem onClick={handleExportImage}>
                  <ListItemIcon>
                    <ImageOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Export as PNG</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportCSV}>
                  <ListItemIcon>
                    <TableChartOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Export as CSV</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
        <Box sx={{ mt: 3, height }}>
          <Bar ref={chartRef} data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}
