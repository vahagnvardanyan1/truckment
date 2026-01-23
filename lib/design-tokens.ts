/**
 * Design tokens for consistent sizing and spacing throughout the app.
 * These values complement the MUI theme and provide additional standardization.
 */

export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,  // Empty states
} as const;

export const spacing = {
  section: 3,     // Between major sections (24px at default spacing)
  card: 2,        // Card internal padding
  cardLg: 3,      // Larger card padding
  element: 1,     // Between inline elements
  elementLg: 2,   // Larger element spacing
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  subtle: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
  card: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
  hover: '0 4px 12px rgba(0,0,0,0.1)',
  elevated: '0 4px 20px rgba(0,0,0,0.15)',
} as const;

export type IconSize = keyof typeof iconSizes;
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
