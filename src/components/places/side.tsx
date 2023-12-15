'use client';

import { fetcher } from '@/lib/api/fetchers';
import useSWR from 'swr';
import Tag from './tag';
import Loading from './loading';

const Side = () => {
  const { data: topTags, isLoading } = useSWR<string[]>('/places/tags/top?limit=5', fetcher);

  return (
    <div className="sm:sticky sm:top-10 border border-gray-700 p-3">
      <div className="text-xl font-bold">Top tags:</div>
      {isLoading && (
        <div className="flex justify-center mt-2">
          <Loading />
        </div>
      )}
      <div className="mt-1 px-1">
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
