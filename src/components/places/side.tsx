import { useAuthState } from '@/lib/hooks';
import { dispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Signin from './signin';
import Stack from './stack';
import { Search } from './svg';
import TopTags from './top-tags';
import User from './user';

const Side = () => {
  const [search, setSearch] = useState('');

  const authIconKind = useAuthState();

  const router = useRouter();

  const handleSearch = () => {
    if (search.trim() === '') {
      return;
    }

    router.push(`/places?tags=${search}`);
  };

  return (
    <div className="hidden sm:block sm:sticky sm:top-20">
      <div className="border border-gray-700 p-3 rounded">
        <div>
          {authIconKind === 'avatar' ? (
            <div>
              <User />
            </div>
          ) : authIconKind === 'google' ? (
            <Signin width={170} from="side" />
          ) : null}
        </div>

        <div className="text-xl font-bold mt-3 border-t border-gray-500 pt-3">Top tags:</div>
        <div className="mt-1 px-1 text-sm">
          <TopTags />
        </div>
      </div>

      <div className="flex mt-2 rounded-md border border-gray-700 items-center">
        <div className="p-1 pl-2 text-brand2">#</div>
        <input
          className="bg-bg-main p-1 text-gray-400 text-sm"
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

      <div className="flex justify-end mt-2 mr-2">
        <a
          href="#none"
          className="text-xs"
          onClick={(e) => {
            e.preventDefault();
            dispatch('layer', { node: <Stack />, containerClassName: 'w-full sm:w-96' });
          }}
        >
          ⓘ Stack
        </a>
      </div>
    </div>
  );
};

export default Side;
