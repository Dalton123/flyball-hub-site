"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseScrollAnimationReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isVisible: boolean;
}

// Shared observer registry - reuses observers with the same options
type ObserverCallback = (entry: IntersectionObserverEntry) => void;

interface ObserverEntry {
  observer: IntersectionObserver;
  callbacks: Map<Element, ObserverCallback>;
}

const observerRegistry = new Map<string, ObserverEntry>();

function getObserverKey(threshold: number, rootMargin: string): string {
  return `${threshold}-${rootMargin}`;
}

function getSharedObserver(
  threshold: number,
  rootMargin: string,
  element: Element,
  callback: ObserverCallback
): () => void {
  const key = getObserverKey(threshold, rootMargin);

  let entry = observerRegistry.get(key);

  if (!entry) {
    const observer = new IntersectionObserver(
      (entries) => {
        const registryEntry = observerRegistry.get(key);
        if (!registryEntry) return;

        for (const e of entries) {
          const cb = registryEntry.callbacks.get(e.target);
          if (cb) cb(e);
        }
      },
      { threshold, rootMargin }
    );

    entry = { observer, callbacks: new Map() };
    observerRegistry.set(key, entry);
  }

  entry.callbacks.set(element, callback);
  entry.observer.observe(element);

  // Return cleanup function
  return () => {
    const registryEntry = observerRegistry.get(key);
    if (!registryEntry) return;

    registryEntry.callbacks.delete(element);
    registryEntry.observer.unobserve(element);

    // Clean up observer if no more elements are being observed
    if (registryEntry.callbacks.size === 0) {
      registryEntry.observer.disconnect();
      observerRegistry.delete(key);
    }
  };
}

/**
 * Hook for triggering animations when elements scroll into view.
 * Uses a shared IntersectionObserver registry to reduce memory usage.
 * Respects prefers-reduced-motion for accessibility.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn<T> {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // If user prefers reduced motion, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const isInViewport =
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight * (1 - threshold);

    if (isInViewport) {
      setIsVisible(true);
      if (triggerOnce) return; // Don't need observer if already visible and triggerOnce
    }

    // Use shared observer instead of creating a new one
    const cleanup = getSharedObserver(threshold, rootMargin, element, (entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (triggerOnce) {
          cleanup();
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    });

    return cleanup;
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  return { ref, isVisible };
}

/**
 * Hook for staggered animations on multiple children.
 * Uses shared IntersectionObserver registry to reduce memory usage.
 * Returns refs and visibility states for each child.
 */
export function useStaggeredAnimation(
  count: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...scrollOptions } = options;
  const threshold = scrollOptions.threshold ?? 0.1;
  const rootMargin = scrollOptions.rootMargin ?? "0px";
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    Array(count).fill(false)
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleItems(Array(count).fill(true));
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Use shared observer instead of creating a new one
    const cleanup = getSharedObserver(threshold, rootMargin, container, (entry) => {
      if (entry.isIntersecting) {
        // Stagger the visibility of each item
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            setVisibleItems((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, i * staggerDelay);
        }
        cleanup();
      }
    });

    return cleanup;
  }, [count, staggerDelay, threshold, rootMargin, prefersReducedMotion]);

  return { containerRef, visibleItems };
}
