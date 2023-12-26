import { format } from 'date-fns';
import { memo, useMemo, useRef } from 'react';
import Tag from './tag';
import Image from 'next/image';
import Avatar from './avatar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { CDN_URL } from '@/lib/constants';

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

      <div className="relative bg-black w-full pt-100 mt-2 rounded-md">
        <div className="place-images absolute top-0 right-0 bottom-0 left-0 grid content-center">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true, el: `.swiper-pagination-container-${place.id}` }}
          >
            {images.map((src) => (
              <SwiperSlide key={src.split('.')[0]}>
                <Image
                  src={CDN_URL + src}
                  alt="food"
                  fill={true}
                  style={{ objectFit: 'contain' }}
                  loading="lazy"
                />
                <div className="swiper-lazy-preloader"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div
        className={`swiper-pagination-container-${place.id} swiper-pagination swiper-pagination-clickable swiper-pagination-horizontal`}
      ></div>

      <div className="px-1 text-sm my-2">{built}</div>
    </div>
  );
};

export default memo(Place);
