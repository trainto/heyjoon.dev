import { fetcher } from '@/lib/api/fetchers';
import { dispatch } from '@/lib/store';
import type { FeatureCollection, Point } from 'geojson';
import { GeolocateControl, GeoJSONSource, Map as MapLibreMap, Popup, setWorkerUrl } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

// Next/Turbopack doesn't bundle maplibre-gl's internal module Worker correctly
// (the worker URL ends up broken), and cross-origin module workers aren't
// allowed by browsers, so the worker script is copied into public/ and served
// same-origin instead. Keep this file in sync with the maplibre-gl version.
setWorkerUrl('/maplibre-gl-worker.mjs');

// Used when geolocation isn't available or permission is denied.
const GANGNAM_STATION = { lat: 37.497952, lng: 127.027619 };

const INITIAL_RADIUS_KM = 5;
const SOURCE_ID = 'place-pins';
const MOVE_DEBOUNCE_MS = 400;

const kmToLatDelta = (km: number) => km / 111;
const kmToLngDelta = (km: number, atLat: number) => km / (111 * Math.cos((atLat * Math.PI) / 180));

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

export default function FullMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    let cancelled = false;
    const pinsById = new Map<number, PlacePin>();
    let moveTimer: ReturnType<typeof setTimeout> | undefined;
    let triggerInterval: ReturnType<typeof setInterval> | undefined;

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

        const linkRow = document.createElement('div');
        linkRow.className = 'flex flex-col space-y-1';

        const link = document.createElement('a');
        link.href = `/places#${id}`;
        link.className = 'text-brand1';
        link.textContent = 'View place →';
        link.onclick = () => dispatch('layer', null);
        linkRow.appendChild(link);

        const googleMapsLink = document.createElement('a');
        googleMapsLink.href = `https://www.google.com/maps/search/${encodeURIComponent(
          name || ''
        )}/@${lat},${lng},17z`;
        googleMapsLink.target = '_blank';
        googleMapsLink.rel = 'noopener noreferrer';
        googleMapsLink.className = 'text-gray-500';
        googleMapsLink.textContent = 'Google Maps ↗';
        linkRow.appendChild(googleMapsLink);

        container.appendChild(linkRow);

        new Popup({ closeButton: false }).setLngLat([lng, lat]).setDOMContent(container).addTo(map);
      });

      // GeolocateControl supplies its own "recenter on my location" button,
      // the blue dot marker, and the accuracy circle, so none of that needs
      // to be built by hand here. zoomToUserAccuracy is turned off so a
      // precise fix doesn't zoom in past our INITIAL_RADIUS_KM overview --
      // it only recenters, keeping the current zoom level.
      const geolocate = new GeolocateControl({
        positionOptions: { timeout: GEOLOCATION_TIMEOUT_MS },
        zoomToUserAccuracy: false,
      });
      map.addControl(geolocate, 'bottom-right');

      // Register before the first fetch, and show/load the default view
      // right away, so a pan/zoom during (or a stall/timeout of) the
      // geolocation trigger below is never missed and the map is never left
      // empty waiting on it.
      map.on('moveend', onMoveEnd);
      map.fitBounds(boundsAround(GANGNAM_STATION, INITIAL_RADIUS_KM), { animate: false });
      await loadPins();

      if (cancelled) {
        return;
      }

      // trigger() calls navigator.geolocation unconditionally even when
      // it's unavailable (unsupported browser, insecure context), so check
      // first. If permission is denied, GeolocateControl surfaces an error
      // state on its own button and the map stays on the default view.
      if (!navigator.geolocation) {
        return;
      }

      // GeolocateControl finishes its own (async) setup shortly after
      // addControl() returns -- trigger() is a no-op until then, with no
      // event to await, so retry briefly until it reports success.
      triggerInterval = setInterval(() => {
        if (cancelled || geolocate.trigger()) {
          clearInterval(triggerInterval);
        }
      }, 100);
      setTimeout(() => clearInterval(triggerInterval), 2000);
    });

    return () => {
      cancelled = true;
      clearInterval(triggerInterval);
      clearTimeout(moveTimer);
      map.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md overflow-hidden"
      style={{ height: '70vh' }}
    />
  );
}
