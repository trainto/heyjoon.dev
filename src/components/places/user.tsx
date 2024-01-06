import { signout } from '@/lib/api';
import useStore, { dispatch } from '@/lib/store';
import { format } from 'date-fns';
import { useCallback } from 'react';
import Button from '../button';
import Avatar from './avatar';
import MyInfo from './my-info';

const User = () => {
  const { value: userInfo } = useStore('userInfo');

  const onSignout = useCallback(async () => {
    await signout();
  }, []);

  const onAvatarClick = useCallback(() => {
    dispatch('layer', { node: <MyInfo />, containerClassName: 'w-full sm:w-96' });
  }, []);

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <div className="hidden sm:block">
        <div className="flex justify-center">
          <Avatar size={92} src={userInfo.avatar} onClick={onAvatarClick} />
        </div>
        <div className="flex justify-end mt-3">
          <div className="text-sm">@{userInfo.nickname}</div>
        </div>
        {userInfo.intro && (
          <div className="flex justify-end mt-2 text-gray-400 text-sm">
            <div>{userInfo.intro}</div>
          </div>
        )}
        <div className="flex justify-end mt-1 text-gray-500 text-sm">
          Since: {format(new Date(userInfo.createdAt), 'MMM dd, yyyy')}
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
