import { sendRequest } from '@/lib/api/fetchers';
import { dispatch } from '@/lib/store';
import { memo, useCallback, useEffect } from 'react';
import { Storage } from '@/lib/utils-client';

const LoginHandler = () => {
  const signin = useCallback(async (token: string) => {
    const res = await sendRequest({
      method: 'post',
      url: '/places/auth/signin-with-google',
      data: { token },
    });

    if (res?.status === 200) {
      if (res.data) {
        dispatch('userInfo', res.data);
        Storage.set('isLogin', true);
      }
    }
  }, []);

  useEffect(() => {
    const handler = (ev: MessageEvent<{ googleToken: string }>) => {
      if (ev.data.googleToken) {
        signin(ev.data.googleToken);
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [signin]);

  return null;
};

export default memo(LoginHandler);
