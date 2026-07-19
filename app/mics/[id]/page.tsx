import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound, permanentRedirect } from 'next/navigation';
import { getMic } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';
import { isFreeCost } from '@/lib/utils/isFree';
import { MicDetail } from '@/lib/types/mic';
import {
  buildMicOgImageUrl,
  buildMicPath,
  buildMicUrl,
  isCanonicalMicPathSegment,
  parseMicIdParam,
} from '@/lib/utils/micUrl';
import PageLayout from '@/components/pagelayout/PageLayout';
import MicPage from '@/components/mic/MicPage';
import { jsonLdHtml } from '@/lib/seo/jsonLd';
import { parseTimeOfDay, getNextOccurrence, ASSUMED_DURATION_MS } from '@/lib/utils/nextOccurrence';

const MicIndividualMapLoad = dynamic(() => import('@/components/map/MicIndividualMapLoad'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[250px] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start bg-slate-100 animate-pulse rounded-2xl" />
  ),
});

export const revalidate = 3600;

async function fetchMic(rawId: string): Promise<MicDetail | null> {
  const id = parseMicIdParam(rawId);
  if (!id) return null;
  const raw = await getMic(id);
  if (!raw) return null;
  return serialize(raw) as unknown as MicDetail;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const mic = await fetchMic(id);
  if (!mic) return {};

  const venue = mic.mic_address?.venue ?? '';
  const borough = mic.borough ?? 'NYC';
  const neighborhood = mic.mic_address?.neighborhood;
  const day = mic.day ?? '';
  const locationPhrase = neighborhood ? `${neighborhood}, ${borough}` : borough;
  const title = `${mic.name} — ${borough} Open Mic | OpenMYC`;
  const description = `${mic.name} at ${venue} in ${locationPhrase}. ${day}s. Find details, signup info, cost, and location on OpenMYC.`;

  return {
    title,
    description,
    alternates: { canonical: buildMicUrl(mic) },
    openGraph: {
      title,
      description,
      url: buildMicUrl(mic),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseMicIdParam(rawId);
  if (!id) notFound();

  const raw = await getMic(id);

  if (!raw) {
    notFound();
  }

  const mic = serialize(raw) as unknown as MicDetail;
  if (!isCanonicalMicPathSegment(rawId, mic)) {
    permanentRedirect(buildMicPath(mic));
  }

  const parsedTime = parseTimeOfDay(mic.start_time || '');
  const startDate = getNextOccurrence(mic.day || 'monday', parsedTime);
  const endDate = new Date(new Date(startDate).getTime() + ASSUMED_DURATION_MS).toISOString();

  function normalizePrice(raw: string | null | undefined): string | null {
    if (!raw) return null;
    if (isFreeCost(raw)) return '0';
    const match = raw.match(/\d+(?:\.\d+)?/);
    return match ? match[0] : null;
  }
  const priceValue = normalizePrice(mic.mic_cost?.cost_amount);
  const micUrl = buildMicUrl(mic);

  const dayToSchemaOrg: Record<string, string> = {
    sunday: 'https://schema.org/Sunday',
    monday: 'https://schema.org/Monday',
    tuesday: 'https://schema.org/Tuesday',
    wednesday: 'https://schema.org/Wednesday',
    thursday: 'https://schema.org/Thursday',
    friday: 'https://schema.org/Friday',
    saturday: 'https://schema.org/Saturday',
  };
  const byDay = dayToSchemaOrg[(mic.day || '').toLowerCase()];
  const startTimeNormalized = parsedTime
    ? `${String(parsedTime.hours).padStart(2, '0')}:${String(parsedTime.minutes).padStart(2, '0')}`
    : undefined;
  const isWeekly = (mic.mic_occurrence?.schedule || '').trim().toLowerCase() === 'weekly';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: mic.name,
    description: `Comedy open mic at ${mic.mic_address?.venue ?? 'venue'} in ${mic.mic_address?.neighborhood ?? mic.borough ?? 'NYC'}`,
    url: micUrl,
    image: buildMicOgImageUrl(mic),
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: mic.host_mics?.[0]?.mic_host?.first_host
      ? { '@type': 'Person', name: mic.host_mics[0].mic_host.first_host, url: micUrl }
      : { '@type': 'Organization', name: 'OpenMYC', url: 'https://findopenmyc.com' },
    performer: { '@type': 'PerformingGroup', name: 'Open mic comedians' },
    ...(byDay && startTimeNormalized
      ? {
          eventSchedule: {
            '@type': 'Schedule',
            byDay,
            startTime: startTimeNormalized,
            scheduleTimezone: 'America/New_York',
            ...(isWeekly ? { repeatFrequency: 'P1W' } : {}),
          },
        }
      : {}),
    location: {
      '@type': 'Place',
      name: mic.mic_address?.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: mic.mic_address?.street_name,
        addressLocality: 'New York',
        addressRegion: 'NY',
      },
      ...(mic.mic_address?.latitude && mic.mic_address?.longitude
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: mic.mic_address.latitude,
              longitude: mic.mic_address.longitude,
            },
          }
        : {}),
    },
    ...(priceValue !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: priceValue,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: micUrl,
            validFrom: new Date().toISOString(),
          },
        }
      : {}),
  };

  return (
    <PageLayout hasBackButton className="pb-16 bg-[#f6efe4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      <div className="lg:grid lg:grid-cols-[1fr_minmax(360px,40vw)] lg:gap-4 lg:px-4 max-w-7xl mx-auto">
        <MicPage mic={mic} />
        <div className="px-4 lg:px-0 lg:py-6">
          <MicIndividualMapLoad mic={mic} />
        </div>
      </div>
    </PageLayout>
  );
}
