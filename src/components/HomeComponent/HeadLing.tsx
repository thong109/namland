import React, { HTMLAttributes, ReactNode } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  desc?: ReactNode;
  isCenter?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = '',
  className = 'lg:mb-4 mb-[20px]',
  isCenter = false,
  ...args
}) => {
  return (
    <div className={`nc-Section-Heading relative ${className} `}>
      <div className={isCenter ? 'mx-auto w-full max-w-2xl text-center' : 'max-w-2xl'}>
        <h1 className={`text-[22px] font-semibold text-[#0D263B] lg:text-[30px]`} {...args}>
          {children || `Section Heading`}
        </h1>
        {desc && (
          <span className="mt-[9px] block text-[14px] text-base font-normal text-neutral-500 dark:text-neutral-400 lg:text-[16px]">
            {desc}
          </span>
        )}
      </div>
    </div>
  );
};

export default Heading;
