import Image from 'next/image';

import './terminal.css';

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
            I&apos;m a software engineer who works for{' '}
            <a href="https://skplanet.com" target="_blank">
              SK planet.
            </a>
            <br />
            I&apos;m living in Seoul, struggling to get over all things that I&apos;ve been through.
          </div>
        </div>
        <div className="mx-2 mb-3">
          <span className="text-brand2">{`~ >>`}</span>
          <span className="ml-3 cursor-animation"></span>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-bold text-3xl">Career</h3>
        <div className="flex flex-col sm:flex-row space-x-5 space-y-2 mt-5">
          <div>
            <Image src="./skp.png" width={96} height={44.86} alt="SK planet" />
          </div>
          <ul className="marker:text-brand2">
            <li>
              Platform Centre, SK planet
              <br />
              <span className="text-sm text-gray-400">- FE developer (Sep. 2018 ~ Current)</span>
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
        <div className="flex flex-col sm:flex-row space-x-5 space-y-2 mt-10">
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
    </div>
  );
}
