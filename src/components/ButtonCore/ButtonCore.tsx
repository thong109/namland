import { assetsImages } from '@/assets/images/package';
import clsx from 'clsx';
import React from 'react';
import './ButtonCore.css';

interface ButtonCoreProps {
  preset?: 'primary' | 'secondary' | 'secondary-reversed' | 'neutral' | 'more' | 'directing';
  className?: string;
  onClick?: () => void;
  label: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  buttonType?: 'search' | 'destroy' | 'default';
}

const ButtonCore: React.FC<ButtonCoreProps> = ({
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
        'button-common-core', 
        {
          'button-common-core--neutral': preset === 'neutral',
          'button-common-core--more': preset === 'more',
          'button-common-core--directing': preset === 'directing',
          'button-common-core--primary': preset === 'primary',
          'button-common-core--primary-disabled': preset === 'primary' && disabled,
          'button-common-core--secondary': preset === 'secondary',
          'button-common-core--secondary-reversed': preset === 'secondary-reversed',
        },
        className
      )} 
      onClick={onClick} 
      type={type} 
      disabled={disabled}
    >
      {label}
      {buttonType === 'search' && (
        <span className='button-common-core__icon button-common-core__icon--search' style={{ backgroundImage: `url(${assetsImages.commonIconSearchWhite.src})` }}></span>
      )}
      {buttonType === 'destroy' && (
        <span className='button-common-core__icon button-common-core__icon--close' style={{ backgroundImage: `url(${assetsImages.commonIconClose02.src})` }}></span>
      )}
      {preset === 'directing' && (
        <span className='button-common-core__icon button-common-core__icon--directing' style={{ backgroundImage: `url(${assetsImages.commonIconClose02.src})` }}></span>
      )}
    </button>
  );
};

export default ButtonCore;
