import React, { useEffect } from 'react';

const Adsense = props => {
  useEffect(() => {
    const adsbygoogle = window.adsbygoogle || [];
    adsbygoogle.push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={props.style ? props.style : { display: 'block' }}
      data-ad-client="ca-pub-6978978720477594"
      data-ad-slot={props.slot}
      data-ad-layout={props.layout ? props.layout : null}
      data-ad-format={props.format}
      data-full-width-responsive={props.responsive ? 'true' : 'false'}
      data-ad-layout-key={props.layout_key ? props.layout_key : null}
    />
  );
};

export default Adsense;
