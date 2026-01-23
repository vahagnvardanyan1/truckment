'use client';

import { useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Slider,
  Divider,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  InputAdornment,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import {
  PaletteOutlined,
  NotificationsOutlined,
  MapOutlined,
  DirectionsCarOutlined,
  PersonOutlined,
  GroupOutlined,
  LightModeOutlined,
  DarkModeOutlined,
  LanguageOutlined,
  SpeedOutlined,
  VisibilityOutlined,
  EditOutlined,
  PhotoCameraOutlined,
  SecurityOutlined,
  EmailOutlined,
  PhoneOutlined,
  SmsOutlined,
  NotificationsActiveOutlined,
  WarningAmberOutlined,
  BuildOutlined,
  LocalGasStationOutlined,
  AddOutlined,
  DeleteOutlined,
  MoreVertOutlined,
} from '@mui/icons-material';
import { useThemeStore } from '@/lib/stores/theme-store';
import { TabNav, TabPanel } from '@/components/navigation/tab-nav';
import type { Locale } from '@/types';

// Mock user data
const currentUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  avatar: null,
  role: 'Admin',
  company: 'Fleet Management Inc.',
  timezone: 'UTC-5',
  twoFactorEnabled: false,
};

// Mock team members
const teamMembers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Driver', status: 'active' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Viewer', status: 'pending' },
];

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: <PaletteOutlined /> },
  { id: 'notifications', label: 'Notifications', icon: <NotificationsOutlined /> },
  { id: 'map', label: 'Map', icon: <MapOutlined /> },
  { id: 'fleet', label: 'Fleet', icon: <DirectionsCarOutlined /> },
  { id: 'account', label: 'Account', icon: <PersonOutlined /> },
  { id: 'team', label: 'Team', icon: <GroupOutlined /> },
];

const locales: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'hy', name: 'Հայdelays', flag: '🇦🇲' },
];

const mapProviders = [
  { id: 'google', name: 'Google Maps', description: 'Most popular, extensive coverage' },
  { id: 'mapbox', name: 'Mapbox', description: 'Customizable styling, good performance' },
  { id: 'yandex', name: 'Yandex Maps', description: 'Best for CIS region coverage' },
];

const roles = ['Admin', 'Manager', 'Driver', 'Viewer'];

