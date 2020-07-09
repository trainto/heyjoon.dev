import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return setHeadComponents([
    <script
      data-ad-client="ca-pub-6978978720477594"
      async
      type="text/javascript"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    />
  ]);
};
