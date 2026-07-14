import React, { useState } from 'react';
import { GoogleMap, MarkerF, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { ClubListItem } from '@/lib/services/clubs.service';
import { pinIcon, PIN_BRAND, PIN_FREE } from '@/lib/utils/mapPin';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = { lat: 40.7447, lng: -73.936 };

const ClubMarker = ({ club }: { club: ClubListItem }) => {
  const [open, setOpen] = useState(false);
  return (
    <MarkerF
      onClick={() => setOpen(true)}
      position={{ lat: parseFloat(club.latitude!), lng: parseFloat(club.longitude!) }}
      title={club.name}
      icon={pinIcon(club.micCount > 0 ? PIN_FREE : PIN_BRAND)}
    >
      {open && (
        <InfoWindow onCloseClick={() => setOpen(false)}>
          <>
            <p className="font-semibold">{club.name}</p>
            <p>{club.address}</p>
            {club.micCount > 0 && (
              <p className="text-green-700 font-medium pt-1">
                {club.micCount} open mic{club.micCount === 1 ? '' : 's'} here
              </p>
            )}
            {club.website && (
              <a
                className="underline decoration-dashed hover:decoration-solid flex gap-1 items-center text-blue-600 pt-3"
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
            )}
          </>
        </InfoWindow>
      )}
    </MarkerF>
  );
};

const ClubsMapLoad = ({ clubs }: { clubs: ClubListItem[] }) => {
  const { isLoaded } = useJsApiLoader({
    id: `${process.env.NEXT_PUBLIC_MAP_ID}`,
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
  });

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        {clubs
          .filter((c) => c.latitude && c.longitude)
          .map((c) => (
            <ClubMarker key={c.id} club={c} />
          ))}
      </GoogleMap>
    </div>
  );
};

export default ClubsMapLoad;
