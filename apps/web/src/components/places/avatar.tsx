import { CDN_URL } from '@/lib/constants';
import Image from 'next/image';
import { memo } from 'react';

const Avatar = ({
  src,
  size,
  nickname,
  onClick,
}: {
  src: string;
  size: number;
  nickname?: string;
  onClick?: () => void;
}) => {
  return (
    <Image
      role={onClick ? 'button' : undefined}
      className={`rounded-full`}
      src={src.startsWith('http') ? src : CDN_URL + src}
      width={size}
      height={size}
      alt={nickname ?? 'Avatar'}
      title={nickname ? `@${nickname}` : undefined}
      onClick={onClick}
    />
  );
};

export default memo(Avatar);
