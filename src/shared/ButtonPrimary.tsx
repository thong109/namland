import React from 'react';
import Button, { ButtonProps } from './Button';

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ className = '', ...args }) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary bg-primary-6000 text-neutral-50 hover:bg-primary-700 disabled:bg-opacity-70 ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
