import { memo } from 'react';
import Image from 'next/image';

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
      src={src}
      width={size}
      height={size}
      alt={nickname ?? 'Avatar'}
      title={nickname ? `@${nickname}` : undefined}
      onClick={onClick}
    />
  );
};

export default memo(Avatar);
