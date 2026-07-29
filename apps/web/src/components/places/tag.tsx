import Link from 'next/link';
import { memo } from 'react';

function Tag({ tag }: { tag: string }) {
  return (
    // <Link href={`#${tag.replace(/#/g, '')}`} prefetch={false} shallow={true} scroll={false}>
    <Link
      href={{ pathname: '/places', query: { tags: tag.replace(/#/g, '') } }}
      prefetch={false}
      shallow={true}
      scroll={false}
    >
      {tag}
    </Link>
  );
}

export default memo(Tag);
