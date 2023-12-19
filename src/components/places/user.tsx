import useStore from '@/lib/store';
import Image from 'next/image';

const User = () => {
  const { value: userInfo } = useStore('userInfo');

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <div className="hidden sm:block">
        <div className="flex justify-center">
          <Image
            className="rounded-full"
            src={userInfo.avatar}
            alt="Avatar"
            width="68"
            height="68"
          />
        </div>
        <div className="flex justify-center mt-3">
          <div className="text-sm">@{userInfo.nickname}</div>
        </div>
      </div>
    </>
  );
};

export default User;
