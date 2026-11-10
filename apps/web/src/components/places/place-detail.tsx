'use client';

import { fetcher } from '@/lib/api/fetchers';
import { useEventBus } from '@/lib/event-bus';
import { useSante } from '@/lib/store';
import useSWR from 'swr';
import Comments from './comments';
import Place from './place';
import PlaceLoading from './place-loading';

export default function PlaceDetail({ id }: { id: string }) {
  const { data, error, mutate } = useSWR<Place>('/places/' + id, fetcher);

  const { userInfo } = useSante(['userInfo']);

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
        <>
          <Place key={data.id} place={data} priority detail />

          <div className="mt-3 pt-3 border-t border-gray-700 px-2">
            {userInfo == null ? (
              <div className="text-center text-sm text-gray-400 py-3">
                Please sign in to view and post comments.
              </div>
            ) : (
              <Comments key={data.id} place={data} variant="inline" />
            )}
          </div>
        </>
      ) : (
        <PlaceLoading />
      )}
    </>
  );
}
