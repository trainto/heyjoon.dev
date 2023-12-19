import { format } from 'date-fns';
import { memo, useMemo } from 'react';
import Tag from './tag';
import Image from 'next/image';
import Avatar from './avatar';

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
    <div className="place border border-gray-700 p-2 rounded">
      <div className="flex justify-between items-center">
        <div>
          <Avatar src={place.avatar} size={24} nickname={place.nickname} />
        </div>
        <div className="text-xs text-gray-500">{createdAt}</div>
      </div>
      <div className="img-container my-2 rounded-md">
        <div className="grid content-center">
          <Image
            className="rounded-md my-auto"
            src="https://www.teenaagnel.com/wp-content/uploads/2019/12/food-photography-in-dubai.jpg"
            alt="food"
            sizes="100vw"
            width={0}
            height={0}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
      <div>{built}</div>
    </div>
  );
};

export default memo(Place);
