'use client';

import { useEffect } from 'react';

const Ad = ({ slot }: { slot: string }) => {
  useEffect(() => {
    const adWindow = window as unknown as { adsbygoogle: unknown[] };
    if (adWindow.adsbygoogle) {
      adWindow.adsbygoogle.push({});
    }
  }, []);

  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6978978720477594"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6978978720477594"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
};

export default Ad;
