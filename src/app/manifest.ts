// import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest() {
  return {
    name: 'Places',
    short_name: 'Places',
    description: 'Hot places shared by ordinary people',
    theme_color: '#282c34',
    background_color: '#282c34',
    start_url: '/places',
    scope: '/places',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    screenshots: [
      { src: '/screenshot.png', sizes: '420x752', type: 'image/png' },
      { src: '/screenshot-wide.png', sizes: '639x350', type: 'image/png', form_factor: 'wide' },
    ],
  };
}
