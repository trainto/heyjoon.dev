'use client';

import { fetcher } from '@/lib/api/fetchers';
import { useScrollHitTheBottom } from '@/lib/hooks';
import useSWRInfinite from 'swr/infinite';
import Place from './place';
import { useCallback } from 'react';

export const PLACE_COUNT_PER_FETCH = 10;

export default function Feed() {
  const { data, setSize } = useSWRInfinite<Place[]>((page, prevData) => {
    if (prevData && prevData.length < PLACE_COUNT_PER_FETCH) {
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

  return <div>{data?.map((arr) => arr.map((p) => <Place key={p.id} place={p} />))}</div>;
}
