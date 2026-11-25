import { GoogleMap, MarkerClustererF, useJsApiLoader } from '@react-google-maps/api';
import InfoMarker from './InfoMarker';
import { MicListItem, MicListResponse } from '@/lib/types/mic';
import changeTime from '@/lib/utils/changeTime';

// Default cluster-bubble icons (the classic m1–m5 sprites) are served from this
// Google-hosted path; without it the clusterer renders no bubble art.
const CLUSTER_IMAGE_PATH =
  'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

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

  const geoMics =
    mics?.mics?.filter(
      (mic: MicListItem) => mic?.mic_address?.latitude && mic?.mic_address?.longitude
    ) ?? [];

  return (
    <div className="flex w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        {/* The map now plots the full filtered set (up to MAP_PIN_CAP), so a dense
            unfiltered city view would be an unreadable pin cloud. Cluster nearby
            pins into count bubbles that split apart on zoom. */}
        {!isLoading && (
          <MarkerClustererF options={{ imagePath: CLUSTER_IMAGE_PATH, maxZoom: 15 }}>
            {(clusterer) => (
              <>
                {geoMics.map((mic: MicListItem) => (
                  <InfoMarker
                    key={mic.id}
                    id={mic.id}
                    clusterer={clusterer}
                    latitude={mic.mic_address!.latitude!}
                    longitude={mic.mic_address!.longitude!}
                    name={mic.name || ''}
                    venue={mic.mic_address!.venue || ''}
                    day={mic.day || ''}
                    time={changeTime(mic.start_time || '')}
                    cost={mic.mic_cost?.cost_amount || 'Free'}
                    href={`https://maps.google.com/maps?q=${mic.mic_address!.venue},${
                      mic.mic_address!.unit_number > 0 ? `${mic.mic_address!.unit_number},` : ''
                    }${mic.mic_address!.street_name}+NewYork+NY&z=14&output=embed`}
                  />
                ))}
              </>
            )}
          </MarkerClustererF>
        )}
      </GoogleMap>
    </div>
  );
};

export default MicMapLoad;
