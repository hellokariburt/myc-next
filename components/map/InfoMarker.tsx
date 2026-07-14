import React, { useState } from 'react';
import { MarkerF, InfoWindow } from '@react-google-maps/api';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { boroughPinIcon } from '@/lib/utils/mapPin';

const InfoMarker = ({
  latitude,
  longitude,
  name,
  day,
  time,
  venue,
  cost,
  href,
  borough,
}: InfoMarkerProps) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);

  return (
    <MarkerF
      onClick={() => setInfowindowOpen(true)}
      position={{
        lat: parseFloat(`${latitude}`),
        lng: parseFloat(`${longitude}`),
      }}
      title={name}
      icon={boroughPinIcon(borough)}
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
  latitude: string | number;
  longitude: string | number;
  name: string;
  day: string;
  time: string;
  venue: string;
  cost: string;
  href: string;
  borough?: string | null;
};
