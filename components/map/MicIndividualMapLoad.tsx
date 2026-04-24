'use client';

import { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import changeTime from '@/lib/utils/changeTime';
import InfoMarker from './InfoMarker';

const MicIndividualMapLoad = ({ mic }: { mic: any }) => {
  const [expanded, setExpanded] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: `${process.env.NEXT_PUBLIC_MAP_ID}`,
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
  });

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  if (!mic) {
    return <></>;
  }

  const micLat = mic.mic_address?.latitude;
  const micLong = mic.mic_address?.longitude;

  if (!micLat || !micLong) {
    return <></>;
  }

  const position = { lat: Number(micLat), lng: Number(micLong) };

  return isLoaded ? (
    <>
      <div
        className={`flex w-[100vw] top-auto lg:fixed lg:top-0 lg:right-0 lg:w-[50vw] lg:h-[95vh] lg:pb-0 ${
          expanded ? 'h-[65vh] pb-16' : 'h-[250px] pb-4'
        }`}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={12}>
          <InfoMarker
            latitude={mic.mic_address.latitude}
            longitude={mic.mic_address.longitude}
            name={mic.name}
            venue={mic.mic_address.venue}
            day={mic.day}
            time={changeTime(mic.start_time)}
            cost={mic.cost_id === 1 ? 'Free' : mic.mic_cost.cost_amount}
            href={`https://maps.google.com/maps?q=${mic.mic_address.venue},${mic.mic_address.unit_number},${mic.mic_address.street_name}+NewYork+NY&hl=es;z=14&amp;output=embed`}
          />
        </GoogleMap>
      </div>
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="lg:hidden text-blue-600 hover:text-blue-800 text-sm font-semibold py-2 underline underline-offset-2"
        >
          Expand map
        </button>
      )}
    </>
  ) : (
    <></>
  );
};

export default MicIndividualMapLoad;
