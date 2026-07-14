import React, { useState } from 'react';
import { MarkerF, InfoWindow } from '@react-google-maps/api';
import capitalizeDay from '@/lib/utils/capitalizeDay';

export type ShowInfoMarkerProps = {
  latitude: string;
  longitude: string;
  name: string;
  venue: string;
  day: string;
  time: string;
  instagram: string;
};

const ShowInfoMarker = ({
  latitude,
  longitude,
  name,
  venue,
  day,
  time,
  instagram,
}: ShowInfoMarkerProps) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);

  return (
    <MarkerF
      onClick={() => setInfowindowOpen(true)}
      position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
      title={name}
    >
      {infowindowOpen && (
        <InfoWindow onCloseClick={() => setInfowindowOpen(false)}>
          <>
            <p className="font-semibold">{name}</p>
            <p>{venue}</p>
            <div className="flex flex-row">
              {day && <p className="pr-1">{capitalizeDay(day)}</p>}
              <p className="pr-1">{time}</p>
            </div>
            {instagram && (
              <a
                className="underline decoration-dashed hover:decoration-solid flex gap-1 items-center text-blue-600 pt-3"
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{instagram}
              </a>
            )}
          </>
        </InfoWindow>
      )}
    </MarkerF>
  );
};

export default ShowInfoMarker;
