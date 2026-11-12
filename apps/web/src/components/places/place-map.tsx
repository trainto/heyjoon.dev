import { Map, Marker, setWorkerUrl } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

// Next/Turbopack doesn't bundle maplibre-gl's internal module Worker correctly
// (the worker URL ends up broken), and cross-origin module workers aren't
// allowed by browsers, so the worker script is copied into public/ and served
// same-origin instead. Keep this file in sync with the maplibre-gl version.
setWorkerUrl('/maplibre-gl-worker.mjs');

export default function PlaceMap({ location }: { location: PlaceLocation }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    const map = new Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [location.lng, location.lat],
      zoom: 15,
      attributionControl: false,
    });

    new Marker({ color: '#db2777' }).setLngLat([location.lng, location.lat]).addTo(map);

    return () => {
      map.remove();
    };
  }, [location.lat, location.lng]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md overflow-hidden"
      style={{ height: 240 }}
    />
  );
}
