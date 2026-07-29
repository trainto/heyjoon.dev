import { dispatch } from '@/lib/store';
import { useCallback, useEffect, useRef } from 'react';
import useSWR from 'swr';
import Fetcher from '../common/fetcher';
import Avatar from './avatar';
import UserDetail from './user-detail';

export default function Likes({ placeId }: { placeId: number }) {
  const fetcherKey = `/places/likes/${placeId}`;

  const { data: likes } =
    useSWR<{ nickname: string; avatar: string; intro?: string }[]>(fetcherKey);

  const contentDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (likes == null) {
      return;
    }

    const container = document.querySelector('.layer-container');
    if (container == null || contentDiv.current == null) {
      return;
    }

    const height = container?.clientHeight - 30 - 30;
    contentDiv.current.style.height = height < 320 ? '320px' : height + 'px';
  }, [likes]);

  const onAvatarClick = useCallback(() => {
    dispatch('layer', { node: <UserDetail />, containerClassName: 'w-full sm:w-96' });
  }, []);

  return (
    <Fetcher swrKey={fetcherKey} loading={<div style={{ height: '320px' }}></div>}>
      <div className="overflow-y-auto dark-scroller" ref={contentDiv}>
        {likes &&
          likes.map((l) => (
            <div key={l.nickname} className="flex space-x-5 items-center like my-5">
              <div className="flex-none">
                <Avatar src={l.avatar} size={38} onClick={onAvatarClick} />
              </div>

              <div className="text-sm">
                <div className="text-gray-300">@{l.nickname}</div>
                {l.intro && <div>{l.intro}</div>}
              </div>
            </div>
          ))}
      </div>
    </Fetcher>
  );
}
