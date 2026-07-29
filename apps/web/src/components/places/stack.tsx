import Image from 'next/image';
import { Deno, OCI } from './svg';

const Stack = () => {
  return (
    <>
      <div className="text-brand1 text-2xl font-bold flex justify-center">Built with...</div>
      <div className="text-gray-300 mt-5">
        <div className="flex">
          <div className="w-24 flex-none text-lg">FRONTEND</div>

          <div className="flex flex-wrap ml-10 text-sm">
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/typescript.webp" width={24} height={24} alt="Typescript" />
              <div>Typescript</div>
            </div>
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/nextjs.webp" width={24} height={24} alt="Next.js" />
              <div>Next.js</div>
            </div>
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/react.webp" width={24} height={24} alt="React" />
              <div>React</div>
            </div>

            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/tailwind.webp" width={24} height={24} alt="Tailwind" />
              <div>Tailwind CSS</div>
            </div>
          </div>
        </div>

        <div className="flex mt-8">
          <div className="w-24 flex-none text-lg">BACKEND</div>
          <div className="flex flex-wrap ml-10 text-sm">
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/typescript.webp" width={24} height={24} alt="Typescript" />
              <div>Typescript</div>
            </div>
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Deno size={24} />
              <div>Deno</div>
            </div>
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/mariadb.svg" width={24} height={24} alt="MariaDB" />
              <div>MariaDB</div>
            </div>
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/minio.png" width={24} height={24} alt="MinIO" />
              <div>MinIO</div>
            </div>
          </div>
        </div>

        <div className="flex mt-8">
          <div className="w-24 flex-none text-lg">TOOLS</div>
          <div className="flex flex-wrap ml-10 text-sm">
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/github.png" width={24} height={24} alt="Github" />
              <div>Github</div>
            </div>
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <Image src="/docker.svg" width={24} height={24} alt="Docker" />
              <div>Docker</div>
            </div>
            <div className="flex items-center space-x-1 mr-4 mb-2">
              <OCI size={24} />
              <div>Oracle Cloud</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stack;
