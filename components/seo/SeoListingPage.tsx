import Link from 'next/link';
import { getMics } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';
import { MicListItem } from '@/lib/types/mic';
import { ALL_BOROUGHS, ALL_DAYS } from '@/lib/types/api';
import {
  getBoroughAccentBar,
  getBoroughEyebrow,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';
import { buildMicUrl } from '@/lib/utils/micUrl';
import PageLayout from '../pagelayout/PageLayout';
import MicListCard from '../mic/MicListCard';
import { QuickFilters } from './QuickFilters';
import { BoroughDayLinks } from './BoroughDayLinks';
import { jsonLdHtml } from '@/lib/seo/jsonLd';

interface Breadcrumb {
  name: string;
  url: string;
}

interface SeoListingProps {
  title: string;
  borough?: string[];
  day?: string[];
  free?: boolean;
  breadcrumbs?: Breadcrumb[];
  pageUrl?: string;
  dayLinksBorough?: string;
  boroughKey?: string;
}

export async function SeoListingPage({ title, borough, day, free, breadcrumbs, pageUrl, dayLinksBorough, boroughKey }: SeoListingProps) {
  // Caps page weight — Manhattan alone is 263 mics. `count` is the unclamped
  // total, so it must never be presented as the number of cards on the page.
  const LISTING_LIMIT = 100;

  const { mics, count } = await getMics({
    borough: borough ?? [...ALL_BOROUGHS],
    day: day ?? [...ALL_DAYS],
    limit: LISTING_LIMIT,
    offset: 0,
    start_time: '00:00:00',
    cost: free ? 'true' : 'false',
  });

  const serialized = serialize(mics) as unknown as MicListItem[];
  const truncated = count > serialized.length;

  // Onward link to the full filtered set, so the mics past the cap are still
  // reachable from the page Google indexes for this borough/day.
  const fullListHref = (() => {
    const p = new URLSearchParams();
    if (borough?.length === 1) p.set('borough', borough[0]);
    if (day?.length === 1) p.set('day', day[0]);
    if (free) p.set('free', 'true');
    const qs = p.toString();
    return qs ? `/mics?${qs}` : '/mics';
  })();

  const breadcrumbsJsonLd =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.name,
            item: b.url,
          })),
        }
      : null;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    ...(pageUrl ? { url: pageUrl } : {}),
    numberOfItems: serialized.length,
    itemListElement: serialized.map((mic, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: buildMicUrl(mic),
      name: mic.name,
    })),
  };

  return (
    <PageLayout className="bg-[#f6efe4]">
      {breadcrumbsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbsJsonLd) }}
        />
      )}
      {serialized.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(itemListJsonLd) }}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {boroughKey && (
          <>
            <div className={`h-1 ${getBoroughAccentBar(boroughKey)} rounded-full mb-6`} />
            <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${getBoroughEyebrow(boroughKey)}`}>
              {getBoroughDisplayShort(boroughKey)} · NYC Open Mics
            </p>
          </>
        )}
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-slate-900 mb-2">
          {title}
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          {truncated ? (
            <>
              Showing {serialized.length} of {count} {free ? 'free ' : ''}mics ·{' '}
              <Link href={fullListHref} className="underline hover:text-slate-900">
                see all
              </Link>
            </>
          ) : (
            <>
              {count} {free ? 'free ' : ''}mic{count !== 1 ? 's' : ''} · updated daily
            </>
          )}
        </p>

        <QuickFilters className="mb-6" hideBorough={boroughKey} />

        {dayLinksBorough && <BoroughDayLinks borough={dayLinksBorough} className="mb-6" />}

        <div className="flex flex-col gap-3 mb-8">
          {serialized.map((mic) => (
            <MicListCard
              key={mic.id}
              mic={mic}
              hideBoroughBadge={borough?.length === 1}
            />
          ))}
        </div>

        {serialized.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            No mics found matching these filters. <Link href="/mics" className="text-blue-600 underline">Browse all mics</Link>.
          </p>
        )}

        <div className="text-center pt-4">
          <Link
            href="/mics"
            className="text-blue-600 hover:text-blue-800 text-sm underline underline-offset-2"
          >
            Need more filters? Search all mics →
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
