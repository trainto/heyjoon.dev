import useStore from '@/lib/store';
import { useCallback } from 'react';
import Button from '../common/button';

export default function Modal() {
  const { value: info, dispatch } = useStore('modal');

  const onCancel = useCallback(() => dispatch(null), [dispatch]);

  const onConfirm = useCallback(() => {
    if (info?.onConfirm) {
      info.onConfirm();
    }

    dispatch(null);
  }, [dispatch, info]);

  return (
    <div className="w-full sm:w-96 bg-bg-main px-3 py-3 rounded-md mx-3 mt-10 text-sm">
      <div className="text-lg pb-2 px-1 font-bold text-brand1">Places</div>

      <div
        // className="border-t border-gray-500 pt-2 pb-3 px-2"
        className="pt-2 pb-3 px-2 text-gray-300"
        dangerouslySetInnerHTML={{ __html: info?.msg ?? '' }}
      ></div>

      <div className="flex justify-end space-x-3 border-t border-gray-500 pt-2 px-1">
        {info?.hasCancel && (
          <Button size="sm" color="zinc" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button size="sm" color="indigo" onClick={onConfirm}>
          OK
        </Button>
      </div>
    </div>
  );
}
