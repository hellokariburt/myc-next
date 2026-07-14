import type { Metadata } from 'next';
import PageLayout from '@/components/pagelayout/PageLayout';
import ClubsBrowser from '@/components/clubs/ClubsBrowser';
import { getClubs } from '@/lib/services/clubs.service';

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

export default async function ClubsPage() {
  const clubs = await getClubs();

  return (
    <PageLayout className="bg-[#f6efe4]">
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            The rooms
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl tracking-normal text-slate-900">
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

        <ClubsBrowser clubs={clubs} />
      </section>
    </PageLayout>
  );
}
