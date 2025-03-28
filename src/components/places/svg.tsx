import { memo } from 'react';

export const Camera = () => {
  return (
    <svg
      enableBackground="new 0 0 32 32"
      height="28px"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 32 32"
      width="32px"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="camera">
        <path
          clipRule="evenodd"
          d="M16,10.001c-4.419,0-8,3.581-8,8c0,4.418,3.581,8,8,8   c4.418,0,8-3.582,8-8C24,13.583,20.418,10.001,16,10.001z M20.555,21.906c-2.156,2.516-5.943,2.807-8.459,0.65   c-2.517-2.156-2.807-5.944-0.65-8.459c2.155-2.517,5.943-2.807,8.459-0.65C22.42,15.602,22.711,19.391,20.555,21.906z"
          fill="#9ca3af"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="M16,14.001c-2.209,0-3.999,1.791-4,3.999v0.002   c0,0.275,0.224,0.5,0.5,0.5s0.5-0.225,0.5-0.5V18c0.001-1.656,1.343-2.999,3-2.999c0.276,0,0.5-0.224,0.5-0.5   S16.276,14.001,16,14.001z"
          fill="#9ca3af"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="M29.492,9.042l-4.334-0.723l-1.373-3.434   C23.326,3.74,22.232,3,21,3H11C9.768,3,8.674,3.74,8.214,4.886L6.842,8.319L2.509,9.042C1.055,9.283,0,10.527,0,12v15   c0,1.654,1.346,3,3,3h26c1.654,0,3-1.346,3-3V12C32,10.527,30.945,9.283,29.492,9.042z M30,27c0,0.553-0.447,1-1,1H3   c-0.553,0-1-0.447-1-1V12c0-0.489,0.354-0.906,0.836-0.986l5.444-0.907l1.791-4.478C10.224,5.25,10.591,5,11,5h10   c0.408,0,0.775,0.249,0.928,0.629l1.791,4.478l5.445,0.907C29.646,11.094,30,11.511,30,12V27z"
          fill="#9ca3af"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export const Xicon = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="#ffffff"
      height={`${size}px`}
      width={`${size}px`}
      version="1.1"
      id="Capa_1"
      viewBox="0 0 460.775 460.775"
      xmlSpace="preserve"
    >
      <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z" />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
      />
    </svg>
  );
};

export const Heart = memo(
  ({ size = 24, color = 'empty' }: { size?: number; color?: 'empty' | 'red' }) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color === 'red' ? '#dc2626' : '#9ca3af'}
        height={`${size}px`}
        width={`${size}px`}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {' '}
          <path
            d="M7 2C3.31333 2 1 5.21475 1 8.5C1 11.8412 2.67415 14.6994 4.77151 16.9297C6.8721 19.1634 9.47698 20.8565 11.5528 21.8944C11.8343 22.0352 12.1657 22.0352 12.4472 21.8944C14.523 20.8565 17.1279 19.1634 19.2285 16.9297C21.3259 14.6994 23 11.8412 23 8.5C23 5.22013 20.7289 2 17 2C15.275 2 14.0531 2.47979 13.1186 3.20977C12.6785 3.55357 12.311 3.95011 11.9974 4.33639C11.6802 3.94929 11.3091 3.55266 10.8649 3.2079C9.92877 2.48125 8.70883 2 7 2Z"
            fill={color === 'red' ? '#dc2626' : undefined}
          ></path>
        </g>
      </svg>
    );
  },
);

Heart.displayName = 'Heart';

export const Edit = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      fill="#9ca3af"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 528.899 528.899"
      xmlSpace="preserve"
      width={`${size}px`}
      height={`${size}px`}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <g>
          {' '}
          <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z"></path>{' '}
        </g>{' '}
      </g>
    </svg>
  );
};

