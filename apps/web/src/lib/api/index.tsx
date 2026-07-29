import UserDetail from '@/components/places/user-detail';
import { mutate } from 'swr';
import { dispatchEvent } from '../event-bus';
import { dispatch } from '../store';
import { storage } from '../utils-client';
import { sendRequest } from './fetchers';

export const signin = async (token: string) => {
  const res = await sendRequest({
    method: 'post',
    url: '/places/auth/signin-with-google',
    data: { token },
  });

  if (res.status === 200) {
    if (res.data) {
      dispatch('userInfo', res.data);
      storage.set('isLogin', true);
      dispatchEvent('fetchPlaces');
    }
  } else if (res.status === 202) {
    if (res.data) {
      dispatch('layer', {
        node: <UserDetail userInfo={res.data} isSignUp={true} />,
        containerClassName: 'w-full sm:w-96',
      });
    } else {
      dispatch('modal', {
        msg: 'Your sign-up is being reviewed. Please wait for the approval. Thank you!',
      });
    }
  }
};

export const signout = async () => {
  const res = await sendRequest<undefined>({ method: 'POST', url: '/places/auth/signout' });

  if (res.status === 200) {
    storage.remove('isLogin');
    mutate('/places/users/me', null);
    dispatch('userInfo', null);
    dispatch('layer', null);
  }
};
