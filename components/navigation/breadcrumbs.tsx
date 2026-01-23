'use client';

import { ReactNode } from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Box,
  SxProps,
  Theme,
} from '@mui/material';
import { NavigateNextOutlined, HomeOutlined } from '@mui/icons-material';
import { usePathname } from '@/i18n/routing';
import Link from 'next/link';
import { useTheme, alpha } from '@mui/material/styles';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  maxItems?: number;
  sx?: SxProps<Theme>;
}

export function Breadcrumbs({
  items,
  showHome = true,
  maxItems = 4,
  sx,
}: BreadcrumbsProps) {
  const theme = useTheme();

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: '/dashboard', icon: <HomeOutlined sx={{ fontSize: 18 }} /> }, ...items]
    : items;

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextOutlined sx={{ fontSize: 16, color: 'text.disabled' }} />}
      maxItems={maxItems}
      aria-label="breadcrumb"
      sx={sx}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        if (isLast || !item.href) {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: isLast ? 'text.primary' : 'text.secondary',
              }}
            >
              {item.icon}
              <Typography
                variant="body2"
                color={isLast ? 'text.primary' : 'text.secondary'}
                fontWeight={isLast ? 600 : 400}
              >
                {item.label}
              </Typography>
            </Box>
          );
        }

        return (
          <Link
            key={index}
            href={item.href}
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
                transition: 'color 0.2s ease-in-out',
              }}
            >
              {item.icon}
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}

// Auto-generate breadcrumbs from current path
export function AutoBreadcrumbs({ sx }: { sx?: SxProps<Theme> }) {
  const pathname = usePathname();

  // Remove locale prefix and split path
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => !['en', 'ru', 'hy'].includes(segment));

  const breadcrumbLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    vehicles: 'Vehicles',
    fuel: 'Fuel',
    maintenance: 'Maintenance',
    reports: 'Reports',
    alerts: 'Alerts',
    settings: 'Settings',
    contacts: 'Contacts',
    calendar: 'Calendar',
  };

  const items: BreadcrumbItem[] = pathSegments
    .filter((segment) => segment !== 'dashboard' || pathSegments.length === 1)
    .map((segment, index, arr) => {
      const href =
        index < arr.length - 1
          ? `/dashboard/${arr.slice(0, index + 1).join('/')}`
          : undefined;

      return {
        label: breadcrumbLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href,
      };
    });

  if (items.length === 0) return null;

  return <Breadcrumbs items={items} sx={sx} />;
}
