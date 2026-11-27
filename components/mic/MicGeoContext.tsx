'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type GeoStatus = 'idle' | 'locating' | 'granted' | 'denied' | 'unsupported';

export interface UserLocation {
  lat: number;
  lng: number;
}

interface MicGeoValue {
  /** The visitor's location once granted, else null. Client-only, never sent to the server. */
  userLocation: UserLocation | null;
  status: GeoStatus;
  /** Prompt for / toggle location. If already granted, this clears it (toggle off). */
  toggleLocation: () => void;
}

const MicGeoContext = createContext<MicGeoValue>({
  userLocation: null,
  status: 'idle',
  toggleLocation: () => {},
});

/**
 * Holds the visitor's location for the "Near me" affordance: the map recenters
 * on it and cards show a distance. Deliberately NOT a URL param — coordinates
 * are precise personal data, so they stay in client memory and are never sent
 * to the server or put in a shareable link.
 */
export function MicGeoProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');

  const toggleLocation = useCallback(() => {
    // Toggle off if we already have a fix.
    if (userLocation) {
      setUserLocation(null);
      setStatus('idle');
      return;
    }
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('granted');
      },
      () => {
        // Permission denied or position unavailable — surface a non-blocking state.
        setStatus('denied');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [userLocation]);

  const value = useMemo(
    () => ({ userLocation, status, toggleLocation }),
    [userLocation, status, toggleLocation]
  );

  return <MicGeoContext.Provider value={value}>{children}</MicGeoContext.Provider>;
}

export function useMicGeo(): MicGeoValue {
  return useContext(MicGeoContext);
}
