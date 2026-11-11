import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from './svg';

export default function TagSearch() {
  const [search, setSearch] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tags');

  const handleSearch = () => {
    if (search.trim() === '') {
      return;
    }

    router.push(`/places?tags=${search.trim()}`);
  };

  const handleClear = () => {
    setSearch('');
    router.push('/places');
  };

  if (activeTag) {
    return (
      <div className="flex items-center space-x-2 w-full border border-gray-700 rounded-md px-2 py-1">
        <span className="text-sm text-brand2">#{activeTag}</span>
        <button type="button" className="text-gray-400" onClick={handleClear}>
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full rounded-md border border-gray-700 items-center">
      <div className="p-1 pl-2 text-brand2">#</div>
      <input
        className="bg-bg-main p-1 text-gray-400 text-sm min-w-0 w-full"
        placeholder="Search by tags"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <div role="button" className="p-1 px-2 border-l border-gray-700" onClick={handleSearch}>
        <Search />
      </div>
    </div>
  );
}
