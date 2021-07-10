import React from 'react';

const Adsense = props => {
  return (
    <>
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
       <script dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({});` }} />
    </>
  );
};

export default Adsense;
