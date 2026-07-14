import type { Metadata } from 'next';
import PageLayout from '@/components/pagelayout/PageLayout';
import ShowCard from '@/components/shows/ShowCard';
import { getShows, ShowListItem } from '@/lib/services/shows.service';
import capitalizeDay from '@/lib/utils/capitalizeDay';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'NYC Indie Comedy Shows | OpenMYC',
  description:
    'Independent stand-up comedy shows across NYC — bar shows, basement shows, and rooftop shows in Manhattan, Brooklyn, Queens, and the Bronx, organized by night.',
  alternates: { canonical: 'https://findopenmyc.com/shows' },
  openGraph: {
    title: 'NYC Indie Comedy Shows',
    description:
      'Independent stand-up shows across NYC, organized by night. Found via the scene, listed with their public info.',
    url: 'https://findopenmyc.com/shows',
  },
};

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function groupShows(shows: ShowListItem[]): [string, ShowListItem[]][] {
  const groups = new Map<string, ShowListItem[]>();
  DAY_ORDER.forEach((d) => groups.set(d, []));
  groups.set('pop-ups', []);
  shows.forEach((s) => {
    const key = s.day && groups.has(s.day) ? s.day : 'pop-ups';
    groups.get(key)!.push(s);
  });
  return [...groups.entries()].filter(([, list]) => list.length > 0);
}

export default async function ShowsPage() {
  const shows = await getShows();
  const grouped = groupShows(shows);

  return (
    <PageLayout className="bg-[#f6efe4]">
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Beyond the mics
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            NYC indie comedy shows, night by night
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            The bar shows, basement shows, and rooftop shows that make up the city&apos;s indie
            scene. Listings show each show&apos;s public info only — follow the show&apos;s
            Instagram for lineups, tickets, and location details.
          </p>
        </div>

        <nav aria-label="Jump to day" className="mt-8 flex flex-wrap gap-2">
          {grouped.map(([day]) => (
            <a
              key={day}
              href={`#${day}`}
              className="rounded-full bg-white border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {day === 'pop-ups' ? 'Pop-ups' : capitalizeDay(day)}
            </a>
          ))}
        </nav>

        {grouped.map(([day, list]) => (
          <section key={day} id={day} className="mt-10 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {day === 'pop-ups' ? 'Pop-up shows' : `${capitalizeDay(day)} shows`}
              <span className="ml-2 text-base font-medium text-slate-500">{list.length}</span>
            </h2>
            <div className="mt-4 grid gap-3">
              {list.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </section>
        ))}

        <p className="mt-12 text-sm text-slate-500">
          Listings sourced from the scene and shown with public info only. Run a show and want it
          updated or removed? <a href="/contact" className="underline">Get in touch</a>.
        </p>
      </section>
    </PageLayout>
  );
}
