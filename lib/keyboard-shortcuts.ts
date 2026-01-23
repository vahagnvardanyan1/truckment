/**
 * Keyboard Shortcuts Configuration
 * Global keyboard shortcuts for navigation and actions
 */

export interface KeyboardShortcut {
  keys: string;
  label: string;
  description: string;
  category: 'navigation' | 'actions' | 'search' | 'general';
  action: string;
  target?: string;
}

export const shortcuts: KeyboardShortcut[] = [
  // Navigation shortcuts (go to)
  {
    keys: 'g d',
    label: 'Go to Dashboard',
    description: 'Navigate to the dashboard page',
    category: 'navigation',
    action: 'navigate',
    target: '/dashboard',
  },
  {
    keys: 'g v',
    label: 'Go to Vehicles',
    description: 'Navigate to the vehicles page',
    category: 'navigation',
    action: 'navigate',
    target: '/dashboard/vehicles',
  },
  {
    keys: 'g f',
    label: 'Go to Fuel',
    description: 'Navigate to the fuel management page',
    category: 'navigation',
    action: 'navigate',
    target: '/dashboard/fuel',
  },
  {
    keys: 'g m',
    label: 'Go to Maintenance',
    description: 'Navigate to the maintenance page',
    category: 'navigation',
    action: 'navigate',
    target: '/dashboard/maintenance',
  },
  {
    keys: 'g r',
    label: 'Go to Reports',
    description: 'Navigate to the reports page',
    category: 'navigation',
    action: 'navigate',
    target: '/dashboard/reports',
  },
  {
    keys: 'g a',
    label: 'Go to Alerts',
    description: 'Navigate to the alerts page',
    category: 'navigation',
    action: 'navigate',
    target: '/dashboard/alerts',
  },
  {
    keys: 'g s',
    label: 'Go to Settings',
    description: 'Navigate to the settings page',
    category: 'navigation',
    action: 'navigate',
    target: '/dashboard/settings',
  },

  // Search shortcuts
  {
    keys: 'cmd+k',
    label: 'Open Command Palette',
    description: 'Open the command palette for quick actions',
    category: 'search',
    action: 'command-palette',
  },
  {
    keys: '/',
    label: 'Focus Search',
    description: 'Focus the search input',
    category: 'search',
    action: 'focus-search',
  },

  // Action shortcuts
  {
    keys: 'n',
    label: 'New...',
    description: 'Open the new item menu',
    category: 'actions',
    action: 'new-item',
  },
  {
    keys: 'cmd+shift+n',
    label: 'New Vehicle',
    description: 'Add a new vehicle',
    category: 'actions',
    action: 'new-vehicle',
  },

  // General shortcuts
  {
    keys: '?',
    label: 'Show Shortcuts',
    description: 'Show keyboard shortcuts help',
    category: 'general',
    action: 'show-shortcuts',
  },
  {
    keys: 'Escape',
    label: 'Close',
    description: 'Close modal, menu, or cancel action',
    category: 'general',
    action: 'close',
  },
  {
    keys: 'cmd+\\',
    label: 'Toggle Sidebar',
    description: 'Toggle the sidebar visibility',
    category: 'general',
    action: 'toggle-sidebar',
  },
];

// Group shortcuts by category
export function getShortcutsByCategory(): Record<string, KeyboardShortcut[]> {
  return shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>
  );
}

// Get shortcut by action
export function getShortcutByAction(action: string): KeyboardShortcut | undefined {
  return shortcuts.find((s) => s.action === action);
}

// Format shortcut keys for display
export function formatShortcutKeys(keys: string): string {
  return keys
    .replace(/cmd/gi, '⌘')
    .replace(/ctrl/gi, '⌃')
    .replace(/alt/gi, '⌥')
    .replace(/shift/gi, '⇧')
    .replace(/\+/g, '')
    .replace(/\s+/g, ' then ')
    .toUpperCase();
}

// Check if shortcut matches a key combination
export function matchesShortcut(shortcut: KeyboardShortcut, keys: string[]): boolean {
  const shortcutKeys = shortcut.keys.toLowerCase().split(/[\s+]+/);
  if (shortcutKeys.length !== keys.length) return false;
  return shortcutKeys.every((key, index) => key === keys[index].toLowerCase());
}
