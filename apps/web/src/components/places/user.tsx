import { dispatch, useSante } from '@/lib/store';
import { format } from 'date-fns';
import { useCallback } from 'react';
import Avatar from './avatar';
import UserDetail from './user-detail';

const User = () => {
  const { userInfo } = useSante(['userInfo']);

  const onAvatarClick = useCallback(() => {
    dispatch('layer', { node: <UserDetail />, containerClassName: 'w-full sm:w-96' });
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
      </div>
    </>
  );
};

export default User;
