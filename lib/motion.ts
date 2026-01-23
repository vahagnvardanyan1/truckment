/**
 * Motion and Animation Design Tokens
 * Consistent animation values for use across the application
 */

export const motion = {
  // Duration in milliseconds
  duration: {
    instant: 50,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
  },

  // Easing functions
  easing: {
    // Standard easing for most animations
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Deceleration curve for elements entering the screen
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    // Acceleration curve for elements leaving the screen
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    // Sharp curve for quick transitions
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    // Spring-like bounce for playful interactions
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// CSS transition shortcuts
export const transitions = {
  // Common transition patterns
  default: `all ${motion.duration.normal}ms ${motion.easing.standard}`,
  fast: `all ${motion.duration.fast}ms ${motion.easing.standard}`,
  slow: `all ${motion.duration.slow}ms ${motion.easing.standard}`,

  // Property-specific transitions
  opacity: `opacity ${motion.duration.normal}ms ${motion.easing.standard}`,
  transform: `transform ${motion.duration.normal}ms ${motion.easing.standard}`,
  background: `background-color ${motion.duration.normal}ms ${motion.easing.standard}`,
  color: `color ${motion.duration.fast}ms ${motion.easing.standard}`,
  boxShadow: `box-shadow ${motion.duration.normal}ms ${motion.easing.standard}`,

  // Enter/exit transitions
  enter: `all ${motion.duration.normal}ms ${motion.easing.enter}`,
  exit: `all ${motion.duration.fast}ms ${motion.easing.exit}`,
} as const;

// Keyframe animation definitions (for use with @keyframes)
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInLeft: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInRight: {
    from: { transform: 'translateX(20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
} as const;

// Animation presets for common use cases
export const animations = {
  // Page/component entrance animations
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: motion.duration.normal / 1000 },
  },
  // Card hover effects
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    transition: transitions.default,
  },
  // Button press effect
  buttonPress: {
    transform: 'scale(0.98)',
    transition: transitions.fast,
  },
  // Skeleton loading shimmer
  skeletonShimmer: {
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
} as const;

// Reduced motion media query helper
export const prefersReducedMotion = '@media (prefers-reduced-motion: reduce)';

// CSS for reduced motion support (apply at global level)
export const reducedMotionStyles = `
  ${prefersReducedMotion} {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
