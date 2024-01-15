import { fetcher } from '@/lib/api/fetchers';
import { useEventBus } from '@/lib/event-bus';
import { useScrollHitTheBottom } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import Loading from './loading';
import Place from './place';
import Uploader from './uploader';

export const PLACE_COUNT_PER_FETCH = 10;

export default function Feed() {
  const noMoreFeed = useRef(false);

  const params = useSearchParams();

  const { data, setSize, mutate } = useSWRInfinite<Place[]>((page, prevData) => {
    if (prevData && prevData.length < PLACE_COUNT_PER_FETCH) {
      noMoreFeed.current = true;
      return null;
    }

    return `/places?limit=${PLACE_COUNT_PER_FETCH}${
      page !== 0 && prevData ? '&lastId=' + prevData[prevData.length - 1].id : ''
    }${params.get('tags') ? '&tags=' + params.get('tags') : ''}`;
  }, fetcher);

  useScrollHitTheBottom(
    useCallback(() => {
      setSize((p) => p + 1);
    }, [setSize]),
  );

  useEventBus('fetchPlaces', mutate);

  return (
    <>
      <Uploader />

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
