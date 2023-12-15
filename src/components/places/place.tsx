import { format } from 'date-fns';
import { memo, useMemo } from 'react';
import Tag from './tag';

const Place = ({ place }: { place: Place }) => {
  const built = useMemo(() => {
    return place.desc
      .split(/(#[^\s#]+)/)
      .map((s, i) => (s.startsWith('#') ? <Tag key={i} tag={s} /> : s));
  }, [place.desc]);

  const createdAt = useMemo(
    () => format(new Date(place.createdAt), 'MMM dd, yyyy'),
    [place.createdAt],
  );

  return (
    <div className="place border border-gray-700 p-2">
      <div className="flex justify-between">
        <div>Circle profile</div>
        <div className="text-xs text-gray-500">{createdAt}</div>
      </div>
      <div>Image</div>
      <div>{built}</div>
    </div>
  );
};

export default memo(Place);
