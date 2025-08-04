'use client';

import { useEffect, useRef } from 'react';

const Ad = ({ slot }: { slot: string }) => {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle == null) {
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = [];
    }

    try {
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error loading Google AdSense:', e);
    }
  }, [slot]);

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-6978978720477594"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default Ad;
