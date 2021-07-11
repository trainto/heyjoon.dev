import React, { useEffect } from 'react';

const Adsense = props => {

  useEffect(() => {
    (window.adsbygoogle || []).push({});
  }, []);

  return (
    <>
      {props.children}
    </>
  );
};

export default Adsense;
