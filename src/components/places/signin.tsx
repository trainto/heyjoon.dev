import { signin } from '@/lib/api';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import google from '../../../public/continue-google.png';

const Signin = ({ width, from }: { width: number; from: string }) => {
  const doneRef = useRef(false);

  const signIn = useCallback(async (token: string) => {
    doneRef.current = true;
    setTimeout(() => {
      doneRef.current = false;
    }, 3000);

    await signin(token);
  }, []);

  useEffect(() => {
    const handler = (ev: MessageEvent<{ googleToken: string; from: string }>) => {
      if (doneRef.current) {
        return;
      }

      if (ev.data.from !== from) {
        return;
      }

      if (ev.data.googleToken) {
        signIn(ev.data.googleToken);
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [from, signIn]);

  const googleAuthUrl = useMemo(
    () =>
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=812386537061-qc8e0lcpg5gopjtoh7q2ap39kqdr3c2g.apps.googleusercontent.com' +
      `&redirect_uri=${
        process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://heyjoon.dev'
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
