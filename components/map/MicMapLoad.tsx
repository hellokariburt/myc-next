import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import InfoMarker from './InfoMarker';
import { MicListItem, MicListResponse } from '@/lib/types/mic';
import changeTime from '@/lib/utils/changeTime';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = { lat: 40.7447, lng: -73.936 };

const MicMapLoad = ({ mics, isLoading }: { mics?: MicListResponse; isLoading: boolean }) => {
  const { isLoaded } = useJsApiLoader({
    id: `${process.env.NEXT_PUBLIC_MAP_ID}`,
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
  });

  if (!isLoaded) {
    return null;
  }

  const micPins = mics?.mics
    ?.filter((mic: MicListItem) => mic?.mic_address?.latitude && mic?.mic_address?.longitude)
    .map((mic: MicListItem) => (
      <InfoMarker
        key={mic.id}
        latitude={mic.mic_address!.latitude!}
        longitude={mic.mic_address!.longitude!}
        name={mic.name || ''}
        venue={mic.mic_address!.venue || ''}
        day={mic.day || ''}
        time={changeTime(mic.start_time || '')}
        cost={mic.mic_cost?.cost_amount || 'Free'}
        href={`https://maps.google.com/maps?q=${mic.mic_address!.venue},${mic.mic_address!.unit_number > 0 ? `${mic.mic_address!.unit_number},` : ''}${mic.mic_address!.street_name}+NewYork+NY&hl=es;z=14&amp;output=embed`}
      />
    ));

  return (
    <div className="flex w-full h-[65vh] lg:fixed lg:top-0 lg:right-0 lg:w-[50vw] lg:h-[95vh] pb-16 lg:pb-0">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        {!isLoading && micPins}
      </GoogleMap>
    </div>
  );
};

export default MicMapLoad;