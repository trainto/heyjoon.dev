import { signout } from '@/lib/api';
import { sendRequest } from '@/lib/api/fetchers';
import useStore from '@/lib/store';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import Button from '../button';
import Avatar from './avatar';

export default function MyInfo() {
  const { value: userInfo, dispatch: dispatchUserInfo } = useStore('userInfo');

  const [edit, setEdit] = useState(false);
  const [nickname, setNickname] = useState(() => userInfo?.nickname ?? '');
  const [intro, setIntro] = useState(() => userInfo?.intro ?? '');

  const onSignout = useCallback(async () => {
    await signout();
  }, []);

  const onCancel = useCallback(() => {
    setEdit(false);
    setNickname(userInfo?.nickname ?? '');
    setIntro(userInfo?.intro ?? '');
  }, [userInfo?.intro, userInfo?.nickname]);

  const onSave = useCallback(async () => {
    //
    const res = await sendRequest({
      method: 'PATCH',
      url: '/places/users/me',
      data: { nickname, intro },
    });

    if (res.status === 200) {
      dispatchUserInfo((p) => (p ? { ...p, nickname, intro } : p));
      setEdit(false);
    }
  }, [dispatchUserInfo, intro, nickname]);

  if (userInfo == null) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-center">
        <Avatar src={userInfo.avatar} size={92} />
      </div>

      <div className="border border-gray-600 mt-5 px-2 py-2 text-sm">
        <div className="flex items-center">
          <div className="basis-20">Email:</div>
          <div className="px-1 py-1">{userInfo.email}</div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="basis-20">Nickname:</div>
          <div className="grow">
            {edit ? (
              <input
                className="w-full bg-bg-main border border-gray-700 px-1 py-1 focus:border-brand1"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 20))}
              />
            ) : (
              <div className="px-1 py-1">{nickname}</div>
            )}
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="basis-20">Intro:</div>
          <div className="grow">
            {edit ? (
              <input
                className="w-full bg-bg-main border border-gray-700 px-1 py-1 focus:border-brand1"
                value={intro}
                onChange={(e) => setIntro(e.target.value.slice(0, 100))}
              />
            ) : (
              <div className="px-1 py-1">{intro}</div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          {edit ? (
            <div className="flex space-x-2">
              <Button color="zinc" size="xs" onClick={onCancel}>
                Cancel
              </Button>
              <Button color="indigo" size="xs" onClick={onSave}>
                Save
              </Button>
            </div>
          ) : (
            <Button color="indigo" size="xs" onClick={() => setEdit(true)}>
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs flex justify-end text-gray-400">
        Since: {format(new Date(userInfo.createdAt), 'MMM dd, yyyy')}
      </div>

      <div className="flex justify-end mt-3 mb-1">
        <Button color="zinc" size="sm" onClick={onSignout}>
          Sign out
        </Button>
      </div>

      <style jsx>{`
        input:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}
