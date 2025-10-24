'use client';
import { Button } from 'antd';
import React from 'react';

export interface IButtonPrimaryProps {
  text?: string;
  key?: string | number;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  icon?: any;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
}

const ButtonPrimary: React.FunctionComponent<IButtonPrimaryProps> = ({
  text,
  key,
  onClick,
  className,
  isLoading = false,
  icon,
  size = 'large',
  disabled = false,
}) => {
  return (
    <Button
      disabled={disabled}
      className={`${className} !bg-portal-primaryMainAdmin text-sm !text-white`}
      key={key}
      size={size}
      icon={icon}
      loading={isLoading}
      onClick={onClick}
    >
      <span> {text}</span>
    </Button>
  );
};

export default ButtonPrimary;
