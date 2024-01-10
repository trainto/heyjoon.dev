import { sendRequest } from '@/lib/api/fetchers';
import { dispatchEvent } from '@/lib/event-bus';
import useStore, { dispatch } from '@/lib/store';
import { storage } from '@/lib/utils-client';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import google from '../../../public/continue-google.png';
import UserDetail from './user-detail';

const Signin = ({ width, from }: { width: number; from: string }) => {
  const { dispatch: dispatchUserInfo } = useStore('userInfo');

  const doneRef = useRef(false);

  const signin = useCallback(
    async (token: string) => {
      doneRef.current = true;
      setTimeout(() => {
        doneRef.current = false;
      }, 3000);

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
      } else if (res.status === 202) {
        if (res.data) {
          dispatch('layer', {
            node: <UserDetail userInfo={res.data} isSignUp={true} />,
            containerClassName: 'w-full sm:w-1/3',
          });
        } else {
          dispatch('modal', {
            msg: 'Your sign-up is being reviewed. Please wait for the approval. Thank you!',
          });
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

  return (
    <Image
      src={google}
      role="button"
      alt="Continue with Google"
      width={width}
      style={{ height: 'auto' }}
      onClick={() => window.open(googleAuthUrl, 'google-auth=' + from, 'width=480,height=640')}
    />
  );
};

export default memo(Signin);
