import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMic } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';
import { MicDetail } from '@/lib/types/mic';
import PageLayout from '@/components/pagelayout/PageLayout';
import MicPage from '@/components/mic/MicPage';
import MicIndividualMapLoad from '@/components/map/MicIndividualMapLoad';

export const revalidate = 3600;

async function fetchMic(rawId: string): Promise<MicDetail | null> {
  let id: bigint;
  try {
    id = BigInt(rawId);
  } catch {
    return null;
  }
  if (id <= BigInt(0)) return null;
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
  const day = mic.day ?? '';
  const title = `${mic.name} — ${borough} Open Mic | OpenMYC`;
  const description = `${mic.name} at ${venue} in ${borough}. ${day}s. Find details, signup info, cost, and location on OpenMYC.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://findopenmyc.com/mics/${id}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  let id: bigint;
  try {
    id = BigInt(rawId);
  } catch {
    notFound();
  }

  if (id <= BigInt(0)) {
    notFound();
  }

  const raw = await getMic(id);

  if (!raw) {
    notFound();
  }

  const mic = serialize(raw) as unknown as MicDetail;

  function getNextOccurrence(day: string, time: string): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const target = days.indexOf(day.toLowerCase());
    if (target === -1) return new Date().toISOString();
    const now = new Date();
    const diff = (target - now.getDay() + 7) % 7 || 7;
    const next = new Date(now);
    next.setDate(now.getDate() + diff);
    const timeParts = time.match(/^(\d{1,2}):(\d{2})/);
    if (timeParts) {
      next.setHours(parseInt(timeParts[1], 10), parseInt(timeParts[2], 10), 0, 0);
    } else {
      next.setHours(19, 0, 0, 0);
    }
    return next.toISOString();
  }

  const startDate = getNextOccurrence(mic.day || 'monday', mic.start_time || '19:00');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: mic.name,
    description: `Comedy open mic at ${mic.mic_address?.venue ?? 'venue'} in ${mic.borough ?? 'NYC'}`,
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: mic.host_mics?.[0]?.mic_host?.first_host
      ? { '@type': 'Person', name: mic.host_mics[0].mic_host.first_host }
      : undefined,
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
    ...(mic.mic_cost?.cost_amount
      ? {
          offers: {
            '@type': 'Offer',
            price: mic.mic_cost.cost_amount.toLowerCase().includes('free') ? '0' : mic.mic_cost.cost_amount,
            priceCurrency: 'USD',
          },
        }
      : {}),
  };

  return (
    <PageLayout hasBackButton className="pb-16 bg-[#F5F5F5] bg-cover">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MicPage mic={mic} />
      <MicIndividualMapLoad mic={mic} />
    </PageLayout>
  );
}
