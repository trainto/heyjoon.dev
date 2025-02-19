import { sendRequest } from '@/lib/api/fetchers';
import { dispatchEvent } from '@/lib/event-bus';
import { dispatch } from '@/lib/store';
import { format, getDate, getDay } from 'date-fns';
import { memo, useEffect, useMemo, useState } from 'react';
import Button from '../button';
import { Trash } from '../places/svg';

const Cell = memo(({ date, data, today }: { date: Date; data: BP[]; today?: boolean }) => {
  const getDayString = useMemo(
    () => (date: Date) => {
      switch (getDay(date)) {
        case 0:
          return 'SUN';
        case 1:
          return 'MON';
        case 2:
          return 'TUE';
        case 3:
          return 'WED';
        case 4:
          return 'THU';
        case 5:
          return 'FRI';
        case 6:
          return 'SAT';
        default:
          return '';
      }
    },
    [],
  );

  const handleClick = () => {
    if (data.length === 0) {
      return;
    }

    dispatch('layer', {
      node: <Rows data={data} />,
      containerClassName: 'w-60',
    });
  };

  return (
    <div
      className={`relative bp-cell border-t border-e border-gray-600 p-1 ${
        date == null && 'bg-gray-800'
      } ${data.length > 0 && 'cursor-pointer'}`}
      onClick={handleClick}
    >
      {date ? (
        <div className="text-xs text-center">
          <div>
            <div className="text-gray-500">{getDayString(date)}</div>
            <div className="text-gray-400">{getDate(date)}</div>
          </div>

          <div className="mt-1">
            {data.map((bp) => (
              <div key={bp.id}>
                {bp.systolic}/{bp.diastolic}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {today && <div className="absolute right-0 top-0 pr-1 text-green-500">&bull;</div>}

      <style jsx>{`
        .bp-cell {
          height: 6.5rem;
        }
      `}</style>
    </div>
  );
});

const Rows = ({ data }: { data: BP[] }) => {
  const [confirm, setConfirm] = useState(false);
  const [rows, setRows] = useState(data);

  useEffect(() => {
    if (rows.length === 0) {
      dispatch('layer', null);
    }
  }, [rows.length]);

  return (
    <div className="mb-3">
      {rows.map((d) => (
        <div key={d.id} className="flex justify-between">
          <div className="flex space-x-3 justify-center">
            <div className="text-gray-400">{format(d.createdAt, 'HH:mm')}</div>
            <div>
              {d.systolic}/{d.diastolic}
            </div>
          </div>
          <div>
            <Button
              size="xs"
              onClick={async () => {
                if (confirm) {
                  const res = await sendRequest({ method: 'delete', url: `/bp/${d.id}` });
                  if (res.status === 200) {
                    dispatchEvent('bpDeleted');
                    setRows((p) => p.filter((r) => r.id !== d.id));
                  }
                  setConfirm(false);
                } else {
                  setConfirm(true);
                }
              }}
            >
              {confirm ? 'Sure?' : <Trash size={12} />}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

Cell.displayName = 'Cell';

export default Cell;
