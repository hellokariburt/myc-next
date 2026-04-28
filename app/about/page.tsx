import type { Metadata } from 'next';
import About from '@/components/about/About';

export const metadata: Metadata = {
  title: 'About OpenMYC | NYC Comedy Open Mic Finder',
  description:
    'OpenMYC is a free tool built by comedian Kari Burt to help comedians find open mics across all 5 NYC boroughs. Learn about the project, data sources, and how to contribute.',
  openGraph: {
    title: 'About OpenMYC',
    description:
      'Built by a comedian, for comedians. Learn about the project behind the NYC open mic search engine.',
    url: 'https://findopenmyc.com/about',
  },
};

export default function AboutPage() {
  return <About />;
}
