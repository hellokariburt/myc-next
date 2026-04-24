'use client';

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import changeTime from '@/lib/utils/changeTime';
import InfoMarker from './InfoMarker';

const MicIndividualMapLoad = ({ mics }: MicIndividualMapLoadType) => {
  const { isLoaded } = useJsApiLoader({
    id: `${process.env.NEXT_PUBLIC_MAP_ID}`,
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
  });

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  if (!mics?.mic) {
    return <></>;
  }

  const micLat = mics.mic.mic_address?.latitude;
  const micLong = mics.mic.mic_address?.longitude;

  if (!micLat || !micLong) {
    return <></>;
  }

  const position = { lat: Number(micLat), lng: Number(micLong) };

  return isLoaded ? (
    <div className="flex w-[100vw] top-auto  h-[65vh] lg:fixed lg:top-0 lg:right-0 lg:w-[50vw] lg:h-[95vh] pb-16 lg:pb-0">
      <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={12}>
        <InfoMarker
          latitude={mics.mic?.mic_address.latitude}
          longitude={mics.mic?.mic_address.longitude}
          name={mics.mic?.name}
          venue={mics?.mic.mic_address.venue}
          day={mics.mic?.day}
          time={changeTime(mics.mic?.start_time)}
          cost={mics.mic?.cost_id === 1 ? 'Free' : mics.mic?.mic_cost.cost_amount}
          href={`https://maps.google.com/maps?q=${mics?.mic.mic_address.venue},${mics?.mic.mic_address.unit_number},${mics?.mic.mic_address.street_name}+NewYork+NY&hl=es;z=14&amp;output=embed`}
        />
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default MicIndividualMapLoad;

export type MicIndividualMapLoadType = {
  mics: any;
};
