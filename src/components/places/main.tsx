'use client';

import Feed from './feed';
import Side from './side';

export default function Main() {
  return (
    <div className="flex flex-col sm:flex-row justify-center">
      <div className="basis-full sm:basis-3/4 px-1">
        <Feed />
      </div>

      <div className="sm:block grow">
        <Side />
      </div>
    </div>
  );
}
