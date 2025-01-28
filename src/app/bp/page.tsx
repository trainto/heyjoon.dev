'use client';

import Button from '@/components/button';
import { sendRequest } from '@/lib/api/fetchers';
import useStore from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function BP() {
  const [systolic, setSystolic] = useState<number | string>('');
  const [diastolic, setDiastolic] = useState<number | string>('');

  const { value: userInfo } = useStore('userInfo');

  const systolicRef = useRef<HTMLInputElement>(null);
  const diastolicRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (systolicRef.current) {
      systolicRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (Number.isInteger(systolic) && (systolic as number) > 100) {
      if (diastolicRef.current) {
        diastolicRef.current.focus();
      }
    }
  }, [systolic]);

  const onConfirm = useCallback(async () => {
    const res = await sendRequest({ method: 'post', url: '/bp', data: { systolic, diastolic } });
    if (res.status === 200) {
      router.push('/bp/history');
    }
  }, [diastolic, router, systolic]);

  if (userInfo?.email !== 'trainto@gmail.com') {
    return <div className="text-center">Who the fuck are you?</div>;
  }

  return (
    <>
      <div className="flex space-x-5 px-14 items-end justify-center mt-40">
        <div className="flex items-end space-x-2">
          <input
            type="number"
            className="text-center bg-bg-main border-b w-20 text-3xl p-1 outline-none placeholder-gray-700"
            placeholder="120"
            ref={systolicRef}
            value={systolic}
            onChange={(e) => {
              if (parseInt(e.target.value)) {
                setSystolic(parseInt(e.target.value));
              } else {
                setSystolic('');
              }
            }}
          />
        </div>

        <div className="text-gray-400">/</div>

        <div className="flex justify-end items-end space-x-2">
          <input
            type="number"
            className="text-center bg-bg-main border-b w-20 text-3xl p-1 outline-none placeholder-gray-700"
            placeholder="80"
            ref={diastolicRef}
            value={diastolic}
            onChange={(e) => {
              if (parseInt(e.target.value)) {
                setDiastolic(parseInt(e.target.value));
              } else {
                setDiastolic('');
              }
            }}
          />
        </div>

        <div className="text-gray-600 text-sm">mmHg</div>
      </div>

      <div className="text-end pt-10 pr-10 mb-10">
        <Button color="indigo" size="lg" onClick={onConfirm} disabled={!systolic || !diastolic}>
          Confirm
        </Button>
      </div>

      <div className="text-center mb-40">
        <Link href="/bp/history">Go to hisotry</Link>
      </div>
    </>
  );
}
