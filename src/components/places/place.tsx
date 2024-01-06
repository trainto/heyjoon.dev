import { sendRequest } from '@/lib/api/fetchers';
import { CDN_URL } from '@/lib/constants';
import useStore from '@/lib/store';
import { format } from 'date-fns';
import Image from 'next/image';
import { memo, useEffect, useMemo, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Avatar from './avatar';
import { Heart } from './svg';
import Tag from './tag';

import 'swiper/css';
import 'swiper/css/pagination';

const Place = ({ place }: { place: Place }) => {
  const [liked, setLiked] = useState(() => !!place.likedByMe);
  const [likes, setLikes] = useState(() => place.likes);

  const { value: userInfo } = useStore('userInfo');

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

  useEffect(() => {
    setLiked(!!userInfo && !!place.likedByMe);
  }, [place, userInfo]);

  const handleLike = async () => {
    if (userInfo == null) {
      return;
    }

    const current = liked;
    const res = current
      ? await sendRequest({ method: 'DELETE', url: '/places/likes/' + place.id })
      : await sendRequest({ method: 'POST', url: '/places/likes/' + place.id });

    if (res.status === 200) {
      setLiked((p) => !p);
      setLikes((p) => (current ? p - 1 : p + 1));
    }
  };

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
                  className="rounded-md"
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

      <div className="flex justify-end items-center space-x-3 px-3 text-xs text-gray-400">
        <div className="flex space-x-1">
          <div role="button" onClick={handleLike}>
            <Heart size={18} color={liked ? 'red' : 'empty'} />
          </div>
          <div>{likes}</div>
        </div>

        <div>|</div>

        <div role="button">Comments: 0</div>
      </div>
    </div>
  );
};

export default memo(Place);
