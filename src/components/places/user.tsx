import useStore from '@/lib/store';
import Avatar from './avatar';
import Button from '../button';
import { useCallback } from 'react';
import { sendRequest } from '@/lib/api/fetchers';
import { Storage } from '@/lib/utils-client';
import { mutate } from 'swr';

const User = () => {
  const { value: userInfo, dispatch: dispatchUserInfo } = useStore('userInfo');

  const onSignout = useCallback(async () => {
    const res = await sendRequest<undefined>({ method: 'POST', url: '/places/auth/signout' });

    if (res.status === 200) {
      Storage.remove('isLogin');
      mutate('/places/users/me', null);
      dispatchUserInfo(null);
    }
  }, [dispatchUserInfo]);

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
          <Button color="zinc" size="xs" onClick={onSignout}>
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
};

export default User;
