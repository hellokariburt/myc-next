import React from 'react';
import type { Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { ReactQueryProvider } from './ReactQueryProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'OpenMYC: NYC Comedy Open Mic Search',
  description:
    'Find New York City comedy open mics at OpenMyc. OpenMyc is a Search Engine for comedy open mics in Manhattan, Brooklyn, Bronx, Queens and Staten Island.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <html lang="en">
          <head>
            <link rel="apple-touch-icon" href="/icon.png" />
            <link rel="shortcut icon" href="/icon.png" />
          </head>
          <body>
            {children}
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
      </ReactQueryProvider>
    </React.StrictMode>
  );
}
