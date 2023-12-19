import useStore, { dispatch } from '@/lib/store';
import Avatar from './avatar';
import Button from '../button';
import { useCallback } from 'react';
import { sendRequest } from '@/lib/api/fetchers';
import { Storage } from '@/lib/utils-client';
import { mutate } from 'swr';

const User = () => {
  const { value: userInfo } = useStore('userInfo');

  const onSignout = useCallback(async () => {
    const res = await sendRequest<undefined>({ method: 'POST', url: '/places/auth/signout' });

    if (res.status === 200) {
      Storage.remove('isLogin');
      mutate('/places/users/me', null);
      dispatch('userInfo', null);
    }
  }, []);

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <div className="hidden sm:block">
        <div className="flex justify-center">
          <Avatar size={72} src={userInfo.avatar} />
        </div>
        <div className="flex justify-center mt-3">
          <div className="text-sm">@{userInfo.nickname}</div>
        </div>
        <div className="flex justify-end mt-3">
          <Button
            className="text-xs text-gray-400 font-bold bg-black px-3 py-1 rounded-lg"
            onClick={onSignout}
          >
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
};

export default User;
