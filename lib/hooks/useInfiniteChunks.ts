'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Progressive rendering for long client-side lists: show the first `chunk`
 * items and grow the window whenever the sentinel nears the viewport.
 * Resets when the item list changes (e.g. filters).
 */
export function useInfiniteChunks<T>(items: T[], chunk = 24) {
  const [count, setCount] = useState(chunk);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(chunk);
  }, [items, chunk]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || count >= items.length) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(items.length, c + chunk));
        }
      },
      { rootMargin: '800px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [items, count, chunk]);

  return {
    visible: items.slice(0, count),
    done: count >= items.length,
    sentinelRef,
  };
}
