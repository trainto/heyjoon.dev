import { fetcher } from '@/lib/api/fetchers';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Loading from './loading';
import { LocationPin } from './svg';

export default function LocationSearch({
  onComplete,
  scrollResults = false,
}: {
  onComplete: (location: PlaceLocation) => void;
  scrollResults?: boolean;
}) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<PlaceLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const requestIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQ(value);

    clearTimeout(debounceRef.current);
    requestIdRef.current += 1;

    if (value.trim() === '') {
      setResults([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const requestId = requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await fetcher<PlaceLocation[]>('/places/location/search', { q: value.trim() });
        if (requestId !== requestIdRef.current) {
          return;
        }
        setResults(data);
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setResults([]);
        setHasError(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 400);
  };

  const handleSelect = (location: PlaceLocation) => {
    onComplete(location);
  };

  return (
    <div className="p-3">
      <div className="relative">
        <input
          ref={inputRef}
          className="w-full bg-transparent border border-gray-600 rounded px-2 py-2 text-sm"
          placeholder="Search for a place"
          value={q}
          onChange={handleChange}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loading size={4} />
          </div>
        )}
      </div>

      <div className={`mt-3 ${scrollResults ? 'max-h-60 overflow-y-auto dark-scroller' : ''}`}>
        {hasError ? (
          <div className="text-center text-sm text-gray-400 py-6">
            Something went wrong. Please try again.
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-1">
            {results.map((r, i) => (
              <div
                key={`${r.lat},${r.lng},${i}`}
                role="button"
                onClick={() => handleSelect(r)}
                className="flex items-start space-x-2 px-2 py-2 rounded hover:bg-gray-800"
              >
                <div className="pt-0.5 text-gray-400">
                  <LocationPin size={16} />
                </div>
                <div>
                  <div className="text-sm">{r.name}</div>
                  <div className="text-xs text-gray-400">{r.address}</div>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && q.trim() !== '' ? (
          <div className="text-center text-sm text-gray-400 py-6">No results found.</div>
        ) : null}
      </div>
    </div>
  );
}
