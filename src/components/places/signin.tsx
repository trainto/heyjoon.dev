import { sendRequest } from '@/lib/api/fetchers';
import { dispatchEvent } from '@/lib/event-bus';
import useStore from '@/lib/store';
import { storage } from '@/lib/utils-client';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

const Signin = ({ width, from }: { width: number; from: string }) => {
  const { dispatch: dispatchUserInfo } = useStore('userInfo');

  const doneRef = useRef(false);

  const signin = useCallback(
    async (token: string) => {
      doneRef.current = true;
      const res = await sendRequest({
        method: 'post',
        url: '/places/auth/signin-with-google',
        data: { token },
      });

      if (res.status === 200) {
        if (res.data) {
          dispatchUserInfo(res.data);
          storage.set('isLogin', true);
          dispatchEvent('fetchPlaces');
        }
      } else if (res.status === 201) {
        if (res.data) {
          // show signup form
        } else {
          // show alert
          alert('Your sign-up has been reviewing.');
        }
      }
    },
    [dispatchUserInfo],
  );

  useEffect(() => {
    const handler = (ev: MessageEvent<{ googleToken: string; from: string }>) => {
      if (doneRef.current) {
        return;
      }

      if (ev.data.from !== from) {
        return;
      }

      if (ev.data.googleToken) {
        signin(ev.data.googleToken);
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [from, signin]);

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
      // 350 * 80
      (80 * width) / 350,
    [width],
  );

  return (
    <Image
      src="/continue-google.png"
      alt="Continue with Google"
      width={width}
      height={height}
      onClick={() => window.open(googleAuthUrl, 'google-auth=' + from, 'width=480,height=640')}
    />
  );
};

export default memo(Signin);
