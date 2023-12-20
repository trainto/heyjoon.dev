import { memo, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import useStore from '@/lib/store';
import useSWR from 'swr';
import { fetcher, sendRequest } from '@/lib/api/fetchers';
import { Storage } from '@/lib/utils-client';

const Signin = ({ width }: { width: number }) => {
  const { value: userInfo, dispatch: dispatchUserInfo } = useStore('userInfo');

  const { data: userInfoFetched } = useSWR<UserInfo>(
    '/places/users/me',
    userInfo || !Storage.get('isLogin') ? null : fetcher,
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  const signin = useCallback(
    async (token: string) => {
      const res = await sendRequest({
        method: 'post',
        url: '/places/auth/signin-with-google',
        data: { token },
      });

      if (res?.status === 200) {
        if (res.data) {
          dispatchUserInfo(res.data);
          Storage.set('isLogin', true);
        }
      }
    },
    [dispatchUserInfo],
  );

  useEffect(() => {
    if (userInfoFetched && userInfo == null) {
      dispatchUserInfo(userInfoFetched);
    }
  }, [dispatchUserInfo, userInfo, userInfoFetched]);

  useEffect(() => {
    const handler = (ev: MessageEvent<{ googleToken: string }>) => {
      if (ev.data.googleToken) {
        signin(ev.data.googleToken);
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [signin]);

  const googleAuthUrl = useMemo(
    () =>
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=812386537061-qc8e0lcpg5gopjtoh7q2ap39kqdr3c2g.apps.googleusercontent.com' +
      `&redirect_uri=${
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://heyjoon.dev'
      }/places/auth/google-auth` +
      '&response_type=token' +
      '&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    [],
  );

  const height = useMemo(
    () =>
      // 378 * 80
      (80 * width) / 378,
    [width],
  );

  return (
    <Image
      src="/continue-google.png"
      alt="Continue with Google"
      width={width}
      height={height}
      onClick={() => window.open(googleAuthUrl, 'google-auth', 'width=480,height=640')}
    />
  );
};

export default memo(Signin);
