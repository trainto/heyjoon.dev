import { fetcher } from '@/lib/api/fetchers';
import { useScrollHitTheBottom } from '@/lib/hooks';
import useSWRInfinite from 'swr/infinite';
import Place from './place';
import { useCallback, useRef } from 'react';
import Loading from './loading';
import useStore from '@/lib/store';
import Uploader from './uploader';
import { useEventBus } from '@/lib/event-bus';

export const PLACE_COUNT_PER_FETCH = 10;

export default function Feed() {
  const noMoreFeed = useRef(false);

  const { value: userInfo } = useStore('userInfo');

  const { data, setSize, mutate } = useSWRInfinite<Place[]>((page, prevData) => {
    if (prevData && prevData.length < PLACE_COUNT_PER_FETCH) {
      noMoreFeed.current = true;
      return null;
    }

    return `/places?limit=${PLACE_COUNT_PER_FETCH}${
      page !== 0 && prevData ? '&lastId=' + prevData[prevData.length - 1].id : ''
    }`;
  }, fetcher);

  useScrollHitTheBottom(
    useCallback(() => {
      setSize((p) => p + 1);
    }, [setSize]),
  );

  useEventBus('fetchPlaces', mutate);

  return (
    <>
      {userInfo && <Uploader />}

      <div>{data?.map((arr) => arr.map((p) => <Place key={p.id} place={p} />))}</div>

      {data && !noMoreFeed.current && (
        <div className="flex justify-center mt-3">
          <Loading />
        </div>
      )}
    </>
  );
}
