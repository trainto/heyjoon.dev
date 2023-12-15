'use client';

import { fetcher } from '@/lib/api/fetchers';
import useSWR from 'swr';
import Tag from './tag';

const Side = () => {
  const { data: topTags } = useSWR<string[]>('/places/tags/top?limit=5', fetcher);
  return (
    <div className="sm:sticky sm:top-10 border border-gray-700 p-3">
      <div className="text-xl font-bold">Top tags:</div>
      <div>
        {topTags?.map((t) => (
          <div key={t}>
            <Tag tag={'#' + t} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Side;