export const More = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="#cbd5e1"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(90)"
      width={size}
      height={size}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M820.8 512c0 44.8 36 80.8 80.8 80.8s80.8-36 80.8-80.8-36-80.8-80.8-80.8-80.8 36-80.8 80.8zM431.2 512c0 44.8 36 80.8 80.8 80.8S592.8 556.8 592.8 512 556.8 431.2 512 431.2 431.2 467.2 431.2 512zM40.8 512c0 44.8 36 80.8 80.8 80.8S203.2 556.8 203.2 512s-36-80.8-80.8-80.8S41.6 467.2 40.8 512z"
          fill=""
        ></path>
      </g>
    </svg>
  );
};

export const Trash = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${size}px`}
      width={`${size}px`}
      viewBox="0 -960 960 960"
      fill="#666666"
    >
      <path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z" />
    </svg>
  );
};

export const Deno = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 441 441"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
    >
      <g transform="matrix(0.0920293,0.00428099,-0.00428099,0.0920293,-28.1272,-500.301)">
        <path
          d="M3053.7,5296.9C4371.65,5296.9 5441.66,6366.91 5441.66,7684.86C5441.66,9002.81 4371.65,10072.8 3053.7,10072.8C1735.75,10072.8 665.74,9002.81 665.74,7684.86C665.74,6366.91 1735.75,5296.9 3053.7,5296.9ZM3745.03,8143.22C3594.12,8142.82 3444.31,8124.57 3323.87,8110.15C3232.29,8099.18 3144.99,8079.23 3073.1,8058.23C3061.36,8054.62 3048.65,8059.09 3041.75,8069.24C3034.86,8079.4 3034.46,8093.71 3043.09,8102.44C3078.21,8137.94 3187.74,8210.21 3271.7,8241.83C3204.04,8303.2 3162.1,8438.28 3146.33,8507.94C3125.17,8601.4 3127.75,8734.83 3136.19,8783.45C3170.14,8979.04 3250.69,9151.99 3436.99,9297.9C3567.4,9400.03 3752.28,9465.38 3937.88,9460.06C4194.01,9452.71 4495.48,9328.51 4724.65,9070.17C5023.25,8710.58 5208.52,8252.45 5223.47,7749.5C5259.08,6551.9 4315.7,5550.69 3118.1,5515.08C1920.51,5479.47 919.301,6422.86 883.689,7620.45C865.246,8240.66 1109.37,8808.21 1515.43,9216.2C1526.73,9227.39 1544.21,9229.43 1557.78,9221.14C1571.35,9212.85 1577.51,9196.36 1572.7,9181.2C1234.07,8072.55 1799.11,6832.64 2474.84,6417.1C2725.71,6262.82 2973.99,6197.06 3203.56,6277.7C3555.04,6401.15 3763.03,6623.26 4199.06,6797.93C4635.09,6972.59 4696.35,7294.74 4592.58,7628.14C4488.81,7961.54 4113,8144.17 3745.03,8143.22ZM2917.17,6442.51C2777.75,6459.97 2693.93,6637.44 2687.08,6749.42C2680.18,6861.39 2744.03,7042.7 2926.19,7030.63C3139.52,7016.49 3195.89,6830.7 3164.24,6654.94C3140.48,6522.94 3033.73,6427.9 2917.17,6442.51Z"
          style={{ fill: 'white' }}
        />
      </g>
    </svg>
  );
};

export const OCI = ({ size = 24 }: { size?: number }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 21">
      <path
        fill="#C74634"
        d="M9.9,20.1c-5.5,0-9.9-4.4-9.9-9.9c0-5.5,4.4-9.9,9.9-9.9h11.6c5.5,0,9.9,4.4,9.9,9.9c0,5.5-4.4,9.9-9.9,9.9H9.9 M21.2,16.6c3.6,0,6.4-2.9,6.4-6.4c0-3.6-2.9-6.4-6.4-6.4h-11c-3.6,0-6.4,2.9-6.4,6.4s2.9,6.4,6.4,6.4H21.2"
      ></path>
    </svg>
  );
};

export const Search = ({ size = 24 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill="#EFEFEF"
    >
      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
  );
};
