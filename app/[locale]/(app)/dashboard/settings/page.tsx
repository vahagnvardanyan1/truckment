'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';

import { useThemeStore } from '@/lib/stores/theme-store';
import type { Locale } from '@/types';

const SettingsPage = () => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  
  const themeMode = useThemeStore((state) => state.mode);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value as 'light' | 'dark');
  };

  const handleLocaleChange = (locale: Locale) => {
    router.replace(pathname, { locale });
  };

  const locales: { code: Locale; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  ];

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
        {/* Appearance Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {themeMode === 'light' ? (
                    <LightModeIcon sx={{ color: 'white', fontSize: 20 }} />
                  ) : (
                    <DarkModeIcon sx={{ color: 'white', fontSize: 20 }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Appearance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customize how the app looks
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                  Theme Mode
                </FormLabel>
                <RadioGroup value={themeMode} onChange={handleThemeChange}>
                  <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightModeIcon fontSize="small" />
                        <span>Light Mode</span>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkModeIcon fontSize="small" />
                        <span>Dark Mode</span>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Language Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LanguageIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Language
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select your preferred language
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                {locales.map((locale) => (
                  <ListItem key={locale.code} disablePadding>
                    <ListItemButton
                      onClick={() => handleLocaleChange(locale.code)}
                      sx={{
                        borderRadius: '10px',
                        mb: 1,
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Typography sx={{ fontSize: '1.5rem' }}>{locale.flag}</Typography>
                        <ListItemText
                          primary={locale.name}
                          primaryTypographyProps={{
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Map Provider */}
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

        {/* Notifications */}
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

        {/* Access Control */}
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
