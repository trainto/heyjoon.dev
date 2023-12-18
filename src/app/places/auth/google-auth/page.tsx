'use client';

import { sendRequest } from '@/lib/api/fetchers';
import { dispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Storage } from '../../../../lib/utils-client';

export default function GoogleAuth() {
  const router = useRouter();

  useEffect(() => {
    const signin = async (token: string) => {
      const res = await sendRequest({
        method: 'post',
        url: '/places/auth/signin-with-google',
        data: { token },
      });

      if (res?.status === 200) {
        if (res.data) {
          dispatch('userInfo', res.data);
        }
        Storage.set('isLogin', true);
        router.push('/places');
      }
    };

    const tokenParam = window.location.hash.split('&').find((v) => {
      return v.includes('access_token=');
    });

    if (!tokenParam) {
      return;
    }

    const token = tokenParam.split('=')[1];
    signin(token);
  }, [router]);
  return <></>;
}
