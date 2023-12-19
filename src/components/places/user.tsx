import useStore from '@/lib/store';
import Avatar from './avatar';

const User = () => {
  const { value: userInfo } = useStore('userInfo');

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
      </div>
    </>
  );
};

export default User;
