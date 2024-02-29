import { noto } from './layout';

export default function PlaceLayout({ children }: { children: React.ReactNode }) {
  const { value: layer } = useStore('layer');

  return (
    <div className={noto.className}>
      {children}

      {/* {layer && <Layer containerClassName={layer.containerClassName ?? ''}>{layer.node}</Layer>} */}
    </div>
  );
}
