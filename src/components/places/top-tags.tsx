import useSWR from 'swr';
import Fetcher from '../common/fetcher';
import Tag from './tag';

const TopTags = () => {
  const fetcherKey = '/places/tags/top?limit=5';

  const { data: topTags } = useSWR<string[]>(fetcherKey);

  return (
    <Fetcher swrKey={fetcherKey} fallbackData={[]}>
      <div>
        {topTags?.map((t) => (
          <div key={t}>
            <Tag tag={'#' + t} />
          </div>
        ))}
      </div>
    </Fetcher>
  );
};

export default TopTags;
