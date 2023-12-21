import { dispatch } from '@/lib/store';
import { ReactNode } from 'react';
import { Xicon } from './places/svg';

export default function Layer({
  children,
  containerClassName,
}: {
  children: ReactNode;
  containerClassName?: string;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-70 z-40" />
      <div className={`layer-container z-50 px-3 py-2 rounded-lg ${containerClassName}`}>
        <div className="flex justify-end mt-1 mb-3 px-1">
          <button className="font-bold text-2xl" onClick={() => dispatch('layer', null)}>
            <Xicon size={20} />
          </button>
        </div>

        {children}
      </div>
    </>
  );
}
