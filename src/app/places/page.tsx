import Feed from '@/components/places/feed';

import './places.css';

export default function Places() {
  return (
    <div className="flex flex-col sm:flex-row justify-center">
      <div className="basis-full sm:basis-3/4 px-5">
        <Feed />
      </div>

      <div className="hidden sm:block grow">
        <div className="sm:sticky sm:top-10 border border-gray-700 px-3">Trending</div>
      </div>
    </div>
  );
}
