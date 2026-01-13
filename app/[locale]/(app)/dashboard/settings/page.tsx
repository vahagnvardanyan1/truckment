import { useTranslations } from 'next-intl';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const SettingsPage = () => {
  const t = useTranslations('common');

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('settings')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your application preferences
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                User Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure your personal settings, units, time zone, and language preferences.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Map Provider
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose your preferred map provider: Google Maps, Yandex Maps, or Mapbox.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your notification preferences for alerts, maintenance reminders, and more.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Access Control
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage user roles and permissions for your organization.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SettingsPage;
