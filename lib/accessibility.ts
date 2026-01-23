// Accessibility utilities

/**
 * Announces a message to screen readers using a live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(announcer);

  // Need a small delay for the live region to be picked up
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Trap focus within an element (useful for modals)
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Generate unique ID for accessibility purposes
 */
let idCounter = 0;
export function generateA11yId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Get appropriate ARIA label for status
 */
export function getStatusAriaLabel(status: string): string {
  const labels: Record<string, string> = {
    online: 'Vehicle is online and connected',
    offline: 'Vehicle is offline',
    moving: 'Vehicle is currently moving',
    idle: 'Vehicle is idle',
    alert: 'Vehicle has an active alert',
    maintenance: 'Vehicle is in maintenance',
    success: 'Success status',
    warning: 'Warning status',
    error: 'Error status',
    info: 'Information status',
  };
  return labels[status] || `Status: ${status}`;
}

/**
 * Format number for screen reader
 */
export function formatNumberForScreenReader(value: number, unit: string): string {
  return `${value.toLocaleString()} ${unit}`;
}
