import type { Metadata } from 'next';
import PageLayout from '@/components/pagelayout/PageLayout';
import ClubCard from '@/components/clubs/ClubCard';
import ClubsMapSection from '@/components/clubs/ClubsMapSection';
import { getClubs, ClubListItem } from '@/lib/services/clubs.service';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'NYC Comedy Clubs | OpenMYC',
  description:
    'Directory of dedicated stand-up comedy clubs across New York City — Manhattan, Brooklyn, and Queens rooms, verified open, with addresses and links.',
  alternates: { canonical: 'https://findopenmyc.com/clubs' },
  openGraph: {
    title: 'NYC Comedy Clubs',
    description: 'Verified directory of dedicated stand-up comedy clubs across New York City.',
    url: 'https://findopenmyc.com/clubs',
  },
};

const BOROUGH_ORDER = ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten-island'];
const BOROUGH_LABEL: Record<string, string> = {
  manhattan: 'Manhattan',
  brooklyn: 'Brooklyn',
  queens: 'Queens',
  bronx: 'Bronx',
  'staten-island': 'Staten Island',
};

function groupClubs(clubs: ClubListItem[]): [string, ClubListItem[]][] {
  const groups = new Map<string, ClubListItem[]>();
  BOROUGH_ORDER.forEach((b) => groups.set(b, []));
  clubs.forEach((c) => {
    const key = c.borough && groups.has(c.borough) ? c.borough : 'manhattan';
    groups.get(key)!.push(c);
  });
  return [...groups.entries()].filter(([, list]) => list.length > 0);
}

export default async function ClubsPage() {
  const clubs = await getClubs();
  const grouped = groupClubs(clubs);

  return (
    <PageLayout className="bg-[#f6efe4]">
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            The rooms
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            NYC comedy clubs
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            The city&apos;s dedicated stand-up rooms — verified open, borough by borough. Many run
            open mics too: check <a href="/mics" className="underline">the mic list</a> for stage
            time at these clubs.
          </p>
        </div>

        {clubs.length === 0 && (
          <div className="mt-10 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">
            Club directory loading soon.
          </div>
        )}

        <div className="mt-2 lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-4 lg:items-start">
          <div>
            {grouped.map(([borough, list]) => (
              <section key={borough} className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {BOROUGH_LABEL[borough]}
                  <span className="ml-2 text-base font-medium text-slate-500">{list.length}</span>
                </h2>
                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {list.map((club) => (
                    <ClubCard key={club.id} club={club} />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10">
            <ClubsMapSection clubs={clubs} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
