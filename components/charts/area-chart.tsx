'use client';

import { useMemo, useRef, useCallback, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  FileDownloadOutlined,
  ImageOutlined,
  TableChartOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AreaChartDataset {
  label: string;
  data: number[];
  color?: string;
}

interface AreaChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  datasets: AreaChartDataset[];
  stacked?: boolean;
  showExport?: boolean;
  height?: number;
  smooth?: boolean;
  showPoints?: boolean;
  gradient?: boolean;
  onPointClick?: (label: string, value: number, datasetIndex: number) => void;
}

export function AreaChart({
  title,
  subtitle,
  labels,
  datasets,
  stacked = false,
  showExport = true,
  height = 300,
  smooth = true,
  showPoints = true,
  gradient = true,
  onPointClick,
}: AreaChartProps) {
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'line'>>(null);
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

  const createGradient = useCallback(
    (ctx: CanvasRenderingContext2D, color: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, alpha(color, 0.4));
      gradient.addColorStop(0.5, alpha(color, 0.1));
      gradient.addColorStop(1, alpha(color, 0));
      return gradient;
    },
    [height]
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: datasets.map((dataset, index) => {
        const color = dataset.color || chartColors[index % chartColors.length];
        return {
          label: dataset.label,
          data: dataset.data,
          borderColor: color,
          backgroundColor: gradient
            ? (context: any) => {
                const ctx = context.chart.ctx;
                return createGradient(ctx, color);
              }
            : alpha(color, 0.2),
          borderWidth: 2,
          fill: true,
          tension: smooth ? 0.4 : 0,
          pointRadius: showPoints ? 4 : 0,
          pointHoverRadius: 6,
          pointBackgroundColor: color,
          pointBorderColor: theme.palette.background.paper,
          pointBorderWidth: 2,
        };
      }),
    }),
    [labels, datasets, chartColors, smooth, showPoints, gradient, createGradient, theme]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
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
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
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
      onClick: onPointClick
        ? (_: any, elements: any[]) => {
            if (elements.length > 0) {
              const element = elements[0];
              const datasetIndex = element.datasetIndex;
              const index = element.index;
              const label = labels[index];
              const value = datasets[datasetIndex].data[index];
              onPointClick(label, value, datasetIndex);
            }
          }
        : undefined,
    }),
    [theme, datasets, stacked, onPointClick, labels]
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
          <Line ref={chartRef} data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}
