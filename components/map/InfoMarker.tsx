import React, { useState } from 'react';
import { MarkerF, InfoWindow } from '@react-google-maps/api';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { pinIcon, PIN_FREE, PIN_PAID, PIN_BRAND } from '@/lib/utils/mapPin';
import { isFreeCost } from '@/lib/utils/isFree';
import { useMicHover } from '../mic/MicHoverContext';

const InfoMarker = ({
  id,
  latitude,
  longitude,
  name,
  day,
  time,
  venue,
  cost,
  href,
  clusterer,
}: InfoMarkerProps) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const { hoveredId, setHoveredId } = useMicHover();
  const highlighted = hoveredId === id;

  return (
    <MarkerF
      clusterer={clusterer}
      onClick={() => setInfowindowOpen(true)}
      onMouseOver={() => setHoveredId(id ?? null)}
      onMouseOut={() => setHoveredId(null)}
      position={{
        lat: parseFloat(`${latitude}`),
        lng: parseFloat(`${longitude}`),
      }}
      title={name}
      // Hovered pin turns brand-blue and jumps above the others. Blue isn't used
      // for cost on the mic map (free=green, paid=amber), so it reads as "this one".
      icon={pinIcon(highlighted ? PIN_BRAND : isFreeCost(cost) ? PIN_FREE : PIN_PAID)}
      zIndex={highlighted ? 999 : undefined}
    >
      {infowindowOpen && (
        <InfoWindow onCloseClick={() => setInfowindowOpen(false)}>
          <>
            <p className="font-semibold">{name}</p>
            <p>{venue}</p>
            <div className="flex flex-row">
              <p className=" pr-1">{capitalizeDay(day)}</p>
              <p className="pr-1">{time}</p>
            </div>
            <p className="font-bold "> {cost}</p>
            <a
              className="underline decoration-dashed hover:decoration-solid flex gap-1 items-center text-blue-600 pt-3"
              href={href}
            >
              Get Directions
            </a>
          </>
        </InfoWindow>
      )}
    </MarkerF>
  );
};

export default InfoMarker;

export type InfoMarkerProps = {
  // Optional: the detail-page map renders a lone marker with no list to sync to.
  id?: number;
  // Optional: on the /mics finder map, markers register with a MarkerClusterer so
  // a dense city map collapses into count bubbles. The single-marker detail map
  // leaves this undefined and renders the pin directly.
  clusterer?: React.ComponentProps<typeof MarkerF>['clusterer'];
  latitude: string | number;
  longitude: string | number;
  name: string;
  day: string;
  time: string;
  venue: string;
  cost: string;
  href: string;
};
