import { ReactNode, memo, useRef } from 'react';

const Button = ({
  children,
  color = 'zinc',
  size = 'base',
  disabled = false,
  throttle = 1000,
  onClick,
}: {
  children: ReactNode;
  color?: 'zinc' | 'indigo';
  size?: 'xs' | 'sm' | 'base' | 'lg';
  disabled?: boolean;
  throttle?: number;
  onClick: () => void;
}) => {
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (throttleRef.current) {
      return;
    }

    throttleRef.current = setTimeout(() => {
      throttleRef.current = null;
    }, throttle);

    onClick();
  };

  return (
    <button
      className={`rounded-lg py-1 px-3 font-bold text-gray-300 text-${size} bg-${color}-900 hover:bg-${color}-950 shadow-md shadow-bg-shadow disabled:bg-${color}-950 disabled:text-gray-500`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default memo(Button);
