'use client';

import { fetcher } from '@/lib/api/fetchers';
import { useEventBus } from '@/lib/event-bus';
import useSWR from 'swr';
import Place from './place';
import PlaceLoading from './place-loading';

export default function PlaceDetail({ id }: { id: string }) {
  const { data, error, mutate } = useSWR<Place>('/places/' + id, fetcher);

  useEventBus('fetchPlaces', mutate);

  return (
    <>
      <div className="mb-3">
        <a href="/places" className="text-sm text-gray-400">
          ← Back to feed
        </a>
      </div>

      {error ? (
        <div className="text-center text-gray-400 mt-10">Place not found.</div>
      ) : data ? (
        <Place place={data} priority />
      ) : (
        <PlaceLoading />
      )}
    </>
  );
}
