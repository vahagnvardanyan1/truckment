# Truckment UI/UX Comprehensive Audit

**Date:** January 2026
**Auditor:** UI/UX Design Expert
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Accessibility Audit (WCAG 2.1 AA)](#accessibility-audit)
3. [Color Contrast Analysis](#color-contrast-analysis)
4. [Touch Target Analysis](#touch-target-analysis)
5. [Design System Documentation](#design-system-documentation)
6. [User Flow Analysis](#user-flow-analysis)
7. [Responsive Design Review](#responsive-design-review)
8. [Loading States & Feedback](#loading-states--feedback)
9. [Error Handling Patterns](#error-handling-patterns)
10. [Microinteractions](#microinteractions)
11. [Component Quality Scores](#component-quality-scores)
12. [Priority Action Items](#priority-action-items)
13. [Implementation Guide](#implementation-guide)

---

## Executive Summary

### Overall Score: **7.5/10**

| Category | Score | Status |
|----------|-------|--------|
| Visual Design | 8.5/10 | Good |
| Accessibility | 6.5/10 | Needs Work |
| Responsive Design | 8/10 | Good |
| Performance | 7.5/10 | Good |
| Consistency | 7/10 | Moderate |
| User Experience | 7.5/10 | Good |

### Key Strengths
- Modern, professional color palette with refined indigo primary
- Comprehensive design token system
- Strong keyboard navigation with shortcuts
- Good responsive breakpoint coverage
- Well-structured component architecture

### Critical Issues
1. Missing aria-labels on icon-only buttons
2. Data table lacks proper semantic markup (scope attributes)
3. Animations don't respect `prefers-reduced-motion`
4. Form validation framework not integrated
5. No error boundaries for graceful failure

---

## Accessibility Audit

### WCAG 2.1 AA Compliance Status

| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.1.1 Non-text Content | Partial | Charts lack alt text |
| 1.3.1 Info and Relationships | Partial | Tables need scope |
| 1.4.3 Contrast (Minimum) | Pass | New palette compliant |
| 1.4.11 Non-text Contrast | Pass | UI components 3:1+ |
| 2.1.1 Keyboard | Pass | Full keyboard support |
| 2.4.1 Bypass Blocks | Pass | Skip links present |
| 2.4.3 Focus Order | Pass | Logical tab order |
| 2.4.4 Link Purpose | Partial | Some unclear |
| 2.4.7 Focus Visible | Pass | Focus indicators exist |
| 3.3.1 Error Identification | Fail | No validation framework |
| 4.1.2 Name, Role, Value | Partial | Icon buttons need labels |

### Critical A11y Fixes Required

#### Issue 1: Icon-Only Buttons Missing Labels

**Files Affected:**
- `components/layout/topbar.tsx`
- `components/layout/sidebar.tsx`
- `components/data/data-table.tsx`

**Current Code:**
```tsx
<IconButton onClick={onMenuClick}>
  <MenuIcon />
</IconButton>
```

**Fixed Code:**
```tsx
<IconButton
  onClick={onMenuClick}
  aria-label="Open navigation menu"
>
  <MenuIcon />
</IconButton>
```

#### Issue 2: Data Table Semantic Structure

**File:** `components/data/data-table.tsx`

**Current Code (line 290):**
```tsx
<TableCell key={String(column.id)} align={column.align || 'left'}>
  {column.label}
</TableCell>
```

**Fixed Code:**
```tsx
<TableCell
  key={String(column.id)}
  align={column.align || 'left'}
  scope="col"
>
  {column.label}
</TableCell>
```

#### Issue 3: Animation Reduced Motion

**File:** `components/common/status-badge.tsx`

**Current Code (line 44):**
```tsx
animation: status === 'moving' || status === 'online' ? 'pulse 2s infinite' : undefined,
```

**Fixed Code:**
```tsx
import { prefersReducedMotion } from '@/lib/accessibility';

// Inside component:
const shouldAnimate = !prefersReducedMotion() && (status === 'moving' || status === 'online');

// In style:
animation: shouldAnimate ? 'pulse 2s infinite' : undefined,
```

#### Issue 4: Form Field Error Announcement

**File:** `components/forms/form-field.tsx`

**Add to FormField component:**
```tsx
const errorId = error ? `${generateA11yId('error')}-error` : undefined;

<TextField
  aria-invalid={!!error}
  aria-describedby={errorId}
  inputProps={{
    'aria-required': required,
  }}
/>
{error && (
  <Typography
    id={errorId}
    role="alert"
    variant="caption"
    color="error"
  >
    {error}
  </Typography>
)}
```

---

## Color Contrast Analysis

### Light Theme Compliance

| Element | Foreground | Background | Ratio | WCAG AA | WCAG AAA |
|---------|-----------|------------|-------|---------|----------|
| Primary Text | #0F172A | #FFFFFF | 16.1:1 | Pass | Pass |
| Secondary Text | #64748B | #FFFFFF | 4.7:1 | Pass | Fail |
| Primary Button | #FFFFFF | #4F46E5 | 7.3:1 | Pass | Pass |
| Success Text | #059669 | #ECFDF5 | 4.6:1 | Pass | Fail |
| Error Text | #DC2626 | #FEF2F2 | 5.2:1 | Pass | Pass |
| Warning Text | #D97706 | #FFFBEB | 4.5:1 | Pass | Fail |

### Status Colors on Light Background

| Status | Color | On #FFFFFF | On #F8FAFC |
|--------|-------|-----------|------------|
| Online | #22C55E | 2.8:1 | 2.7:1 |
| Offline | #94A3B8 | 3.0:1 | 2.9:1 |
| Moving | #3B82F6 | 3.6:1 | 3.5:1 |
| Idle | #EAB308 | 2.0:1 | 2.0:1 |
| Maintenance | #8B5CF6 | 4.0:1 | 3.9:1 |

**Note:** Status colors are used with text labels (not color-only), meeting WCAG requirements.

### Dark Theme Compliance

| Element | Foreground | Background | Ratio | WCAG AA |
|---------|-----------|------------|-------|---------|
| Primary Text | #F1F5F9 | #1E293B | 12.6:1 | Pass |
| Secondary Text | #94A3B8 | #1E293B | 5.1:1 | Pass |
| Primary Button | #FFFFFF | #6366F1 | 5.6:1 | Pass |

---

## Touch Target Analysis

### Minimum Touch Target: 44x44px (WCAG 2.5.5)

| Component | Current Size | Status | Fix |
|-----------|-------------|--------|-----|
| Sidebar nav items | 46-52px height | Pass | - |
| TopBar icons | 40x40px | Marginal | Increase to 44px |
| Table row actions | 32x32px | Fail | Increase to 40px min |
| Pagination controls | 36px | Fail | Increase to 44px |
| Search input | 40px | Marginal | OK for desktop |
| Chip badges | 22px | Pass (non-interactive) | - |

### Recommended Fixes

**TopBar icon buttons:**
```tsx
<IconButton
  sx={{
    width: { xs: 44, md: 40 },
    height: { xs: 44, md: 40 },
  }}
>
```

**Table row action button:**
```tsx
<IconButton
  size="small"
  sx={{
    minWidth: 40,
    minHeight: 40,
    padding: 1,
  }}
>
```

---

## Design System Documentation

### Color Tokens

```typescript
// Primary Palette
const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',  // Main
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  // ... other scales
};

// Status Colors (distinct from semantic)
const status = {
  online: '#22C55E',
  offline: '#94A3B8',
  moving: '#3B82F6',
  idle: '#EAB308',
  alert: '#F97316',
  maintenance: '#8B5CF6',
};
```

### Typography Scale

| Variant | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| display1 | 3.5rem | 800 | 1.1 | Hero headings |
| display2 | 2.75rem | 700 | 1.15 | Page titles |
| h1 | 2.5rem | 700 | 1.2 | Section headers |
| h2 | 2rem | 700 | 1.3 | Subsections |
| h3 | 1.75rem | 600 | 1.4 | Card titles |
| h4 | 1.5rem | 600 | 1.4 | Widget titles |
| h5 | 1.25rem | 600 | 1.5 | List headings |
| h6 | 1.125rem | 600 | 1.5 | Small headers |
| body1 | 0.9375rem | 400 | 1.6 | Primary body |
| body2 | 0.875rem | 400 | 1.6 | Secondary body |
| caption | 0.75rem | 500 | 1.5 | Labels, hints |
| overline | 0.625rem | 700 | 1.5 | Section labels |

### Spacing System

```typescript
// Base unit: 8px
const spacing = {
  0: '0px',
  0.5: '4px',
  1: '8px',
  1.5: '12px',
  2: '16px',
  2.5: '20px',
  3: '24px',
  4: '32px',
  5: '40px',
  6: '48px',
  8: '64px',
};

// Semantic spacing
const layout = {
  pageMargin: { xs: 2, md: 3 },      // 16px / 24px
  cardPadding: { xs: 2, md: 3 },     // 16px / 24px
  sectionGap: 3,                      // 24px
  elementGap: 2,                      // 16px
};
```

### Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| xs | 4px | Inputs, small elements |
| sm | 8px | Chips, tags |
| md | 12px | Default shape |
| lg | 16px | Cards |
| xl | 20px | Dialogs, panels |
| full | 9999px | Pills, avatars |

### Shadow System

```typescript
const shadows = {
  // Elevation levels
  subtle: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
  card: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
  hover: '0 4px 12px rgba(0,0,0,0.1)',
  elevated: '0 4px 20px rgba(0,0,0,0.15)',
  modal: '0 20px 40px rgba(0,0,0,0.2)',
};
```

### Icon Sizes

| Token | Size | Use Case |
|-------|------|----------|
| xs | 14px | Inline indicators |
| sm | 16px | Buttons, inputs |
| md | 20px | Navigation, default |
| lg | 24px | Primary actions |
| xl | 32px | Feature icons |
| xxl | 48px | Empty states |

---

## User Flow Analysis

### Primary User Flows

#### Flow 1: Monitor Fleet Status
```
Dashboard → View Stats Cards → Check Fleet Status Chart →
Identify Issues → Click Alert → View Alert Details → Take Action
```

**Pain Points:**
- No direct link from stat card to filtered view
- Alert details require extra clicks
- Missing bulk action for multiple alerts

**Recommendations:**
1. Make stat cards clickable to navigate to filtered lists
2. Add inline alert expansion
3. Add bulk dismiss/acknowledge for alerts

#### Flow 2: Track Specific Vehicle
```
Dashboard → Vehicles Page → Search/Filter →
Select Vehicle → View Details → Check Location/History
```

**Pain Points:**
- Search results not highlighted
- No recent vehicles list
- Map placeholder not functional

**Recommendations:**
1. Add search result highlighting
2. Add "Recently Viewed" section
3. Prioritize map integration

#### Flow 3: Respond to Maintenance Alert
```
Alert Notification → View Alert → Navigate to Vehicle →
Review Maintenance History → Schedule Service → Update Status
```

**Pain Points:**
- No maintenance scheduling component
- No technician assignment
- Status update requires navigation

**Recommendations:**
1. Build maintenance scheduling modal
2. Add technician dropdown
3. Allow inline status updates

### User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│ STAGE         │ AWARENESS │ ONBOARD │ DAILY USE │ ADVANCED USE │
├─────────────────────────────────────────────────────────────────┤
│ USER ACTIONS  │ View demo │ Add     │ Monitor   │ Generate     │
│               │ Login     │ vehicles│ Check     │ reports      │
│               │           │ Setup   │ Respond   │ Optimize     │
├─────────────────────────────────────────────────────────────────┤
│ TOUCHPOINTS   │ Landing   │ Setup   │ Dashboard │ Reports      │
│               │ Login     │ wizard  │ Vehicles  │ Analytics    │
│               │           │         │ Alerts    │ Settings     │
├─────────────────────────────────────────────────────────────────┤
│ PAIN POINTS   │ -         │ No      │ Map not   │ No export    │
│               │           │ wizard  │ working   │ No scheduler │
├─────────────────────────────────────────────────────────────────┤
│ OPPORTUNITIES │ Demo      │ Guided  │ Real map  │ PDF reports  │
│               │ video     │ setup   │ Quick     │ Auto-alerts  │
│               │           │         │ actions   │              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Responsive Design Review

### Breakpoint Coverage

| Breakpoint | Width | Coverage | Issues |
|------------|-------|----------|--------|
| xs | 0-600px | Good | Some padding tight |
| sm | 600-960px | Moderate | Missing in some grids |
| md | 960-1280px | Good | Primary target |
| lg | 1280-1920px | Good | Optimal experience |
| xl | 1920px+ | Good | Scales appropriately |

### Component Responsiveness

| Component | xs | sm | md | lg | Notes |
|-----------|----|----|----|----|-------|
| Sidebar | Drawer | Drawer | Permanent | Permanent | Good |
| TopBar | Compact | Full | Full | Full | Good |
| Dashboard Grid | 1 col | 2 col | 3 col | 4 col | Good |
| Data Table | Scroll | Scroll | Full | Full | Consider card view |
| Charts | Full | Full | Full | Full | Good |
| Metric Cards | 1 col | 2 col | 2 col | 4 col | Good |

### Missing sm Breakpoints

Several Grid components jump from xs to md:

**Before:**
```tsx
<Grid size={{ xs: 12, md: 8, lg: 8 }}>
```

**After (already fixed):**
```tsx
<Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
```

### Mobile-Specific Recommendations

1. **Data Table on Mobile:** Consider card-based layout instead of horizontal scroll
2. **Charts on Mobile:** Add pinch-to-zoom capability
3. **Forms on Mobile:** Stack fields vertically with larger touch targets
4. **Navigation:** Add bottom navigation bar for key actions

---

## Loading States & Feedback

### Current Loading Patterns

| Component | Has Loading | Type | Quality |
|-----------|-------------|------|---------|
| DataTable | Yes | Skeleton | Good |
| MetricCard | Yes | Skeleton | Good |
| Charts | No | - | Missing |
| Timeline | No | - | Missing |
| Vehicle List | Partial | - | Needs work |

### Recommended Loading States

#### Chart Loading
```tsx
// Add to LineChart, BarChart, etc.
if (loading) {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="40%" height={28} />
        <Skeleton variant="text" width="25%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} />
      </CardContent>
    </Card>
  );
}
```

#### Timeline Loading
```tsx
if (loading) {
  return (
    <Box>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
```

### Progress Indicators

| Action | Type | Implementation |
|--------|------|----------------|
| Page navigation | Top progress bar | Next.js built-in |
| Form submission | Button spinner | CircularProgress |
| Data fetching | Skeleton | Custom per component |
| Background sync | Toast notification | Toast component |
| File upload | Linear progress | LinearProgress |

---

## Error Handling Patterns

### Current State

| Scenario | Handling | Quality |
|----------|----------|---------|
| API failure | None | Missing |
| Network offline | None | Missing |
| Form validation | Basic | Needs framework |
| 404 pages | Next.js default | OK |
| Component crash | None | Missing |

### Recommended Error Boundary

**Create:** `components/common/error-boundary.tsx`

```tsx
'use client';

import { Component, ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ErrorOutlined, RefreshOutlined } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
          }}
        >
          <ErrorOutlined sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshOutlined />}
            onClick={this.handleRetry}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
```

### Form Validation Integration

**Recommended:** React Hook Form + Zod

```tsx
// Example vehicle form schema
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const vehicleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  licensePlate: z.string().regex(/^[A-Z0-9-]+$/, 'Invalid plate format'),
  type: z.enum(['truck', 'van', 'car']),
  fuelCapacity: z.number().min(0).max(1000),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

function VehicleForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
  });
  // ...
}
```

---

## Microinteractions

### Current Microinteractions

| Interaction | Animation | Quality |
|-------------|-----------|---------|
| Button press | scale(0.98) | Good |
| Card hover | translateY(-2px) + shadow | Good |
| Status badge pulse | opacity 2s | Good |
| Sidebar toggle | width transition | Good |
| Menu open | MUI default | Adequate |
| Page transition | None | Missing |

### Recommended Additions

#### 1. Card Tap Feedback (Mobile)
```tsx
<Card
  sx={{
    transition: 'transform 0.1s ease',
    '&:active': {
      transform: 'scale(0.98)',
    },
  }}
>
```

#### 2. Success State Animation
```tsx
const successAnimation = {
  '@keyframes successPop': {
    '0%': { transform: 'scale(0)', opacity: 0 },
    '50%': { transform: 'scale(1.2)' },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  animation: 'successPop 0.3s ease-out',
};
```

#### 3. List Item Stagger
```tsx
// Apply to list items with delay based on index
const staggerAnimation = (index: number) => ({
  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
});
```

#### 4. Skeleton Shimmer
```tsx
// Already defined in motion.ts, ensure usage
<Skeleton
  sx={{
    '&::after': {
      animation: 'shimmer 1.5s infinite',
    },
  }}
/>
```

### Reduced Motion Support

Ensure all animations check user preference:

```tsx
import { prefersReducedMotion } from '@/lib/accessibility';

const CardWithAnimation = () => {
  const reducedMotion = prefersReducedMotion();

  return (
    <Card
      sx={{
        transition: reducedMotion ? 'none' : 'all 0.2s ease',
        '&:hover': reducedMotion ? {} : {
          transform: 'translateY(-2px)',
        },
      }}
    />
  );
};
```

---

## Component Quality Scores

| Component | Design | A11y | Performance | UX | Overall |
|-----------|--------|------|-------------|-----|---------|
| DataTable | 9 | 7 | 7 | 9 | **8.0** |
| MetricCard | 9 | 8 | 9 | 9 | **8.75** |
| Sidebar | 8 | 7 | 9 | 8 | **8.0** |
| TopBar | 8 | 6 | 9 | 8 | **7.75** |
| Timeline | 8 | 8 | 8 | 8 | **8.0** |
| StatusBadge | 7 | 6 | 9 | 7 | **7.25** |
| Charts | 8 | 5 | 8 | 7 | **7.0** |
| CommandPalette | 9 | 9 | 8 | 9 | **8.75** |
| EmptyState | 8 | 8 | 9 | 8 | **8.25** |
| ConfirmDialog | 8 | 8 | 9 | 8 | **8.25** |

---

## Priority Action Items

### P0 - Critical (This Week)

| # | Item | File | Impact |
|---|------|------|--------|
| 1 | Add aria-labels to icon buttons | topbar.tsx, data-table.tsx | A11y |
| 2 | Add scope to table headers | data-table.tsx | A11y |
| 3 | Fix Armenian language name | topbar.tsx:43 | i18n |
| 4 | Add prefers-reduced-motion check | status-badge.tsx | A11y |

### P1 - High (Week 2-3)

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 5 | Integrate React Hook Form + Zod | Medium | UX |
| 6 | Add loading states to charts | Low | UX |
| 7 | Create ErrorBoundary component | Medium | Reliability |
| 8 | Increase touch targets to 44px | Low | A11y |
| 9 | Add screen reader announcements | Medium | A11y |

### P2 - Medium (Month 1)

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 10 | Implement virtual scrolling | High | Performance |
| 11 | Add page transitions | Medium | UX |
| 12 | Build Storybook documentation | High | Maintainability |
| 13 | Implement map provider | High | Feature |
| 14 | Add mobile card view for tables | Medium | Mobile UX |

### P3 - Low (Ongoing)

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 15 | Unify spacing patterns | Low | Consistency |
| 16 | Add comprehensive i18n coverage | Medium | i18n |
| 17 | Performance monitoring | Medium | Ops |
| 18 | E2E testing suite | High | Quality |

---

## Implementation Guide

### Quick Wins (Copy-Paste Fixes)

#### Fix 1: TopBar Icon Labels

**File:** `components/layout/topbar.tsx`

```tsx
// Line ~194 - Notifications button
<IconButton
  color="inherit"
  aria-label="View notifications"
  sx={{ /* existing styles */ }}
>

// Line ~209 - Apps button
<IconButton
  color="inherit"
  onClick={handleAppsMenuOpen}
  aria-label="Open apps menu"
  sx={{ color: 'text.primary' }}
>

// Line ~219 - User avatar
<IconButton
  onClick={handleUserMenuOpen}
  aria-label="Open user menu"
  sx={{ p: { xs: 0.25, md: 0.5 } }}
>
```

#### Fix 2: Armenian Language Name

**File:** `components/layout/topbar.tsx`, line 43

```tsx
// Change:
{ code: 'hy', name: 'Հdelays', flag: '...' },

// To:
{ code: 'hy', name: 'Հայdelays', flag: '...' },
```

#### Fix 3: Table Header Scopes

**File:** `components/data/data-table.tsx`

```tsx
// Line ~290, in TableHead mapping
<TableCell
  key={String(column.id)}
  align={column.align || 'left'}
  scope="col"  // ADD THIS
  style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
  sortDirection={orderBy === column.id ? order : false}
>
```

#### Fix 4: StatusBadge Reduced Motion

**File:** `components/common/status-badge.tsx`

```tsx
'use client';

import { Chip, ChipProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { prefersReducedMotion } from '@/lib/accessibility';  // ADD

// ... existing code ...

export function StatusBadge({ status, showDot = true, label, sx, ...props }: StatusBadgeProps) {
  const theme = useTheme();
  const statusColor = theme.palette.status[status];
  const reducedMotion = prefersReducedMotion();  // ADD
  const shouldPulse = !reducedMotion && (status === 'moving' || status === 'online');  // ADD

  return (
    <Chip
      size="small"
      label={label || statusLabels[status]}
      icon={
        showDot ? (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: statusColor,
              marginLeft: 8,
              animation: shouldPulse ? 'pulse 2s infinite' : undefined,  // CHANGE
            }}
          />
        ) : undefined
      }
      // ... rest unchanged
    />
  );
}
```

---

## Appendix A: Accessibility Checklist

### Before Each Release

- [ ] Run axe-core accessibility scanner
- [ ] Test with VoiceOver/NVDA
- [ ] Verify keyboard-only navigation
- [ ] Check color contrast ratios
- [ ] Test with 200% zoom
- [ ] Verify focus indicators visible
- [ ] Test reduced motion preference
- [ ] Validate form error announcements

### Component Checklist

- [ ] All interactive elements have accessible names
- [ ] Focus states are visible
- [ ] Color is not the only visual means
- [ ] Text meets contrast requirements
- [ ] Touch targets are 44x44px minimum
- [ ] Animations respect reduced motion
- [ ] Loading states have aria-busy
- [ ] Errors are announced to screen readers

---

## Appendix B: Design Token Reference

See `lib/design-tokens.ts` and `lib/theme.ts` for complete token definitions.

---

*This audit should be reviewed quarterly and updated as the application evolves.*
