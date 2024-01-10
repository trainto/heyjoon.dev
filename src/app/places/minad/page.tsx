'use client';

import Button from '@/components/button';
import Avatar from '@/components/places/avatar';
import { fetcher } from '@/lib/api/fetchers';
import { format } from 'date-fns';
import useSWR from 'swr';

export default function Minad() {
  const { data: waitingList, error } = useSWR<UserInfo[]>('/places/admin/users-waiting', fetcher);

  const approve = (email: string) => {
    //
  };

  if (error) {
    return <div className="text-center">Who the fucking are you?</div>;
  }

  return (
    <div>
      {waitingList &&
        waitingList.map((u) => (
          <div
            key={u.email}
            className="flex items-center space-x-3 border border-gray-500 px-1 py-2"
          >
            <div>
              <Avatar src={u.avatar} size={24} />
            </div>
            <div>{u.email}</div>
            <div>{u.nickname}</div>
            <div>{u.intro}</div>
            <div>{format(u.createdAt, 'MMM dd, yyyy')}</div>
            <div>
              <Button color="indigo" size="sm" onClick={() => approve(u.email)}>
                Approve
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
