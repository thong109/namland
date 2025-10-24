import { FC } from 'react';

const IconLadder: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={`inline-block ${className ? className : ''}`}
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 19V17H3.5V12.5H8V8H12.5V3.5H17V0H19V5.5H14.5V10H10V14.5H5.5V19H0Z"
        fill="#FFD14B"
      />
    </svg>
  );
};

export default IconLadder;
