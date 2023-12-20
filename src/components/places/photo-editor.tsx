import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PhotoEditor({ files }: { files: File[] }) {
  const [originalUrls, setOriginalUrls] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    files.map((f, i) => {
      const fr = new FileReader();

      fr.onload = (e) => {
        setOriginalUrls((prev) => {
          prev[i] = e.target?.result as string;

          return [...prev];
        });
      };

      fr.readAsDataURL(f);
    });
  }, [files]);

  return (
    <div>
      <div className="relative bg-black w-100 pt-75p rounded-md">
        <div className="absolute top-0 bottom-0 left-0 right-0">
          <Image
            className="rounded-md"
            src={originalUrls[targetIndex]}
            fill={true}
            objectFit="contain"
            alt={files[targetIndex].name}
          />
        </div>
      </div>

      <div className="flex space-x-3 mt-3 pt-3 border-t border-gray-500">
        {originalUrls.map((url, i) => (
          <div
            key={i}
            className="rounded-md bg-black cursor-pointer"
            role="button"
            onClick={() => setTargetIndex(i)}
          >
            <div className="relative bg-black w-20 pt-75p rounded-md">
              <div className="grid content-center absolute top-0 bottom-0 left-0 right-0 rounded-md">
                <Image
                  className="rounded-md"
                  src={url}
                  fill={true}
                  objectFit="contain"
                  alt={files[i].name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pt-75p {
          padding-top: 75%;
        }
      `}</style>
    </div>
  );
}
