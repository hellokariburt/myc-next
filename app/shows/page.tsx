import type { Metadata } from 'next';
import PageLayout from '@/components/pagelayout/PageLayout';
import ShowsBrowser from '@/components/shows/ShowsBrowser';
import { getShows } from '@/lib/services/shows.service';

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

export default async function ShowsPage() {
  const shows = await getShows();

  return (
    <PageLayout className="bg-[#f6efe4]">
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
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

        <ShowsBrowser shows={shows} />

        <p className="mt-12 text-sm text-slate-500">
          Listings sourced from the scene and shown with public info only. Run a show and want it
          updated or removed? <a href="/contact" className="underline">Get in touch</a>.
        </p>
      </section>
    </PageLayout>
  );
}
