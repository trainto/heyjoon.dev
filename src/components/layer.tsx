import { dispatch } from '@/lib/store';
import { ReactNode } from 'react';

export default function Layer({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-70 z-40" />
      <div className="layer-container z-50 px-3 py-2 rounded-lg">
        <div className="flex justify-end">
          <button className="font-bold text-2xl" onClick={() => dispatch('layer', null)}>
            X
          </button>
        </div>

        <div>{children}</div>
      </div>
    </>
  );
}
