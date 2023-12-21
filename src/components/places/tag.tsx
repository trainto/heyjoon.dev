import Link from 'next/link';
import { memo } from 'react';

function Tag({ tag }: { tag: string }) {
  return (
    <Link href={`/places/tag/${tag.replace(/#/g, '')}`} prefetch={false}>
      {tag}
    </Link>
  );
}

export default memo(Tag);
