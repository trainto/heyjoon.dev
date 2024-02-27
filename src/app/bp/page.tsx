'use client';

import Button from '@/components/button';
import { useCallback, useState } from 'react';

export default function BP() {
  const [systolic, setSystolic] = useState<number>();
  const [diastolic, setDiastolic] = useState<number>();

  const onConfirm = useCallback(() => {}, []);

  return (
    <>
      <div className="flex space-x-5 px-14 items-end justify-center mt-40">
        <div className="flex items-end space-x-2">
          <input
            type="number"
            className="text-center bg-bg-main border-b w-20 text-3xl p-1 outline-none"
            value={systolic}
            onChange={(e) => setSystolic(parseInt(e.target.value))}
          />
        </div>

        <div className="text-gray-400">/</div>

        <div className="flex justify-end items-end space-x-2">
          <input
            type="number"
            className="text-center bg-bg-main border-b w-20 text-3xl p-1 outline-none"
            value={diastolic}
            onChange={(e) => setDiastolic(parseInt(e.target.value))}
          />
        </div>

        <div className="text-gray-600 text-sm">mmHg</div>
      </div>

      <div className="text-end pt-10 pr-10 mb-40">
        <Button color="indigo" size="lg" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
}
