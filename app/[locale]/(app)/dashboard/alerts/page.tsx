'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  WarningAmberOutlined,
  NotificationsOutlined,
  CheckCircleOutlined,
  SnoozeOutlined,
  DeleteOutlined,
  VisibilityOutlined,
  MoreVertOutlined,
  FilterListOutlined,
  DoneAllOutlined,
  LocalGasStationOutlined,
  BuildOutlined,
  PlaceOutlined,
  SpeedOutlined,
  SecurityOutlined,
  DirectionsCarOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { useAlertsStore, Alert, AlertType, AlertPriority } from '@/lib/stores/alerts-store';
import { TabNav, TabPanel } from '@/components/navigation/tab-nav';
import { EmptyState } from '@/components/common/empty-state';
import { Link } from '@/i18n/routing';

const alertTypeIcons: Record<AlertType, React.ReactNode> = {
  fuel: <LocalGasStationOutlined />,
  maintenance: <BuildOutlined />,
  geofence: <PlaceOutlined />,
  speeding: <SpeedOutlined />,
  insurance: <SecurityOutlined />,
};

const priorityColors: Record<AlertPriority, string> = {
  critical: '#FA896B',
  high: '#FFAE1F',
  medium: '#5D87FF',
  low: '#13DEB9',
};

const tabs = [
  { id: 'all', label: 'All Alerts' },
  { id: 'unread', label: 'Unread' },
  { id: 'critical', label: 'Critical' },
];

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onSnooze: (id: string, until: Date) => void;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

function AlertCard({ alert, onAcknowledge, onSnooze, onDismiss, onMarkAsRead }: AlertCardProps) {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const handleSnooze = (hours: number) => {
    const until = new Date(Date.now() + hours * 3600000);
    onSnooze(alert.id, until);
    handleMenuClose();
  };

  const priorityColor = priorityColors[alert.priority];
  const typeIcon = alertTypeIcons[alert.type];

  const timeSince = useMemo(() => {
    const date = new Date(alert.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }, [alert.timestamp]);

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: 4,
        borderColor: priorityColor,
        bgcolor: !alert.read ? alpha(priorityColor, 0.03) : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(priorityColor, 0.15),
              color: priorityColor,
            }}
          >
            {typeIcon}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {alert.title}
              </Typography>
              {!alert.read && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
              )}
              <Chip
                label={alert.priority.toUpperCase()}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  bgcolor: alpha(priorityColor, 0.1),
                  color: priorityColor,
                }}
              />
              <Chip
                label={alert.type}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.625rem' }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {alert.message}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {alert.vehicleName && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DirectionsCarOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {alert.vehicleName}
                  </Typography>
                </Box>
              )}
              <Typography variant="caption" color="text.secondary">
                {timeSince}
              </Typography>
              {alert.acknowledged && (
                <Chip
                  label="Acknowledged"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.625rem' }}
                />
              )}
              {alert.snoozedUntil && new Date(alert.snoozedUntil) > new Date() && (
                <Chip
                  label={`Snoozed until ${new Date(alert.snoozedUntil).toLocaleTimeString()}`}
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.625rem' }}
                />
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {!alert.acknowledged && (
              <Tooltip title="Acknowledge">
                <IconButton size="small" onClick={() => onAcknowledge(alert.id)}>
                  <CheckCircleOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertOutlined fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {!alert.read && (
          <MenuItem onClick={() => handleAction(() => onMarkAsRead(alert.id))}>
            <ListItemIcon>
              <VisibilityOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as read</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleSnooze(1)}>
          <ListItemIcon>
            <SnoozeOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Snooze 1 hour</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSnooze(24)}>
          <ListItemIcon>
            <SnoozeOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Snooze 1 day</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction(() => onDismiss(alert.id))}>
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Dismiss</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}

export default function AlertsPage() {
  const theme = useTheme();
  const { alerts, markAsRead, markAllAsRead, acknowledge, snooze, dismiss } = useAlertsStore();
  const [activeTab, setActiveTab] = useState('all');

  const filteredAlerts = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return alerts.filter((a) => !a.read);
      case 'critical':
        return alerts.filter((a) => a.priority === 'critical' || a.priority === 'high');
      default:
        return alerts;
    }
  }, [alerts, activeTab]);

  const unreadCount = alerts.filter((a) => !a.read).length;
  const criticalCount = alerts.filter((a) => a.priority === 'critical' || a.priority === 'high').length;

  const tabsWithBadges = [
    { id: 'all', label: 'All Alerts', badge: alerts.length },
    { id: 'unread', label: 'Unread', badge: unreadCount },
    { id: 'critical', label: 'Critical', badge: criticalCount },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and respond to fleet alerts and notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<DoneAllOutlined />}
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          <Button
            component={Link}
            href="/dashboard/settings"
            variant="outlined"
            startIcon={<SettingsOutlined />}
          >
            Settings
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                  <WarningAmberOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {alerts.filter((a) => a.priority === 'critical').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Critical Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <NotificationsOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {unreadCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unread
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <CheckCircleOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {alerts.filter((a) => a.acknowledged).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Acknowledged
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <SnoozeOutlined />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {alerts.filter((a) => a.snoozedUntil && new Date(a.snoozedUntil) > new Date()).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Snoozed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs and Alert List */}
      <Card>
        <CardContent>
          <TabNav tabs={tabsWithBadges} value={activeTab} onChange={setActiveTab} />

          <Box sx={{ mt: 3 }}>
            {filteredAlerts.length === 0 ? (
              <EmptyState
                variant="alerts"
                title={activeTab === 'all' ? 'No alerts' : `No ${activeTab} alerts`}
                description={
                  activeTab === 'all'
                    ? "You're all caught up! No alerts require your attention."
                    : `No ${activeTab} alerts at the moment.`
                }
              />
            ) : (
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={acknowledge}
                  onSnooze={snooze}
                  onDismiss={dismiss}
                  onMarkAsRead={markAsRead}
                />
              ))
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
