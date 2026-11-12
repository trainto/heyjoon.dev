import { fetcher } from '@/lib/api/fetchers';
import { dispatch } from '@/lib/store';
import type { FeatureCollection, Point } from 'geojson';
import { GeoJSONSource, Map as MapLibreMap, Popup, setWorkerUrl } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

// Next/Turbopack doesn't bundle maplibre-gl's internal module Worker correctly
// (the worker URL ends up broken), and cross-origin module workers aren't
// allowed by browsers, so the worker script is copied into public/ and served
// same-origin instead. Keep this file in sync with the maplibre-gl version.
setWorkerUrl('/maplibre-gl-worker.mjs');

// Used when geolocation isn't available or permission is denied.
const GANGNAM_STATION = { lat: 37.497952, lng: 127.027619 };

const INITIAL_RADIUS_KM = 10;
const SOURCE_ID = 'place-pins';
const MOVE_DEBOUNCE_MS = 400;

const kmToLatDelta = (km: number) => km / 111;
const kmToLngDelta = (km: number, atLat: number) =>
  km / (111 * Math.cos((atLat * Math.PI) / 180));

const boundsAround = (
  center: { lat: number; lng: number },
  radiusKm: number
): [[number, number], [number, number]] => {
  const latDelta = kmToLatDelta(radiusKm);
  const lngDelta = kmToLngDelta(radiusKm, center.lat);

  return [
    [center.lng - lngDelta, center.lat - latDelta],
    [center.lng + lngDelta, center.lat + latDelta],
  ];
};

const pinsToGeoJSON = (pins: PlacePin[]): FeatureCollection<Point> => ({
  type: 'FeatureCollection',
  features: pins.map((p) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    properties: { id: p.id, name: p.name },
  })),
});

const GEOLOCATION_TIMEOUT_MS = 8000;

// Resolves to null if geolocation isn't available/granted, times out, or
// fails -- callers fall back to GANGNAM_STATION, which is already on screen
// by the time this settles.
const getCurrentLocation = (): Promise<{ lat: number; lng: number } | null> =>
  new Promise((resolve) => {
    if (!navigator.geolocation || !navigator.permissions?.query) {
      resolve(null);
      return;
    }

    const timer = setTimeout(() => resolve(null), GEOLOCATION_TIMEOUT_MS);
    const resolveOnce = (value: { lat: number; lng: number } | null) => {
      clearTimeout(timer);
      resolve(value);
    };

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (status.state === 'denied') {
          resolveOnce(null);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolveOnce({ lat: position.coords.latitude, lng: position.coords.longitude }),
          () => resolveOnce(null),
          { timeout: GEOLOCATION_TIMEOUT_MS }
        );
      })
      .catch(() => resolveOnce(null));
  });

export default function FullMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    let cancelled = false;
    const pinsById = new Map<number, PlacePin>();
    let moveTimer: ReturnType<typeof setTimeout> | undefined;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [GANGNAM_STATION.lng, GANGNAM_STATION.lat],
      zoom: 13,
      attributionControl: false,
    });

    const loadPins = async () => {
      const bounds = map.getBounds();

      const newPins = await fetcher<PlacePin[]>('/places/locations', {
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      }).catch(() => []);

      if (cancelled) {
        return;
      }

      for (const pin of newPins) {
        pinsById.set(pin.id, pin);
      }

      const source = map.getSource<GeoJSONSource>(SOURCE_ID);
      source?.setData(pinsToGeoJSON([...pinsById.values()]));
    };

    const onMoveEnd = () => {
      clearTimeout(moveTimer);
      moveTimer = setTimeout(loadPins, MOVE_DEBOUNCE_MS);
    };

    map.on('load', async () => {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: pinsToGeoJSON([]),
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 15,
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#db2777',
          'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26],
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Noto Sans Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#db2777',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = map.getSource<GeoJSONSource>(SOURCE_ID);

        if (clusterId == null || source == null) {
          return;
        }

        const zoom = await source.getClusterExpansionZoom(clusterId);
        const geometry = features[0]?.geometry;
        if (geometry?.type === 'Point') {
          map.easeTo({ center: geometry.coordinates as [number, number], zoom });
        }
      });

      map.on('click', 'unclustered-point', (e) => {
        const feature = e.features?.[0];
        if (feature == null || feature.geometry.type !== 'Point') {
          return;
        }

        const id = feature.properties?.id;
        const name = feature.properties?.name;
        const [lng, lat] = feature.geometry.coordinates as [number, number];

        const container = document.createElement('div');
        container.className = 'text-sm text-gray-900';

        const nameEl = document.createElement('div');
        nameEl.className = 'font-bold mb-1';
        nameEl.textContent = name || 'Untitled place';
        container.appendChild(nameEl);

        const link = document.createElement('a');
        link.href = `/places#${id}`;
        link.className = 'text-brand1';
        link.textContent = 'View place →';
        link.onclick = () => dispatch('layer', null);
        container.appendChild(link);

        new Popup({ closeButton: false }).setLngLat([lng, lat]).setDOMContent(container).addTo(map);
      });

      // Register before the first fetch, and show/load the default view
      // right away, so a pan/zoom during (or a stall/timeout of) the
      // geolocation lookup below is never missed and the map is never left
      // empty waiting on it.
      map.on('moveend', onMoveEnd);
      map.fitBounds(boundsAround(GANGNAM_STATION, INITIAL_RADIUS_KM), { animate: false });
      await loadPins();

      const location = await getCurrentLocation();
      if (cancelled || location == null) {
        return;
      }

      map.fitBounds(boundsAround(location, INITIAL_RADIUS_KM), { animate: false });
    });

    return () => {
      cancelled = true;
      clearTimeout(moveTimer);
      map.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full rounded-md overflow-hidden" style={{ height: '70vh' }} />
  );
}
