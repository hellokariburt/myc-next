'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense not loaded
    }
  }, []);

  return (
    // Reserve the slot height so the ad filling in doesn't shift the mic list
    // (AdSense's own CLS guidance). 280px covers a typical in-feed responsive
    // display ad on mobile; items-center keeps a shorter ad centered in the
    // reserved box. Tune the value against a real /mics PageSpeed run if the
    // served ad height differs.
    <div ref={adRef} className="w-full my-2 flex items-center justify-center lg:max-w-[calc(50vw-50px)] min-w-[330px] min-h-[280px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
        data-ad-slot="6904570293"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
