'use client';

import { fetcher } from '@/lib/api/fetchers';
import Link from 'next/link';
import { useMemo } from 'react';
import useSWR from 'swr';

export default function Feed() {
  const { data } = useSWR<Place[]>('/places', fetcher);

  return <div>{data?.map((p) => <Place key={p.id} place={p} />)}</div>;
}

function Place({ place }: { place: Place }) {
  const built = useMemo(() => {
    return place.desc
      .split(/(#[^\s#]+)/)
      .map((s, i) => (s.startsWith('#') ? <Tag key={i} tag={s} /> : s));
  }, [place.desc]);

  return <div>{built}</div>;
}

function Tag({ tag }: { tag: string }) {
  return <Link href={`/places/tag/${tag.replace(/#/g, '')}`}>{tag}</Link>;
}
