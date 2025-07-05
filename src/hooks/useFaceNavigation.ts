import { useCallback, useRef } from 'react';

interface NavigationOptions {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  debounceMs?: number;
}

export function useFaceNavigation({
  onLeft,
  onRight,
  onUp,
  onDown,
  debounceMs = 1000
}: NavigationOptions = {}) {
  const lastNavigationRef = useRef<number>(0);

  const handleNavigation = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    const now = Date.now();
    if (now - lastNavigationRef.current < debounceMs) return;

    lastNavigationRef.current = now;

    switch (direction) {
      case 'left':
        onLeft?.();
        break;
      case 'right':
        onRight?.();
        break;
      case 'up':
        onUp?.();
        break;
      case 'down':
        onDown?.();
        break;
    }
  }, [onLeft, onRight, onUp, onDown, debounceMs]);

  return { handleNavigation };
}