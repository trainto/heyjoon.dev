import useStore, { dispatch } from '@/lib/store';
import Avatar from './avatar';
import { format } from 'date-fns';
import Button from '../button';
import { ChangeEvent, useCallback, useState } from 'react';
import { sendRequest } from '@/lib/api/fetchers';
import { Storage } from '@/lib/utils-client';
import { mutate } from 'swr';

export default function MyInfo() {
  const { value: userInfo, dispatch: dispatchUserInfo } = useStore('userInfo');

  const [edit, setEdit] = useState(false);
  const [nickname, setNickname] = useState(() => userInfo?.nickname ?? '');
  const [intro, setIntro] = useState(() => userInfo?.intro ?? '');

  const onSignout = useCallback(async () => {
    const res = await sendRequest<undefined>({ method: 'POST', url: '/places/auth/signout' });

    if (res.status === 200) {
      Storage.remove('isLogin');
      mutate('/places/users/me', null);
      dispatchUserInfo(null);
      dispatch('layer', null);
    }
  }, [dispatchUserInfo]);

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
    <div className="user-info-container text-sm">
      <div className="flex justify-center">
        <Avatar src={userInfo.avatar} size={92} />
      </div>

      <div className="border border-gray-600 mt-5 px-2 py-2">
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
              <Button color="zinc" size="xs" onClick={() => setEdit(false)}>
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
        .user-info-container {
          width: 20rem;
        }

        input:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}
