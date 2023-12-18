import { fetcher } from '@/lib/api/fetchers';
import useSWR from 'swr';
import Tag from './tag';

const TopTags = () => {
  const { data: topTags } = useSWR<string[]>('/places/tags/top?limit=5', fetcher);

  return (
    <div>
      {topTags?.map((t) => (
        <div key={t}>
          <Tag tag={'#' + t} />
        </div>
      ))}
    </div>
  );
};

export default TopTags;
