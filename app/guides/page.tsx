import Link from 'next/link';
import type { Metadata } from 'next';
import PageLayout from '@/components/pagelayout/PageLayout';
import { guideArticles } from '@/lib/content/guides';

export const metadata: Metadata = {
  title: 'NYC Open Mic Guides | OpenMYC',
  description:
    'Evergreen guides for NYC comedians: first open mic tips, room formats, etiquette, and how to choose the right mic.',
  alternates: { canonical: 'https://findopenmyc.com/guides' },
  openGraph: {
    title: 'NYC Open Mic Guides',
    description:
      'Practical guides for navigating NYC open mics, written for comedians using OpenMYC.',
    url: 'https://findopenmyc.com/guides',
  },
};

export default function GuidesPage() {
  return (
    <PageLayout className="bg-[#f6efe4]">
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            OpenMYC Guides
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl tracking-normal text-slate-900">
            Practical NYC open mic advice, not just listings
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            OpenMYC tracks where mics are. These guides cover how the rooms actually work:
            first-timer logistics, signup formats, venue differences, and the unwritten rules
            that make nights in the city go smoother.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {guideArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>{article.category}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{article.readingTime}</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                <Link href={`/guides/${article.slug}`} className="hover:text-blue-700">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{article.description}</p>
              <Link
                href={`/guides/${article.slug}`}
                className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Read guide
              </Link>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
