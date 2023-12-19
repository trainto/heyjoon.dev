import { ReactNode, memo, useRef } from 'react';

const Button = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className: string;
  onClick: () => void;
}) => {
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (throttleRef.current) {
      return;
    }

    throttleRef.current = setTimeout(() => {
      onClick();
      throttleRef.current = null;
    }, 1000);
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default memo(Button);
