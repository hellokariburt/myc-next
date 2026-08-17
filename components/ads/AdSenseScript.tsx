import Script from 'next/script';

/**
 * Loads the AdSense loader script. Kept off the global layout on purpose: the
 * script activates Auto Ads on every page it runs, which was injecting an
 * unreserved ad into the homepage and causing a full-viewport layout shift
 * (Lighthouse CLS ~1.0). Render this only on routes that actually place ads
 * (e.g. /mics with <AdBanner/>). Gated by the same flag AdBanner uses so the
 * script and the ad units turn on together. lazyOnload keeps it off the
 * critical path.
 */
const AdSenseScript = () => {
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'true') return null;

  return (
    <Script
      id="adsbygoogle-loader"
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}`}
      crossOrigin="anonymous"
    />
  );
};

export default AdSenseScript;
