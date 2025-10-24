import { FC } from 'react';

const IconDownload: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <g
        stroke="#292D32"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        clipPath="url(#a)"
      >
        <path d="m30 104 66 66 66-66m-66 52V22" />
      </g>

      <defs>
        <clipPath id="a">
          <path fill="#292D32" d="M0 0h192v192H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconDownload;
