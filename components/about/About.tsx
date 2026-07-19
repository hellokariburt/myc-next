import Link from 'next/link';
import { IconCurrencyDollar } from '@tabler/icons-react';
import PageLayout from '../pagelayout/PageLayout';

const About = () => (
  <PageLayout>
    <div className="bg-[#f6efe4]">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            About OpenMYC
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Built by a comedian who got tired of piecing NYC mic info together from scattered posts
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            OpenMYC is a free NYC open mic directory built to make the comedy grind easier to
            navigate. Instead of hunting through Instagram captions, spreadsheets, and group chats,
            comics can use one searchable place to find mics by borough, day, time, cost, and venue
            type.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Why this exists</h2>
            <div className="mt-4 space-y-4 text-slate-700 leading-8">
              <p>
                Kari Burt started OpenMYC after moving from Houston to New York and realizing that
                finding stage time in the city was its own part-time job. There were mics
                everywhere, but the information lived in too many places and changed too often.
              </p>
              <p>
                The goal of the site is simple: make it easier for comedians to find rooms that fit
                their night. That includes obvious questions like where a mic is and what time it
                starts, but also practical details that actually shape the experience, like whether
                it is free, whether it is in a bar or club, and how signup usually works.
              </p>
              <p>
                OpenMYC is meant to feel like a real tool made by someone who uses it, not a scraped
                list dropped onto a template. The listings are paired with context and a transparent
                explanation of where the data comes from.
              </p>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quick facts
            </p>
            <dl className="mt-5 space-y-5 text-slate-700">
              <div>
                <dt className="text-sm font-semibold text-slate-900">Built by</dt>
                <dd className="mt-1">
                  <Link href="https://kariburt.com" className="text-blue-700 hover:text-blue-800">
                    Kari Burt
                  </Link>
                  , comedian and developer based in NYC
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900">Coverage</dt>
                <dd className="mt-1">Open mics across all five NYC boroughs</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-900">Built with</dt>
                <dd className="mt-1">Next.js, PostgreSQL, Prisma, and Vercel</dd>
              </div>
            </dl>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Where the data comes from
            </h2>
            <div className="mt-4 space-y-4 text-slate-700 leading-8">
              <p>
                Mic data is sourced from{' '}
                <Link
                  href="https://www.comediq.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800"
                >
                  Comediq
                </Link>
                , maintained by{' '}
                <Link
                  href="https://instagram.com/malevcomedy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800"
                >
                  Adam Malev
                </Link>
                . OpenMYC reorganizes that information into a format that is easier to search and
                use on the fly.
              </p>
              <p>
                Because open mics change constantly, the site also accepts community submissions.
                If you know a room that is missing or outdated, use the{' '}
                <Link href="/submit" className="text-blue-700 hover:text-blue-800">
                  submit page
                </Link>{' '}
                and it can be reviewed for inclusion.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Support the project</h2>
            <div className="mt-4 space-y-4 text-slate-700 leading-8">
              <p>
                OpenMYC is free to use. Support helps cover hosting, maintenance, and the ongoing
                work of keeping the listings readable and useful.
              </p>
              <p>
                Questions, corrections, or partnership ideas can go to{' '}
                <Link
                  href="mailto:hello@findopenmyc.com"
                  className="text-blue-700 hover:text-blue-800"
                >
                  hello@findopenmyc.com
                </Link>
                .
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                href="https://cash.app/$KariBurt"
              >
                <IconCurrencyDollar size={20} />
                Cash App
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800"
                href="https://venmo.com/u/kariandreah"
              >
                <IconCurrencyDollar size={20} />
                Venmo
              </a>
            </div>
          </section>

          <p className="pt-10 text-center text-sm text-slate-500">
            vibecoded with <span aria-hidden="true">❤️</span>
            <span className="sr-only">love</span> in NYC
          </p>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default About;
