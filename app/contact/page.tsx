import type { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/pagelayout/PageLayout';

export const metadata: Metadata = {
  title: 'Contact | OpenMYC',
  description:
    'Get in touch with OpenMYC. Report incorrect mic info, suggest a feature, or just say hi.',
  alternates: { canonical: 'https://findopenmyc.com/contact' },
};

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center py-12 px-4">
        <article className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px] w-full">
          <h1 className="font-bold text-4xl">Contact</h1>

          <p className="pt-6">
            OpenMYC is built and maintained by one person, so the easiest way to reach us is by
            email. We try to respond within a few days.
          </p>

          <h2 className="font-bold text-2xl pt-8">General questions</h2>
          <p className="pt-2">
            Email{' '}
            <a
              href="mailto:hello@findopenmyc.com"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              hello@findopenmyc.com
            </a>{' '}
            for anything &mdash; questions, feedback, partnership ideas, or general comedy talk.
          </p>

          <h2 className="font-bold text-2xl pt-8">Report incorrect mic info</h2>
          <p className="pt-2">
            If a mic on the site is wrong, cancelled, or has changed, please email us with the mic
            name and what needs to be updated. The more detail (correct time, new venue, host
            change), the faster we can fix it.
          </p>

          <h2 className="font-bold text-2xl pt-8">Submit a new mic</h2>
          <p className="pt-2">
            Know a mic that isn&rsquo;t listed? Use the{' '}
            <Link
              href="/submit"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              submit form
            </Link>{' '}
            &mdash; it&rsquo;s the fastest way to get a new mic into the database.
          </p>

          <h2 className="font-bold text-2xl pt-8">Privacy and legal</h2>
          <p className="pt-2">
            For questions about how your information is handled, see the{' '}
            <Link
              href="/privacy"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              Privacy Policy
            </Link>{' '}
            or the{' '}
            <Link
              href="/terms"
              className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
            >
              Terms of Service
            </Link>
            .
          </p>
        </article>
      </div>
    </PageLayout>
  );
}
