'use client';

import { RefObject, useEffect, useState } from 'react';

/**
 * Tracks which [data-pin] elements inside a container are near the viewport.
 * Returns the set of their data-pin ids — used to keep map pins mirroring
 * the cards the user is actually looking at while they scroll.
 */
export function useInViewIds(containerRef: RefObject<HTMLElement>, dep: unknown): Set<string> {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const targets = container.querySelectorAll('[data-pin]');
    if (targets.length === 0) {
      setIds(new Set());
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        setIds((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            const id = (e.target as HTMLElement).dataset.pin;
            if (!id) return;
            if (e.isIntersecting) next.add(id);
            else next.delete(id);
          });
          return next;
        });
      },
      { rootMargin: '300px 0px' }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [containerRef, dep]);

  return ids;
}
