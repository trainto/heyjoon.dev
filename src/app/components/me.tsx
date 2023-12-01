import Image from 'next/image';

export default function Me() {
  return (
    <div className="text-gray-400 sm:border-r border-gray-500 pb-10 sm:sticky sm:top-10 px-5 sm:px-10">
      <a href="https://you.heyjoon.dev">
        <Image src="/me.jpg" className="rounded-full" width={100} height={100} alt="Linkedin" />
      </a>
      <div className="text-2xl text-gray-300 mt-5">Hakjoon Sim</div>
      <div>Developer who lives in Seoul, like programming and doing nothing.</div>
      <div className="mt-5 flex space-x-2">
        <a href="https://linkedin.com" target="_blank">
          <Image src="/linkedin.png" width={28} height={28} alt="Linkedin" />
        </a>
        <a href="https://github.com/trainto" target="_blank">
          <Image src="/github.png" width={28} height={28} alt="Github" />
        </a>
      </div>
    </div>
  );
}
