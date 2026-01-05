import Image from 'next/image';

import Card from '@/components/common/portfolio-card';
import Contributions from '@/components/contributions';
import './terminal.css';

const Portfolios = [
  {
    title: 'Insight Lens',
    desc: 'Text to Hadoop query using LLM for in-house data engineers',
    period: '2025 ~ ',
    img: '/querka.png',
    tags: ['Typescript', 'Node', 'Express', 'MySQL', 'React', 'Tailwind', 'Turborepo'],
  },
  {
    title: 'RB Dialog',
    desc: 'Total AI chatbot solution',
    period: '2020 ~ ',
    img: '/rb.png',
    tags: ['Typescript', 'Next.js', 'React', 'AWS'],
  },
  {
    title: 'IOT sensor solution',
    desc: 'IoT based remote facility monitoring solution',
    period: '2019',
    img: '/capstec.png',
    tags: ['Next.js', 'React', 'Typescript'],
  },
  {
    title: 'T World',
    desc: "SKT's official mobile/web app",
    period: '2018 ~ 2019',
    img: '/tworld.jpg',
    tags: ['Node', 'Express', 'Typescript', 'JQuery', 'Handlebar', 'Redis'],
  },
  {
    title: 'FLO (a.k.a. MusicMate)',
    desc: 'Music streaming app',
    period: '2017 ~ 2018',
    img: '/flo.jpg',
    tags: ['Java', 'Kotlin', 'Android', 'Retrofit', 'ExoPlayer', 'MVVM'],
  },
  {
    title: 'DataSoda',
    desc: 'LTE data sharing app',
    period: '2017',
    img: '/datasoda.jpg',
    tags: ['Java', 'Android', 'Retrofit', 'MVP'],
  },
];

export default function About() {
  return (
    <div className="w-11/12 mx-auto">
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-button-group">
            <span className="terminal-button red" />
            <span className="terminal-button yellow ml-1" />
            <span className="terminal-button green ml-1" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-10 space-y-5 mx-2 my-5">
          <div>
            <Image src="./me.jpg" className="rounded-full" width={80} height={80} alt="Hakjoon" />
          </div>
          <div>
            <div>
              <h2 className="text-lg">
                Hakjoon Sim<span className="text-sm"> (심학준)</span>
              </h2>
            </div>
            I&apos;m a software engineer who works for{' '}
            <a href="https://skplanet.com" target="_blank">
              SK planet.
            </a>
            <br />
            I&apos;m living in Seoul, passionate about development and learning new technologies.
          </div>
        </div>
        <div className="mx-2 mb-3">
          <span className="text-brand2">{`~ >>`}</span>
          <span className="ml-3 cursor-animation"></span>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-bold text-3xl">Work Experience</h3>
        <div className="flex flex-col sm:flex-row space-x-5 space-y-2 sm:space-y-0 mt-5">
          <div>
            <Image src="./hmc.svg" width={96} height={48} alt="SK planet" />
          </div>
          <ul className="marker:text-brand2">
            <li>
              Mobility Platform Team, Hyundai Motor Company
              <br />
              <span className="text-sm text-gray-400">
                - Senior Research Engineer (Jan. 2026 ~ Current)
              </span>
              <br />
              <span className="text-sm text-gray-400">
                -{' '}
                <a href="https://www.shucle.com" target="_blank" rel="noopener noreferrer">
                  https://www.shucle.com
                </a>
              </span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row space-x-5 space-y-2 sm:space-y-0 mt-10">
          <div>
            <Image src="./skp.png" width={96} height={44.86} alt="SK planet" />
          </div>
          <ul className="marker:text-brand2">
            <li>
              Platform Centre, SK planet
              <br />
              <span className="text-sm text-gray-400">- FE developer (Sep. 2018 ~ Dec. 2025)</span>
            </li>
            <li className="mt-5">
              Platform Centre, SK techx
              <br />
              <span className="text-sm text-gray-400">
                - Android developer (Dec. 2016 ~ Aug. 2018)
              </span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row space-x-5 space-y-2 sm:space-y-0 mt-10">
          <div>
            <Image src="./lge.png" width={96} height={20} alt="LGE" />
          </div>
          <ul className="marker:text-brand2">
            <li>
              IMS Team, Mobile Communications Lab. LG Electronics
              <br />
              <span className="text-sm text-gray-400">
                - Android developer (Dec. 2015 ~ Dec. 2016)
              </span>
            </li>
            <li className="mt-5">
              Web Team, Mobile Communications Lab. LG Electronics
              <br />
              <span className="text-sm text-gray-400">
                - Android developer (Apr. 2011 ~ Nov. 2015)
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14">
        <h3 className="font-bold text-3xl">Education</h3>
        <ul className="marker:text-brand2 mt-5">
          <li>
            MS in Computer Engineering - Researcher at{' '}
            <a href="http://iislab.skku.edu" target="_blank">
              IIS Lab.
            </a>
            <br />
            <span className="text-sm text-gray-400">Mar. 2009 ~ Feb. 2011</span>
          </li>
          <li className="mt-3">
            BS in Computer Engineering
            <br />
            <span className="text-sm text-gray-400">Mar. 2002 ~ Feb. 2009</span>
          </li>
        </ul>
      </div>

      <div className="mt-14">
        <h3 className="font-bold text-3xl">Skills</h3>
        <div className="flex flex-wrap gap-2 mt-3 text-sm">
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">JavaScript</div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">TypeScript</div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">
            React/Next.js
          </div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">Node.js</div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">Deno</div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">
            MySQL/MongoDB
          </div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">Java</div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">Android</div>
          <div className="border border-brand2 border-dashed py-1 px-2 rounded-md">Linux</div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-bold text-3xl">Portfolio</h3>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {Portfolios.map((p) => (
            <Card key={p.title} {...p} />
          ))}
        </div>
      </div>

      <Contributions />
    </div>
  );
}
