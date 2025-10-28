import { assetsImages } from '@/assets/images/package';
import clsx from 'clsx';
import React from 'react';

interface CoreButtonProps {
  preset?: 'primary' | 'secondary' | 'neutral';
  className?: string;
  onClick?: () => void;
  label: string;

  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  buttonType?: 'search' | 'destroy' | 'default';
}

const CoreButton: React.FC<CoreButtonProps> = ({
  preset = 'primary',
  className,
  onClick = () => { },
  label,
  type = 'button',
  disabled = false,
  buttonType = 'default',
}) => {
  return (
    <button
      className={clsx(
        'min-w-24 rounded-lg px-3 py-2 flex items-center justify-center',
        {
          'border border-portal-primaryLiving bg-neutral-0 text-white':
            preset === 'neutral',
          'bg-portal-primaryLiving font-bold text-white': preset === 'primary',
          'bg-opacity-50': disabled && preset === 'primary',
        },
        className,
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
      {buttonType === 'search' && (
        <span className='ml-[10px] block flex-[0_0_auto] bg-center bg-no-repeat bg-cover w-[17px] h-[18px]' style={{ backgroundImage: `url(${assetsImages.commonIconSearchWhite.src})` }}></span>
      )}
      {buttonType === 'destroy' && (
        <span className='ml-[10px] block flex-[0_0_auto] bg-center bg-no-repeat bg-cover w-[24px] h-[24px]' style={{ backgroundImage: `url(${assetsImages.commonIconClose2.src})` }}></span>
      )}
    </button>
  );
};

export default CoreButton;
