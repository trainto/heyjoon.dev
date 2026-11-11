import { fetcher } from '@/lib/api/fetchers';
import { useEventBus } from '@/lib/event-bus';
import { useScrollHitTheBottom } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Loading from './loading';
import Place from './place';
import PlaceLoading from './place-loading';
import SortToggle, { SortMode } from './sort-toggle';
import TagSearch from './tag-search';
import Uploader from './uploader';

export const PLACE_COUNT_PER_FETCH = 10;

export default function Feed() {
  const noMoreFeed = useRef(false);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>();

  const params = useSearchParams();

  const { data, setSize, mutate, isLoading } = useSWRInfinite<Place[]>((page, prevData) => {
    if (prevData && prevData.length < PLACE_COUNT_PER_FETCH) {
      noMoreFeed.current = true;
      return null;
    }

    if (sortMode === 'nearest') {
      if (!coords) {
        return null;
      }

      const last = prevData?.[prevData.length - 1];

      return `/places?limit=${PLACE_COUNT_PER_FETCH}&sort=distance&lat=${coords.lat}&lng=${coords.lng}${
        page !== 0 && last ? `&lastDistance=${last.distance}&lastId=${last.id}` : ''
      }${params.get('tags') ? '&tags=' + params.get('tags') : ''}${params.get('by') ? '&by=' + params.get('by') : ''}`;
    }

    return `/places?limit=${PLACE_COUNT_PER_FETCH}${
      page !== 0 && prevData ? '&lastId=' + prevData[prevData.length - 1].id : ''
    }${params.get('tags') ? '&tags=' + params.get('tags') : ''}${params.get('by') ? '&by=' + params.get('by') : ''}`;
  }, fetcher);

  useScrollHitTheBottom(
    useCallback(() => {
      setSize((p) => p + 1);
    }, [setSize]),
  );

  useEventBus('fetchPlaces', mutate);

  const handleSortChange = useCallback(
    (mode: SortMode, newCoords?: { lat: number; lng: number }) => {
      noMoreFeed.current = false;
      setCoords(newCoords);
      setSortMode(mode);
      setSize(1);
    },
    [setSize],
  );

  if (isLoading && data == null) {
    return <PlaceLoading />;
  }

  return (
    <>
      <Uploader />

      <div className="mb-3">
        <TagSearch />
      </div>

      <div className="flex justify-end mb-3">
        <SortToggle value={sortMode} onChange={handleSortChange} />
      </div>

      <div>
        {data?.map((arr, i) =>
          arr.map((p, j) => (
            <Place key={p.id} place={p} priority={i === 0 && (j === 0 || j === 1)} />
          )),
        )}
      </div>

      {data && !noMoreFeed.current && (
        <div className="flex justify-center mt-3">
          <Loading />
        </div>
      )}
    </>
  );
}
