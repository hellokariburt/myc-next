import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/pagelayout/PageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | OpenMYC',
  description:
    'How OpenMYC handles data, cookies, and third-party services including Google AdSense and analytics.',
  alternates: { canonical: 'https://findopenmyc.com/privacy' },
};

const LAST_UPDATED = 'May 3, 2026';

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center py-12 px-4">
        <article className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px] w-full">
          <h1 className="font-bold text-4xl">Privacy Policy</h1>
          <p className="text-sm text-slate-500 pt-2">Last updated: {LAST_UPDATED}</p>

          <p className="pt-6">
            OpenMYC (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the site&rdquo;) operates{' '}
            <Link
              href="/"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              findopenmyc.com
            </Link>
            . This policy explains what information we collect, how we use it, and the third-party
            services involved when you visit the site.
          </p>

          <h2 className="font-bold text-2xl pt-8">Information we collect</h2>
          <p className="pt-2">
            OpenMYC does not require you to create an account. We do not collect names, email
            addresses, or other personal identifiers from visitors browsing the site. The only
            personal information we receive is what you voluntarily send us &mdash; for example,
            when you email us or submit a mic through the{' '}
            <Link
              href="/submit"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              submit form
            </Link>
            .
          </p>

          <h2 className="font-bold text-2xl pt-8">Cookies and similar technologies</h2>
          <p className="pt-2">
            Like most websites, OpenMYC and its third-party partners use cookies and similar
            technologies to deliver and improve the service. You can disable cookies in your
            browser settings, although some parts of the site may not work as expected.
          </p>

          <h2 className="font-bold text-2xl pt-8">Third-party services</h2>

          <h3 className="font-bold text-lg pt-4">Google AdSense</h3>
          <p className="pt-2">
            We use Google AdSense to display ads on the site. Google, as a third-party vendor, uses
            cookies (including the DART cookie) to serve ads based on a user&rsquo;s prior visits
            to this site and other sites on the internet. You may opt out of personalized
            advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              Google Ads Settings
            </a>
            . You can also opt out of a third-party vendor&rsquo;s use of cookies for personalized
            advertising by visiting{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              aboutads.info
            </a>
            .
          </p>

          <h3 className="font-bold text-lg pt-4">Analytics</h3>
          <p className="pt-2">
            We use Vercel Analytics and GoatCounter to understand aggregate traffic patterns (such
            as which pages are popular and how visitors arrive). These tools collect basic,
            non-identifying information like page paths, referrers, and approximate location at the
            country level. They do not build advertising profiles and do not sell data.
          </p>

          <h3 className="font-bold text-lg pt-4">Hosting</h3>
          <p className="pt-2">
            The site is hosted on Vercel. Vercel may collect standard server logs (IP address, user
            agent, request timestamps) for security and operational purposes.
          </p>

          <h2 className="font-bold text-2xl pt-8">Information you submit</h2>
          <p className="pt-2">
            When you submit a mic through the form or email us, we use that information solely to
            update the mic database, respond to your message, and improve the site. We do not sell
            or share submitted information with advertisers.
          </p>

          <h2 className="font-bold text-2xl pt-8">Children&rsquo;s privacy</h2>
          <p className="pt-2">
            OpenMYC is not directed at children under 13 and we do not knowingly collect any
            personal information from children.
          </p>

          <h2 className="font-bold text-2xl pt-8">Your choices</h2>
          <p className="pt-2">
            You can disable or delete cookies in your browser, opt out of personalized advertising
            using the links above, or contact us if you would like any information you have sent us
            removed.
          </p>

          <h2 className="font-bold text-2xl pt-8">Changes to this policy</h2>
          <p className="pt-2">
            We may update this policy from time to time. When we do, we will revise the &ldquo;Last
            updated&rdquo; date at the top of this page.
          </p>

          <h2 className="font-bold text-2xl pt-8">Contact</h2>
          <p className="pt-2">
            Questions about this policy? Email{' '}
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
