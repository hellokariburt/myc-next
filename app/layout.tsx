import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Find Open Mics in NYC | Free Comedy Open Mic Finder — OpenMYC',
  description:
    'Find New York City comedy open mics at OpenMYC. Search and filter open mics in Manhattan, Brooklyn, Bronx, Queens and Staten Island by day, time, and cost.',
  metadataBase: new URL('https://findopenmyc.com'),
  openGraph: {
    title: 'Find Open Mics in NYC | Free Comedy Open Mic Finder',
    description:
      'Search and filter comedy open mics across all 5 NYC boroughs. Find mics by day, time, borough, and cost. Free to use.',
    url: 'https://findopenmyc.com',
    siteName: 'OpenMYC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Open Mics in NYC | Free Comedy Open Mic Finder',
    description:
      'Search and filter comedy open mics across all 5 NYC boroughs. Free to use.',
  },
  alternates: {
    canonical: 'https://findopenmyc.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" href="/icon.png" />
          <link rel="shortcut icon" href="/icon.png" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'OpenMYC',
                url: 'https://findopenmyc.com',
                description:
                  'A free search engine for comedy open mics in New York City, covering Manhattan, Brooklyn, Queens, the Bronx, and Staten Island.',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://findopenmyc.com/mics?borough={borough}',
                  'query-input': 'required name=borough',
                },
              }),
            }}
          />
        </head>
        <body className={inter.className}>
          {children}
          <Analytics />
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
          <Script
            src="https://gc.zgo.at/count.js"
            strategy="lazyOnload"
            data-goatcounter={`https://${process.env.NEXT_PUBLIC_GOAT_COUNTER}.goatcounter.com/count`}
            data-goatcounter-settings='{"allow_local": true}'
          />
        </body>
      </html>
  );
}
