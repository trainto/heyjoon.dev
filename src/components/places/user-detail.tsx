import { signout } from '@/lib/api';
import { fetcher, sendRequest } from '@/lib/api/fetchers';
import useStore, { dispatch } from '@/lib/store';
import { imgToDataURL } from '@/lib/utils-client';
import { format } from 'date-fns';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import Button from '../button';
import Avatar from './avatar';
import AvatarEditor from './avatar-editor';
import { Edit } from './svg';

export default function UserDetail({
  userEmail,
  userInfo,
  isSignUp = false,
}: {
  userEmail?: string;
  userInfo?: UserInfo;
  isSignUp?: boolean;
}) {
  const [info, setInfo] = useState<UserInfo>();
  const [avatarEdit, setAvatarEdit] = useState<string>();
  const [edit, setEdit] = useState(() => (isSignUp ? true : false));
  const [nickname, setNickname] = useState('');
  const [intro, setIntro] = useState('');

  const { value: myInfo, dispatch: dispatchUserInfo } = useStore('userInfo');

  const { data: userInfoFetched } = useSWR<UserInfo>(
    userEmail ? '/places/users/' + userEmail : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const isMe = useMemo(() => {
    if (myInfo) {
      if (!userEmail && !userInfo) {
        return true;
      }

      if (userEmail) {
        return myInfo.email === userEmail;
      }

      if (userInfo) {
        return userInfo.email === myInfo.email;
      }
    }

    return false;
  }, [myInfo, userEmail, userInfo]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let info = userInfo ? userInfo : myInfo;

    if (info == null && userInfoFetched) {
      info = userInfoFetched;
    }

    setInfo(info ?? undefined);
    setNickname(info?.nickname ?? '');
    setIntro(info?.intro ?? '');
  }, [myInfo, userEmail, userInfo, userInfoFetched]);

  const handleAvatarSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      const url = await imgToDataURL(file);
      setAvatarEdit(url);
    }
  };

  const onSignout = useCallback(async () => {
    await signout();
  }, []);

  const onCancel = useCallback(() => {
    setEdit(false);
    setNickname(info?.nickname ?? '');
    setIntro(info?.intro ?? '');
  }, [info?.intro, info?.nickname]);

  const onSave = useCallback(async () => {
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

  const onSignUp = useCallback(async () => {
    const res = await sendRequest({
      method: 'POST',
      url: '/places/auth/signup',
      data: { ...userInfo, nickname, intro },
    });

    if (res.status === 201) {
      dispatch('layer', null);
      dispatch('modal', {
        msg:
          'Thank you for signing up! Admin will review your sign up and approve.' +
          ' If it is not approved within 7 days, your personal information will be discarded completely.' +
          '<br><br>Inquiry: you@heyjoon.dev',
      });
    }
  }, [intro, nickname, userInfo]);

  if (info == null) {
    return null;
  }

  if (avatarEdit) {
    return <AvatarEditor src={avatarEdit} onComplete={() => setAvatarEdit(undefined)} />;
  }

  return (
    <div>
      <div className="flex justify-center">
        <div className="relative">
          <div className="">
            <Avatar src={info.avatar} size={92} />
          </div>

          {!isSignUp && isMe && (
            <>
              <div role="button" className="edit-btn" onClick={() => fileInputRef.current?.click()}>
                <Edit size={18} />
              </div>
              <div className="hidden">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg, image/png"
                  onChange={handleAvatarSelected}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border border-gray-600 mt-5 px-2 py-2 text-sm rounded-md">
        <div className="flex items-center">
          <div className="basis-20">Email:</div>
          <div className="px-1 py-1">{info.email}</div>
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

        {!isSignUp && isMe && (
          <div className="flex justify-end mt-2">
            {edit ? (
              <div className="flex space-x-2">
                <Button color="zinc" size="xs" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  color="indigo"
                  size="xs"
                  onClick={onSave}
                  disabled={nickname.trim() === '' || nickname.trim().length < 3}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button color="indigo" size="xs" onClick={() => setEdit(true)}>
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {!isSignUp && (
        <div className="mt-3 text-xs flex justify-end text-gray-400">
          Since: {format(new Date(info.createdAt), 'MMM dd, yyyy')}
        </div>
      )}

      <div className="flex justify-end mt-3 mb-1">
        {isSignUp ? (
          <Button
            color="indigo"
            size="base"
            onClick={onSignUp}
            disabled={nickname.trim() === '' || nickname.trim().length < 3}
          >
            Sign Up
          </Button>
        ) : isMe ? (
          <Button color="zinc" size="sm" onClick={onSignout}>
            Sign Out
          </Button>
        ) : null}
      </div>

      <style jsx>{`
        input:focus {
          outline: none !important;
        }

        .edit-btn {
          position: absolute;
          top: 0;
          right: 0;
          margin-right: -12px;
        }
      `}</style>
    </div>
  );
}
