import { format } from 'date-fns';
import { memo, useMemo } from 'react';
import Tag from './tag';
import Image from 'next/image';
import Avatar from './avatar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

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

  const images = useMemo(() => place.images.split(','), [place.images]);

  return (
    <div className="place border border-gray-700 py-2 px-1 rounded">
      <div className="flex justify-between items-center px-1">
        <div>
          <Avatar src={place.avatar} size={24} nickname={place.nickname} />
        </div>
        <div className="text-xs text-gray-500">{createdAt}</div>
      </div>

      <div className="relative bg-black w-full pt-100 my-2 rounded-md">
        <div className="place-images absolute top-0 right-0 bottom-0 left-0 grid content-center">
          <Swiper modules={[Pagination]} slidesPerView={1} pagination={{ clickable: true }}>
            {images.map((src) => (
              <SwiperSlide key={src.split('.')[0]}>
                <Image
                  src={'https://cdn.heyjoon.dev/places/' + src}
                  alt="food"
                  fill={true}
                  style={{ objectFit: 'contain' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="px-1 text-sm">{built}</div>
    </div>
  );
};

export default memo(Place);
