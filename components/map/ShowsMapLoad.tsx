import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import ShowInfoMarker from './ShowInfoMarker';
import { ShowListItem } from '@/lib/services/shows.service';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = { lat: 40.7447, lng: -73.936 };

const ShowsMapLoad = ({ shows }: { shows: ShowListItem[] }) => {
  const { isLoaded } = useJsApiLoader({
    id: `${process.env.NEXT_PUBLIC_MAP_ID}`,
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
  });

  if (!isLoaded) {
    return null;
  }

  const pins = shows
    .filter((show) => show.latitude && show.longitude)
    .map((show) => (
      <ShowInfoMarker
        key={show.id}
        latitude={show.latitude!}
        longitude={show.longitude!}
        name={show.name}
        venue={show.venue || ''}
        day={show.day || ''}
        time={show.time_text || ''}
        instagram={show.instagram || ''}
        borough={show.borough}
      />
    ));

  return (
    <div className="flex w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        {pins}
      </GoogleMap>
    </div>
  );
};

export default ShowsMapLoad;
