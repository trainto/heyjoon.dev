import { mutate } from 'swr';
import { dispatch } from '../store';
import { storage } from '../utils-client';
import { sendRequest } from './fetchers';

export const signout = async () => {
  const res = await sendRequest<undefined>({ method: 'POST', url: '/places/auth/signout' });

  if (res.status === 200) {
    storage.remove('isLogin');
    mutate('/places/users/me', null);
    dispatch('userInfo', null);
    dispatch('layer', null);
  }
};
