import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ru', 'hy'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/dashboard/vehicles': '/dashboard/vehicles',
    '/dashboard/fuel': '/dashboard/fuel',
    '/dashboard/maintenance': '/dashboard/maintenance',
    '/dashboard/settings': '/dashboard/settings',
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
