'use client';

import { RefObject, useEffect, useState } from 'react';

/**
 * Tracks which [data-pin] elements inside a container are near the viewport.
 * Returns the set of their data-pin ids — used to keep map pins mirroring
 * the cards the user is actually looking at while they scroll.
 */
export function useInViewIds(containerRef: RefObject<HTMLElement>, dep: unknown): Set<string> {
  const [ids, setIds] = useState<Set<string>>(new Set());

  // Callers pass a freshly-sliced array as `dep` (useInfiniteChunks returns
  // `items.slice(0, count)`), so depending on its identity re-ran this effect
  // on every render. Re-observing fires an initial IntersectionObserver
  // callback, which used to setState unconditionally, which re-rendered, which
  // re-sliced — a self-sustaining loop that pegged the CPU on /clubs.
  //
  // Key off the dep's *contents* rather than its identity. Length alone is not
  // enough: a filter change can swap which items are shown without changing
  // how many, and the effect must re-run then or the observer keeps watching
  // detached nodes.
  const depKey = Array.isArray(dep)
    ? dep.map((item, i) => (item && typeof item === 'object' && 'id' in item ? item.id : i)).join(',')
    : String(dep);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const targets = container.querySelectorAll('[data-pin]');
    if (targets.length === 0) {
      // Same bail-out reasoning as below: only replace an already-empty set
      // if it isn't already empty, or this re-renders on every pass.
      setIds((prev) => (prev.size === 0 ? prev : new Set()));
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
          // Returning a new Set unconditionally defeats React's bail-out, so
          // an observer callback that changed nothing still forced a render.
          if (next.size === prev.size && [...next].every((id) => prev.has(id))) {
            return prev;
          }
          return next;
        });
      },
      { rootMargin: '300px 0px' }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [containerRef, depKey]);

  return ids;
}
