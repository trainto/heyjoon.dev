import { ReactNode, memo, useRef } from 'react';

const Button = ({
  children,
  color = 'zinc',
  size = 'base',
  onClick,
}: {
  children: ReactNode;
  color?: 'zinc' | 'indigo';
  size?: 'xs' | 'sm' | 'base' | 'lg';
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
    <button
      className={`rounded-lg py-1 px-3 font-bold text-gray-300 text-${size} bg-${color}-900 hover:bg-${color}-950 shadow-md shadow-bg-shadow`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default memo(Button);
