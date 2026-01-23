'use client';

import { useEffect, useCallback, useRef } from 'react';

type KeyModifier = 'ctrl' | 'alt' | 'shift' | 'meta' | 'cmd';
type KeyCallback = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  modifiers?: KeyModifier[];
  preventDefault?: boolean;
  enableOnInput?: boolean;
  enabled?: boolean;
}

function parseShortcut(shortcut: string): { key: string; modifiers: KeyModifier[] } {
  const parts = shortcut.toLowerCase().split('+');
  const modifiers: KeyModifier[] = [];
  let key = '';

  parts.forEach((part) => {
    const trimmed = part.trim();
    if (['ctrl', 'alt', 'shift', 'meta', 'cmd'].includes(trimmed)) {
      modifiers.push(trimmed === 'cmd' ? 'meta' : (trimmed as KeyModifier));
    } else {
      key = trimmed;
    }
  });

  return { key, modifiers };
}

function matchesModifiers(event: KeyboardEvent, modifiers: KeyModifier[]): boolean {
  const required = {
    ctrl: modifiers.includes('ctrl'),
    alt: modifiers.includes('alt'),
    shift: modifiers.includes('shift'),
    meta: modifiers.includes('meta') || modifiers.includes('cmd'),
  };

  return (
    event.ctrlKey === required.ctrl &&
    event.altKey === required.alt &&
    event.shiftKey === required.shift &&
    event.metaKey === required.meta
  );
}

function isInputElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    (element as HTMLElement).isContentEditable
  );
}

export function useKeyboardShortcut(
  shortcut: string,
  callback: KeyCallback,
  options: ShortcutOptions = {}
) {
  const {
    modifiers: customModifiers,
    preventDefault = true,
    enableOnInput = false,
    enabled = true,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Skip if focused on input and not enabled for inputs
      if (!enableOnInput && isInputElement(document.activeElement)) {
        return;
      }

      const { key: shortcutKey, modifiers: parsedModifiers } = parseShortcut(shortcut);
      const modifiers = customModifiers || parsedModifiers;

      const pressedKey = event.key.toLowerCase();
      const isMatch =
        pressedKey === shortcutKey && matchesModifiers(event, modifiers);

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callbackRef.current(event);
      }
    },
    [shortcut, customModifiers, preventDefault, enableOnInput, enabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for sequence shortcuts (e.g., "g d" for go to dashboard)
export function useKeyboardSequence(
  sequence: string[],
  callback: KeyCallback,
  options: ShortcutOptions = {}
) {
  const { enableOnInput = false, enabled = true } = options;
  const sequenceIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const resetSequence = useCallback(() => {
    sequenceIndex.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      if (!enableOnInput && isInputElement(document.activeElement)) {
        resetSequence();
        return;
      }

      const pressedKey = event.key.toLowerCase();
      const expectedKey = sequence[sequenceIndex.current]?.toLowerCase();

      if (pressedKey === expectedKey) {
        // Clear previous timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        sequenceIndex.current += 1;

        if (sequenceIndex.current === sequence.length) {
          event.preventDefault();
          callbackRef.current(event);
          resetSequence();
        } else {
          // Reset sequence if next key isn't pressed within 1 second
          timeoutRef.current = setTimeout(resetSequence, 1000);
        }
      } else {
        resetSequence();
      }
    },
    [sequence, enableOnInput, enabled, resetSequence]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);
}

// Combined hook for registering multiple shortcuts
export function useKeyboardShortcuts(
  shortcuts: Record<string, KeyCallback>,
  options: ShortcutOptions = {}
) {
  const { enableOnInput = false, enabled = true, preventDefault = true } = options;
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      if (!enableOnInput && isInputElement(document.activeElement)) {
        return;
      }

      Object.entries(shortcutsRef.current).forEach(([shortcut, callback]) => {
        const { key: shortcutKey, modifiers } = parseShortcut(shortcut);
        const pressedKey = event.key.toLowerCase();

        if (pressedKey === shortcutKey && matchesModifiers(event, modifiers)) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback(event);
        }
      });
    },
    [enableOnInput, enabled, preventDefault]
  );

  useEffect(() => {
    if (Object.keys(shortcuts).length === 0) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, shortcuts]);
}
