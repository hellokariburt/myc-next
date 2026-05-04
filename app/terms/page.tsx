import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/pagelayout/PageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | OpenMYC',
  description: 'Terms of service for using OpenMYC, the NYC comedy open mic finder.',
  alternates: { canonical: 'https://findopenmyc.com/terms' },
};

const LAST_UPDATED = 'May 3, 2026';

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center py-12 px-4">
        <article className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px] w-full">
          <h1 className="font-bold text-4xl">Terms of Service</h1>
          <p className="text-sm text-slate-500 pt-2">Last updated: {LAST_UPDATED}</p>

          <p className="pt-6">
            By using findopenmyc.com (&ldquo;OpenMYC&rdquo;, &ldquo;the site&rdquo;), you agree to
            these terms. If you do not agree, please do not use the site.
          </p>

          <h2 className="font-bold text-2xl pt-8">Use of the site</h2>
          <p className="pt-2">
            OpenMYC is a free directory of comedy open mics in New York City. You may use the site
            for personal, non-commercial purposes such as finding mics to attend or perform at. You
            may not scrape the site at scale, attempt to disrupt the service, or use the site in
            any way that violates applicable laws.
          </p>

          <h2 className="font-bold text-2xl pt-8">Accuracy of information</h2>
          <p className="pt-2">
            We do our best to keep mic data accurate, but the comedy scene changes constantly. Mics
            get cancelled, move venues, change times, change cost, or stop running with no notice.
            <span className="font-semibold">
              {' '}
              Always confirm a mic is happening before you travel to it
            </span>
            . OpenMYC is provided as-is, without any warranty of accuracy, completeness, or
            availability.
          </p>

          <h2 className="font-bold text-2xl pt-8">User submissions</h2>
          <p className="pt-2">
            When you submit a mic via the{' '}
            <Link
              href="/submit"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              submit form
            </Link>
            , you grant OpenMYC permission to publish that information on the site. You agree not
            to submit content that is false, defamatory, or that infringes anyone&rsquo;s rights.
            We reserve the right to edit, decline, or remove any submission at our discretion.
          </p>

          <h2 className="font-bold text-2xl pt-8">Third-party links</h2>
          <p className="pt-2">
            Mic listings include links to host social profiles, venue maps, and other external
            sites. OpenMYC does not control these third-party sites and is not responsible for
            their content, practices, or policies.
          </p>

          <h2 className="font-bold text-2xl pt-8">Advertising</h2>
          <p className="pt-2">
            OpenMYC may display ads served by Google AdSense and other partners. See our{' '}
            <Link
              href="/privacy"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              Privacy Policy
            </Link>{' '}
            for details on advertising cookies and your opt-out options.
          </p>

          <h2 className="font-bold text-2xl pt-8">Disclaimer and liability</h2>
          <p className="pt-2">
            OpenMYC is offered free of charge, with no warranties of any kind, express or implied.
            To the fullest extent permitted by law, OpenMYC and its operator are not liable for any
            damages arising from your use of the site, including but not limited to wasted time,
            travel, or missed performance opportunities resulting from inaccurate listings.
          </p>

          <h2 className="font-bold text-2xl pt-8">Changes</h2>
          <p className="pt-2">
            We may update these terms from time to time. Continued use of the site after changes
            are posted constitutes acceptance of the updated terms.
          </p>

          <h2 className="font-bold text-2xl pt-8">Contact</h2>
          <p className="pt-2">
            Questions about these terms? Email{' '}
            <a
              href="mailto:hello@findopenmyc.com"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              hello@findopenmyc.com
            </a>
            .
          </p>
        </article>
      </div>
    </PageLayout>
  );
}
