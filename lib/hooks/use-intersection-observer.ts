'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  enabled?: boolean;
}

interface UseIntersectionObserverReturn<T extends Element> {
  ref: RefObject<T>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    enabled = true,
  } = options;

  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;

    const element = ref.current;
    if (!element) return;

    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        setIsIntersecting(observerEntry.isIntersecting);

        if (triggerOnce && observerEntry.isIntersecting) {
          hasTriggered.current = true;
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, triggerOnce, enabled]);

  return { ref: ref as RefObject<T>, isIntersecting, entry };
}

// Hook for lazy loading content
export function useLazyLoad<T extends Element = Element>(
  options: Omit<UseIntersectionObserverOptions, 'triggerOnce'> = {}
) {
  return useIntersectionObserver<T>({
    ...options,
    triggerOnce: true,
    rootMargin: options.rootMargin || '100px',
  });
}

// Hook for infinite scroll
interface UseInfiniteScrollOptions extends UseIntersectionObserverOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
}

export function useInfiniteScroll<T extends Element = Element>(
  options: UseInfiniteScrollOptions
) {
  const { onLoadMore, hasMore, loading = false, ...observerOptions } = options;
  const { ref, isIntersecting } = useIntersectionObserver<T>({
    ...observerOptions,
    enabled: hasMore && !loading,
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, loading, onLoadMore]);

  return { ref, isIntersecting };
}

// Hook for animating elements when they come into view
interface UseAnimateOnScrollOptions extends UseIntersectionObserverOptions {
  animationClass?: string;
}

export function useAnimateOnScroll<T extends HTMLElement = HTMLElement>(
  options: UseAnimateOnScrollOptions = {}
) {
  const { animationClass = 'animate-in', ...observerOptions } = options;
  const { ref, isIntersecting } = useIntersectionObserver<T>({
    ...observerOptions,
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (isIntersecting) {
      element.classList.add(animationClass);
    }
  }, [isIntersecting, animationClass, ref]);

  return { ref, isVisible: isIntersecting };
}
