'use client';

import { fetcher } from '@/lib/api/fetchers';
import useSWR from 'swr';
import Image from 'next/image';
import useStore from '@/lib/store';
import { useEffect } from 'react';
import { Storage } from '../../lib/utils-client';
import TopTags from './top-tags';

const Side = () => {
  const { value: userInfo, dispatch: dispatchUserInfo } = useStore('userInfo');

  const { data: userInfoFetched } = useSWR<UserInfo>(
    '/places/users/me',
    userInfo || !Storage.get('isLogin') ? null : fetcher,
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  useEffect(() => {
    if (userInfoFetched && userInfo == null) {
      dispatchUserInfo(userInfoFetched);
    }
  }, [dispatchUserInfo, userInfo, userInfoFetched]);

  return (
    <div className="sm:sticky sm:top-20 border border-gray-700 p-3 rounded">
      <div>
        {userInfo ? (
          <div>{userInfo.nickname}</div>
        ) : (
          <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=812386537061-qc8e0lcpg5gopjtoh7q2ap39kqdr3c2g.apps.googleusercontent.com&redirect_uri=http://localhost:3000/places/auth/google-auth&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile">
            <Image src="/continue-google.png" alt="Continue with Google" width={170} height={36} />
          </a>
        )}
      </div>

      <div className="text-xl font-bold mt-5 border-t border-gray-500 pt-2">Top tags:</div>
      <div className="mt-1 px-1 text-sm">
        <TopTags />
      </div>
    </div>
  );
};

export default Side;
