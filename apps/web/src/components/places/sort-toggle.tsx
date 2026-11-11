import { dispatch } from '@/lib/store';
import { useState } from 'react';

export type SortMode = 'newest' | 'nearest';

export default function SortToggle({
  value,
  onChange,
}: {
  value: SortMode;
  onChange: (mode: SortMode, coords?: { lat: number; lng: number }) => void;
}) {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      dispatch('modal', { msg: 'Geolocation is not supported on this browser.' });
      onChange('newest');
      return;
    }

    setIsRequesting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsRequesting(false);
        onChange('nearest', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setIsRequesting(false);
        dispatch('modal', {
          msg: 'Location access was denied. Please allow it to sort by distance.',
        });
        onChange('newest');
      },
    );
  };

  const handleClick = (mode: SortMode) => {
    if (mode === value || isRequesting) {
      return;
    }

    if (mode === 'newest') {
      onChange('newest');
      return;
    }

    if (!navigator.permissions?.query) {
      requestLocation();
      return;
    }

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (status.state === 'denied') {
          dispatch('modal', {
            msg: 'Location access was denied. Please allow it to sort by distance.',
          });
          onChange('newest');
          return;
        }

        requestLocation();
      })
      .catch(requestLocation);
  };

  return (
    <div className="flex rounded-md border border-gray-700 overflow-hidden text-xs">
      <button
        type="button"
        className={`px-2 py-1 ${value === 'newest' ? 'bg-zinc-800 text-gray-200' : 'text-gray-400'}`}
        onClick={() => handleClick('newest')}
      >
        Newest
      </button>
      <button
        type="button"
        className={`px-2 py-1 border-l border-gray-700 ${
          value === 'nearest' ? 'bg-zinc-800 text-gray-200' : 'text-gray-400'
        }`}
        onClick={() => handleClick('nearest')}
        disabled={isRequesting}
      >
        {isRequesting ? '...' : 'Nearest'}
      </button>
    </div>
  );
}
