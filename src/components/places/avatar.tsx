import { memo } from 'react';
import Image from 'next/image';

const Avatar = ({ src, size, nickname }: { src: string; size: number; nickname?: string }) => {
  return (
    <Image
      className="rounded-full"
      src={src}
      width={size}
      height={size}
      alt={nickname ?? 'Avatar'}
      title={nickname ? `@${nickname}` : undefined}
    />
  );
};

export default memo(Avatar);
