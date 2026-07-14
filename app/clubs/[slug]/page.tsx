import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/pagelayout/PageLayout';
import MicListCard from '@/components/mic/MicListCard';
import ShowCard from '@/components/shows/ShowCard';
import ClubsMapSection from '@/components/clubs/ClubsMapSection';
import {
  getClubs,
  getMicsAtClub,
  clubSlug,
  venueMatchesClub,
  ClubListItem,
} from '@/lib/services/clubs.service';
import { getShows, ShowListItem } from '@/lib/services/shows.service';
import { serialize } from '@/lib/utils/serialize';
import { MicListItem } from '@/lib/types/mic';
import {
  getBoroughBadgeClasses,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';

export const revalidate = 3600;

async function getClub(slug: string): Promise<ClubListItem | null> {
  const clubs = await getClubs();
  return clubs.find((c) => clubSlug(c.name) === slug) || null;
}

export async function generateStaticParams() {
  const clubs = await getClubs();
  return clubs.map((c) => ({ slug: clubSlug(c.name) }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const club = await getClub(params.slug);
  if (!club) return {};
  const title = `${club.name} | NYC Comedy Clubs | OpenMYC`;
  const description =
    club.description ||
    `${club.name}, a comedy club at ${club.address}, New York — shows, open mics, and info.`;
  return {
    title,
    description,
    alternates: { canonical: `https://findopenmyc.com/clubs/${params.slug}` },
    openGraph: { title: club.name, description, url: `https://findopenmyc.com/clubs/${params.slug}` },
  };
}

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const club = await getClub(params.slug);
  if (!club) notFound();

  const [allShows, micsAtClub] = await Promise.all([getShows(), getMicsAtClub(club.name)]);
  const shows: ShowListItem[] = allShows.filter((s) => venueMatchesClub(s.venue, club.name));
  // serialize() converts BigInt ids to numbers at runtime; cast reflects that
  const mics = serialize(micsAtClub) as unknown as MicListItem[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ComedyClub',
    name: club.name,
    url: club.website || undefined,
    image: club.image ? `https://findopenmyc.com${club.image}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.address || undefined,
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: club.zipcode || undefined,
    },
    geo:
      club.latitude && club.longitude
        ? { '@type': 'GeoCoordinates', latitude: club.latitude, longitude: club.longitude }
        : undefined,
  };

  return (
    <PageLayout className="bg-[#f6efe4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <nav className="text-sm text-slate-500">
          <Link href="/clubs" className="underline decoration-dashed hover:decoration-solid">
            ← All comedy clubs
          </Link>
        </nav>

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-6 lg:items-start">
          <div>
            {club.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={club.image}
                alt={`${club.name}`}
                className="w-full max-h-80 object-cover rounded-2xl border border-slate-200 shadow-sm bg-slate-100"
              />
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                {club.name}
              </h1>
              {club.borough && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBoroughBadgeClasses(club.borough)}`}
                >
                  {getBoroughDisplayShort(club.borough)}
                </span>
              )}
            </div>
            <p className="mt-2 text-lg text-slate-600">
              {club.address}
              {club.neighborhood && <span className="text-slate-500"> · {club.neighborhood}</span>}
            </p>
            {club.description && (
              <p className="mt-4 text-base leading-7 text-slate-700 max-w-2xl">{club.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-4">
              {club.website && (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Website
                </a>
              )}
              {club.instagram && (
                <a
                  href={`https://instagram.com/${club.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  @{club.instagram}
                </a>
              )}
              {club.address && (
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(`${club.name}, ${club.address}, New York NY ${club.zipcode || ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Directions
                </a>
              )}
            </div>

            {mics.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Open mics here
                  <span className="ml-2 text-base font-medium text-slate-500">{mics.length}</span>
                </h2>
                <div className="mt-4 grid gap-3">
                  {mics.map((mic) => (
                    <MicListCard key={String(mic.id)} mic={mic} hideBoroughBadge />
                  ))}
                </div>
              </section>
            )}

            {shows.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Shows here
                  <span className="ml-2 text-base font-medium text-slate-500">{shows.length}</span>
                </h2>
                <div className="mt-4 grid gap-3">
                  {shows.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </section>
            )}

            {mics.length === 0 && shows.length === 0 && (
              <p className="mt-10 text-slate-600">
                No open mics or indie shows listed at this club yet — check the club&apos;s site for
                its full calendar.
              </p>
            )}
          </div>

          <div className="mt-8 lg:mt-0">
            <ClubsMapSection clubs={[club]} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
