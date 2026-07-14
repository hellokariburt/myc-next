import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/pagelayout/PageLayout';
import ClubStageTabs from '@/components/clubs/ClubStageTabs';
import ClubsMapSection from '@/components/clubs/ClubsMapSection';
import {
  getClubs,
  getMicsAtClub,
  clubSlug,
  ClubListItem,
} from '@/lib/services/clubs.service';
import { serialize } from '@/lib/utils/serialize';
import { t } from '@/lib/i18n';
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

  const micsAtClub = await getMicsAtClub(club.name);
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
            {t('clubs.detail.backLink')}
          </Link>
        </nav>

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-6 lg:items-start">
          <div>
            {club.image && (
              <div className="relative w-full h-56 md:h-80 rounded-2xl border border-slate-200 shadow-sm bg-slate-100 overflow-hidden">
                <Image
                  src={club.image}
                  alt={`${club.name}`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl md:text-5xl tracking-normal leading-[1.02] text-slate-900">
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
                  {t('clubs.detail.website')}
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
                  {t('clubs.detail.directions')}
                </a>
              )}
            </div>

            {/* shows section dormant — pass empty so only mics render */}
            <ClubStageTabs mics={mics} shows={[]} />
          </div>

          <div className="mt-8 lg:mt-0 lg:self-stretch">
            <ClubsMapSection clubs={[club]} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
