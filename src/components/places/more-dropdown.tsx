import { useClickOutside } from '@/lib/hooks';
import { memo, useState } from 'react';
import { More } from './svg';

const MoreDrop = ({
  iconSize = 24,
  menu,
}: {
  iconSize?: number;
  menu: { label: string; onClick: () => void }[];
}) => {
  const [open, setOpen] = useState(false);

  const dropDownRef = useClickOutside(() => setOpen(false));

  return (
    <div className="relative" ref={dropDownRef}>
      <div
        role="button"
        onClick={() => {
          setOpen((p) => !p);
        }}
      >
        <More size={iconSize} />
      </div>

      {open && menu.length ? (
        <div className="absolute z-50 bg-bg-main p-2 right-0 top-7 shadow-lg shadow-bg-shadow border border-gray-700 text-sm text-gray-300">
          {menu.map((m) => (
            <div key={m.label} role="button" onClick={m.onClick}>
              {m.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default memo(MoreDrop);
