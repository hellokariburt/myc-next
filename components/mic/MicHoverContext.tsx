'use client';

import { createContext, useContext, useState } from 'react';

/** Shared hover state so a list card and its map marker can highlight each
 * other. Defaults to a no-op so cards/markers rendered outside a provider
 * (stories, other listing surfaces) still work. */
type HoverState = { hoveredId: number | null; setHoveredId: (id: number | null) => void };

const MicHoverContext = createContext<HoverState>({ hoveredId: null, setHoveredId: () => {} });

export function MicHoverProvider({ children }: { children: React.ReactNode }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  return (
    <MicHoverContext.Provider value={{ hoveredId, setHoveredId }}>
      {children}
    </MicHoverContext.Provider>
  );
}

export const useMicHover = () => useContext(MicHoverContext);
