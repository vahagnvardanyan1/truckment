# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Truckment is a fleet management dashboard built with Next.js 15 (App Router), React 19, Material UI v6, and TypeScript. The app features vehicle tracking, fuel management, maintenance scheduling, and analytics. Currently frontend-only with mock data, designed for future backend integration.

## Commands

```bash
npm run dev        # Start development server at localhost:3000
npm run build      # Production build
npm run lint       # ESLint on .ts,.tsx files
npm run type-check # TypeScript type checking without emit
```

## Architecture

### Routing Structure
- Uses `next-intl` for i18n with locale-based routing (`/en/`, `/ru/`, `/hy/`)
- All authenticated pages live under `app/[locale]/(app)/dashboard/`
- Root page redirects to `/[locale]/dashboard`
- Navigation helpers exported from `i18n/routing.ts`: `Link`, `redirect`, `usePathname`, `useRouter`

### Component Patterns
- **Server components** are the default in `app/` directory
- **Client components** must use `'use client'` directive - required for any component using hooks, MUI interactive components, or Zustand stores
- Layout shell (`components/layout/`) contains `app-shell.tsx`, `sidebar.tsx`, `topbar.tsx`
- Reusable UI components in `components/common/`

### State Management
- **Zustand** for client-side state with localStorage persistence
- Stores in `lib/stores/`: `theme-store.ts`, `sidebar-store.ts`, `map-store.ts`
- Pattern for persisted stores:
```typescript
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({ /* state and actions */ }),
    { name: 'storage-key', storage: createJSONStorage(() => localStorage) }
  )
);
```

### Theming
- MUI theme configuration in `lib/theme.ts`
- Light/dark themes with custom palette including `gradient` extension
- Theme provider in `lib/providers/theme-provider.tsx` includes hydration guard to prevent FOUC
- Primary font: Plus Jakarta Sans
- Default border radius: 12px

### Styling Conventions
- Use MUI `sx` prop for responsive styles:
```tsx
<Box sx={{ p: { xs: 2, md: 3 }, fontSize: { xs: '0.8125rem', md: '0.875rem' } }} />
```
- Breakpoints: xs (0-600), sm (600-960), md (960-1280), lg (1280-1920), xl (1920+)

### Internationalization
- Translation files in `i18n/messages/` (en.json, ru.json, hy.json)
- Use `useTranslations` hook in client components
- Server components get locale from `params`
- To add a locale: create JSON file in `i18n/messages/`, add to `i18n/routing.ts` locales array

### Type Definitions
- Core domain types in `types/index.ts`: `Vehicle`, `User`, `FuelEvent`, `MaintenanceRecord`, `Alert`, `Geofence`, `Trip`
- Import via `@/types`

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)

## Key Files

- `lib/theme.ts` - MUI theme with custom gradients and component overrides
- `lib/providers/theme-provider.tsx` - Theme context with SSR hydration handling
- `i18n/routing.ts` - Locale configuration and navigation exports
- `middleware.ts` - next-intl middleware for locale detection
- `types/index.ts` - All TypeScript interfaces for the domain model
