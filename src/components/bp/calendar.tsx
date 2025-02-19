'use client';

import { fetcher } from '@/lib/api/fetchers';
import { useEventBus } from '@/lib/event-bus';
import {
  addDays,
  addMonths,
  endOfMonth,
  getDay,
  getMonth,
  getYear,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import Button from '../button';
import Cell from './Cell';

export default function Calendar() {
  const today = new Date();

  const [start, setStart] = useState(() => startOfMonth(today));
  const [end, setEnd] = useState(() => endOfMonth(today));
  const [daysArr, setDaysArr] = useState<Date[][]>([]);

  const { data, mutate } = useSWR<BP[]>(() => {
    if (isBefore(end, start)) {
      return null;
    }
    return `/bp?start=${start.getTime()}&end=${end.getTime()}`;
  }, fetcher);

  useEventBus('bpDeleted', () => mutate());

  useEffect(() => {
    setEnd(endOfMonth(start));
  }, [start]);

  useEffect(() => {
    if (isBefore(end, start)) {
      return;
    }

    setDaysArr(() => {
      const arr: Date[][] = [];
      let currentDate = new Date(start);

      while (isSameMonth(currentDate, end)) {
        arr.push([]);

        for (let i = 0; i < 7; i += 1) {
          if (getDay(currentDate) === i) {
            arr[arr.length - 1][i] = new Date(currentDate);
            currentDate = addDays(currentDate, 1);
          }

          if (!isSameMonth(currentDate, end)) {
            break;
          }
        }
      }

      return arr;
    });
  }, [end, start]);

  const getMonthString = useMemo(
    () => (date: Date) => {
      switch (getMonth(date)) {
        case 0:
          return 'Jan.';
        case 1:
          return 'Feb.';
        case 2:
          return 'Mar.';
        case 3:
          return 'Apr.';
        case 4:
          return 'May';
        case 5:
          return 'Jun.';
        case 6:
          return 'Jul.';
        case 7:
          return 'Aug.';
        case 8:
          return 'Sep.';
        case 9:
          return 'Oct.';
        case 10:
          return 'Nov.';
        case 11:
          return 'Dec.';
      }
    },
    [],
  );

  return (
    <>
      <div className="flex items-end space-x-1 px-3 mb-3">
        <div>
          <Button size="xs" throttle={300} onClick={() => setStart(subMonths(start, 1))}>
            {'<'}
          </Button>
        </div>
        <div>
          <Button size="xs" throttle={300} onClick={() => setStart(addMonths(start, 1))}>
            {'>'}
          </Button>
        </div>
        <div className="grow text-right text-lg">
          {getMonthString(start)} {getYear(start)}
        </div>
      </div>
      <div className="flex flex-col border-b border-s border-gray-600">
        {daysArr.map((week, i) => (
          <div key={i} className="grid grid-cols-7">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Cell
                key={week[i]?.getTime() ?? i}
                date={week[i]}
                data={data?.filter((bp) => isSameDay(new Date(bp.createdAt), week[i])) ?? []}
                today={isSameDay(today, week[i])}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
