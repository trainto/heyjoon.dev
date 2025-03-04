'use client';

import { fetcher } from '@/lib/api/fetchers';
import { useScrollHitTheBottom } from '@/lib/hooks';
import { format } from 'date-fns';
import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';

const Contributions = () => {
  const { data, setSize, isLoading } = useSWRInfinite<{ items: GithubPR[]; total_count: number }>(
    (page, prevData) => {
      if (prevData && prevData.items.length < 30) {
        return null;
      }

      return '/github/pr?page=' + (page + 1);
    },
    fetcher,
  );

  const loadMore = useCallback(() => {
    if (data && data[data.length - 1].items.length < 30) {
      return;
    }

    setSize((p) => p + 1);
  }, [data, setSize]);

  useScrollHitTheBottom(loadMore);

  if (isLoading && data == null) {
    return null;
  }

  return (
    <div className="mt-14">
      <h3 className="font-bold text-3xl">
        Contributions <span className="text-sm">(Github)</span>
      </h3>
      <ul className="marker:text-brand2 mt-5">
        {data?.map((page) =>
          page.items.map((pr) => (
            <li key={pr.id} className="mb-3">
              <a href={pr.html_url} target="_blank">
                {pr.title}
              </a>
              <br />
              <div className="text-sm">
                <span className="text-gray-300">{pr.repository_url.split('/repos/')[1]}</span>
                <span className="text-gray-400">
                  , {format(new Date(pr.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
            </li>
          )),
        )}
      </ul>
    </div>
  );
};

export default Contributions;