export default function SettingsPage() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const themeMode = useThemeStore((state) => state.mode);
  const setTheme = useThemeStore((state) => state.setTheme);

  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    // Appearance
    density: 'comfortable',
    animationsEnabled: true,
    language: 'en',
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    alertNotifications: true,
    maintenanceReminders: true,
    fuelAlerts: true,
    // Map
    mapProvider: 'google',
    distanceUnit: 'km',
    defaultZoom: 12,
    showTraffic: true,
    showGeofences: true,
    // Fleet
    defaultVehicleView: 'grid',
    lowFuelThreshold: 20,
    speedAlertThreshold: 120,
    idleTimeThreshold: 15,
    // Account
    twoFactorEnabled: false,
  });

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value as 'light' | 'dark');
  };

  const handleLocaleChange = (locale: Locale) => {
    router.replace(pathname, { locale });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Customize your application preferences and manage your account
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Card>
        <CardContent>
          <TabNav tabs={tabs} value={activeTab} onChange={setActiveTab} />

          {/* Appearance Tab */}
          <TabPanel value="appearance" activeValue={activeTab}>
            <Grid container spacing={3}>
              {/* Theme Mode */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Theme Mode
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Choose between light and dark mode
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {['light', 'dark'].map((mode) => (
                        <Box
                          key={mode}
                          onClick={() => setTheme(mode as 'light' | 'dark')}
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            border: 2,
                            borderColor: themeMode === mode ? 'primary.main' : 'divider',
                            bgcolor: mode === 'light' ? '#fff' : '#1e1e1e',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: themeMode === mode ? 'primary.main' : 'primary.light',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              mb: 1,
                            }}
                          >
                            {mode === 'light' ? (
                              <LightModeOutlined sx={{ fontSize: 32, color: mode === 'light' ? '#333' : '#fff' }} />
                            ) : (
                              <DarkModeOutlined sx={{ fontSize: 32, color: '#fff' }} />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            textAlign="center"
                            fontWeight={600}
                            sx={{ color: mode === 'light' ? '#333' : '#fff' }}
                          >
                            {mode === 'light' ? 'Light' : 'Dark'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Language */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Language
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Select your preferred language
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={settings.language}
                        onChange={(e) => {
                          handleSettingChange('language', e.target.value);
                          handleLocaleChange(e.target.value as Locale);
                        }}
                      >
                        {locales.map((locale) => (
                          <MenuItem key={locale.code} value={locale.code}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <span>{locale.flag}</span>
                              <span>{locale.name}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Density */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Display Density
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Adjust spacing and sizing throughout the interface
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={settings.density}
                        onChange={(e) => handleSettingChange('density', e.target.value)}
                      >
                        <FormControlLabel value="compact" control={<Radio />} label="Compact" />
                        <FormControlLabel value="comfortable" control={<Radio />} label="Comfortable" />
                        <FormControlLabel value="spacious" control={<Radio />} label="Spacious" />
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Animations */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Animations
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Enable or disable interface animations
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.animationsEnabled}
                          onChange={(e) => handleSettingChange('animationsEnabled', e.target.checked)}
                        />
                      }
                      label="Enable animations"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value="notifications" activeValue={activeTab}>
            <Grid container spacing={3}>
              {/* Notification Channels */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Notification Channels
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Choose how you want to receive notifications
                    </Typography>
                    <List disablePadding>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <EmailOutlined color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Receive updates via email"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                            <NotificationsActiveOutlined color="info" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Push Notifications"
                          secondary="Receive browser push notifications"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.pushNotifications}
                            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                            <SmsOutlined color="success" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="SMS Notifications"
                          secondary="Receive critical alerts via SMS"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.smsNotifications}
                            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Alert Types */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Alert Types
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Select which alerts you want to receive
                    </Typography>
                    <List disablePadding>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                            <WarningAmberOutlined color="error" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Vehicle Alerts"
                          secondary="Speed, location, and safety alerts"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.alertNotifications}
                            onChange={(e) => handleSettingChange('alertNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                            <BuildOutlined color="warning" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Maintenance Reminders"
                          secondary="Service due and overdue alerts"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.maintenanceReminders}
                            onChange={(e) => handleSettingChange('maintenanceReminders', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                            <LocalGasStationOutlined color="secondary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Fuel Alerts"
                          secondary="Low fuel and consumption anomalies"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.fuelAlerts}
                            onChange={(e) => handleSettingChange('fuelAlerts', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Map Tab */}
          <TabPanel value="map" activeValue={activeTab}>
            <Grid container spacing={3}>
              {/* Map Provider */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Map Provider
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Select your preferred map provider
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={settings.mapProvider}
                        onChange={(e) => handleSettingChange('mapProvider', e.target.value)}
                      >
                        {mapProviders.map((provider) => (
                          <FormControlLabel
                            key={provider.id}
                            value={provider.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {provider.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {provider.description}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Units */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Units
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Set measurement units for distance
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={settings.distanceUnit}
                        onChange={(e) => handleSettingChange('distanceUnit', e.target.value)}
                        row
                      >
                        <FormControlLabel value="km" control={<Radio />} label="Kilometers" />
                        <FormControlLabel value="mi" control={<Radio />} label="Miles" />
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Default Zoom */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Default Zoom Level
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Set the default zoom level for maps
                    </Typography>
                    <Slider
                      value={settings.defaultZoom}
                      onChange={(_, value) => handleSettingChange('defaultZoom', value)}
                      min={5}
                      max={18}
                      marks={[
                        { value: 5, label: 'Country' },
                        { value: 10, label: 'City' },
                        { value: 15, label: 'Street' },
                        { value: 18, label: 'Building' },
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Map Features */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Map Features
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Toggle map overlay features
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.showTraffic}
                          onChange={(e) => handleSettingChange('showTraffic', e.target.checked)}
                        />
                      }
                      label="Show traffic layer"
                      sx={{ display: 'block', mb: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.showGeofences}
                          onChange={(e) => handleSettingChange('showGeofences', e.target.checked)}
                        />
                      }
                      label="Show geofences"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Fleet Tab */}
          <TabPanel value="fleet" activeValue={activeTab}>
            <Grid container spacing={3}>
              {/* Default View */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Default Vehicle View
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Choose the default view for the vehicles page
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={settings.defaultVehicleView}
                        onChange={(e) => handleSettingChange('defaultVehicleView', e.target.value)}
                        row
                      >
                        <FormControlLabel value="grid" control={<Radio />} label="Grid" />
                        <FormControlLabel value="list" control={<Radio />} label="List" />
                        <FormControlLabel value="map" control={<Radio />} label="Map" />
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Alert Thresholds */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Alert Thresholds
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Configure alert trigger levels
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Low Fuel Alert ({settings.lowFuelThreshold}%)
                      </Typography>
                      <Slider
                        value={settings.lowFuelThreshold}
                        onChange={(_, value) => handleSettingChange('lowFuelThreshold', value)}
                        min={5}
                        max={50}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Speed Alert ({settings.speedAlertThreshold} km/h)
                      </Typography>
                      <Slider
                        value={settings.speedAlertThreshold}
                        onChange={(_, value) => handleSettingChange('speedAlertThreshold', value)}
                        min={60}
                        max={180}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value} km/h`}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Idle Time Alert ({settings.idleTimeThreshold} minutes)
                      </Typography>
                      <Slider
                        value={settings.idleTimeThreshold}
                        onChange={(_, value) => handleSettingChange('idleTimeThreshold', value)}
                        min={5}
                        max={60}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value} min`}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Account Tab */}
          <TabPanel value="account" activeValue={activeTab}>
            <Grid container spacing={3}>
              {/* Profile */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Profile Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontSize: '2rem',
                          }}
                        >
                          {currentUser.name.charAt(0)}
                        </Avatar>
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                            boxShadow: 1,
                          }}
                        >
                          <PhotoCameraOutlined sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {currentUser.name}
                        </Typography>
                        <Chip label={currentUser.role} size="small" color="primary" />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Full Name"
                        defaultValue={currentUser.name}
                        fullWidth
                      />
                      <TextField
                        label="Email"
                        defaultValue={currentUser.email}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        label="Phone"
                        defaultValue={currentUser.phone}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button variant="contained">Save Changes</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Security */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Security
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Change Password
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Current Password"
                          type="password"
                          fullWidth
                        />
                        <TextField
                          label="New Password"
                          type="password"
                          fullWidth
                        />
                        <TextField
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                        />
                        <Button variant="outlined">Update Password</Button>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            Two-Factor Authentication
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Add an extra layer of security to your account
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.twoFactorEnabled}
                          onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                        />
                      </Box>
                      {settings.twoFactorEnabled && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                          Two-factor authentication is enabled
                        </Alert>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Team Tab */}
          <TabPanel value="team" activeValue={activeTab}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Team Members
                  </Typography>
                  <Button variant="contained" startIcon={<AddOutlined />}>
                    Invite Member
                  </Button>
                </Box>
                <Card variant="outlined">
                  <List disablePadding>
                    {teamMembers.map((member, index) => (
                      <ListItem
                        key={member.id}
                        divider={index < teamMembers.length - 1}
                        sx={{ py: 2 }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            {member.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight={500}>
                                {member.name}
                              </Typography>
                              {member.status === 'pending' && (
                                <Chip label="Pending" size="small" color="warning" />
                              )}
                            </Box>
                          }
                          secondary={member.email}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select defaultValue={member.role}>
                              {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                  {role}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <IconButton size="small" color="error">
                            <DeleteOutlined />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>

              {/* Roles & Permissions */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Roles & Permissions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Define what each role can access
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {[
                        { role: 'Admin', description: 'Full access to all features and settings' },
                        { role: 'Manager', description: 'Can manage vehicles, drivers, and view reports' },
                        { role: 'Driver', description: 'Can view assigned vehicles and submit reports' },
                        { role: 'Viewer', description: 'Read-only access to dashboard and reports' },
                      ].map((item) => (
                        <Box
                          key={item.role}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'divider',
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {item.role}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large">
          Save All Settings
        </Button>
      </Box>
    </Box>
  );
}
