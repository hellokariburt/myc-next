'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Horizontally scrolling row that fades whichever edge has content past it,
 * so an overflowing pill row reads as scrollable instead of as a list that
 * ends at the screen edge.
 *
 * Uses mask-image rather than a gradient overlay because the listing page sits
 * on a non-white background — a mask fades to whatever is actually behind the
 * row, so it can't drift out of sync with the page background.
 *
 * Self-disabling above `sm`: the row switches to flex-wrap there, so nothing
 * overflows, `overflowing` goes false, and no mask is applied.
 */
export default function ScrollRow({
  children,
  className = '',
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true, overflowing: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const overflowing = el.scrollWidth > el.clientWidth + 1;
    setEdges({
      overflowing,
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    // Catches both viewport resizes and the row's own content changing
    // (boroughs with zero mics get filtered out after counts arrive).
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, children]);

  const fadeStart = edges.overflowing && !edges.atStart;
  const fadeEnd = edges.overflowing && !edges.atEnd;
  const mask =
    fadeStart || fadeEnd
      ? `linear-gradient(to right, ${
          fadeStart ? 'transparent 0, black 2rem' : 'black 0'
        }, ${fadeEnd ? 'black calc(100% - 2rem), transparent 100%' : 'black 100%'})`
      : undefined;

  return (
    <div
      ref={ref}
      onScroll={measure}
      className={`flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible ${className}`}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
