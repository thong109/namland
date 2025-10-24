'use client';
import { Button } from 'antd';
import React from 'react';

export interface IButtonBackProps {
  text?: string;
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
}

const ButtonBack: React.FunctionComponent<IButtonBackProps> = ({
  text,
  onClick,
  className,
  isLoading = false,
}) => {
  return (
    <Button
      className={`${className} rounded-full border-portal-primaryLiving bg-white px-6 text-sm`}
      size="large"
      type="default"
      onClick={onClick}
      loading={isLoading}
    >
      <span> {text}</span>
    </Button>
  );
};

export default ButtonBack;
