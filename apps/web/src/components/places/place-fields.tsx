import { dispatch } from '@/lib/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import LocationSearch from './location-search';
import { AddLocation } from './svg';

export function DescField({
  desc,
  onDescChange,
  disabled = false,
}: {
  desc: string;
  onDescChange: (desc: string) => void;
  disabled?: boolean;
}) {
  const [taRows, setTaRows] = useState(2);

  const taRef = useRef<HTMLTextAreaElement>(null);

  const handleDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onDescChange(e.target.value.slice(0, 180));

    const ta = taRef.current;
    if (ta == null) {
      return;
    }

    if (ta.clientHeight < ta.scrollHeight) {
      setTaRows((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (desc === '') {
      setTaRows(2);
    }
  }, [desc]);

  return (
    <div className="flex">
      <div className="flex-grow">
        <textarea
          ref={taRef}
          className="bg-transparent w-full px-2 text-sm"
          placeholder="Where do you want to share?"
          maxLength={180}
          value={desc}
          rows={taRows}
          disabled={disabled}
          onChange={handleDescChange}
        />
      </div>

      <div className="self-end text-xs text-gray-400">{desc.length}/180</div>
    </div>
  );
}

export function LocationField({
  location,
  onLocationChange,
  variant = 'layer',
  disabled = false,
}: {
  location: PlaceLocation | null;
  onLocationChange: (location: PlaceLocation | null) => void;
  variant?: 'layer' | 'inline';
  disabled?: boolean;
}) {
  const [isSearching, setIsSearching] = useState(false);

  const handleLayerComplete = (selected: PlaceLocation) => {
    onLocationChange(selected);
    dispatch('layer', null);
  };

  const handleInlineComplete = (selected: PlaceLocation) => {
    onLocationChange(selected);
    setIsSearching(false);
  };

  const handleClick = () => {
    if (disabled) {
      return;
    }

    if (variant === 'layer') {
      // Uploader isn't itself shown in the global layer, so it's safe to use
      // it here -- there's nothing else in it that opening this would evict.
      dispatch('layer', {
        node: <LocationSearch onComplete={handleLayerComplete} />,
        containerClassName: 'w-full sm:w-1/3',
      });
      return;
    }

    setIsSearching(true);
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <div
          className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          role="button"
          onClick={handleClick}
        >
          <AddLocation size={24} />
        </div>
        {location && (
          <div className="flex items-center space-x-1 text-xs text-brand1">
            <span>{location.name}</span>
            <button
              type="button"
              className="text-gray-400"
              disabled={disabled}
              onClick={() => onLocationChange(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {isSearching && variant === 'inline' && !disabled && (
        <div className="mt-2 border border-gray-700 rounded-md">
          <LocationSearch onComplete={handleInlineComplete} scrollResults />
        </div>
      )}
    </div>
  );
}
