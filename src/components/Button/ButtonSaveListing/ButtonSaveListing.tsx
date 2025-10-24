'use client';
import { Button } from 'antd';
import React from 'react';

export interface IButtonPrimaryProps {
  text: string;
  onClick: () => void;
  className?: string;
  isLoading?: boolean;
}

const ButtonSaveListing: React.FunctionComponent<IButtonPrimaryProps> = ({
  text,
  onClick,
  className,
  isLoading = false,
}) => {
  return (
    <Button
      className={`${className} ml-1 rounded-xl px-6`}
      size="large"
      loading={isLoading}
      onClick={onClick}
    >
      <span> {text}</span>
    </Button>
  );
};

export default ButtonSaveListing;
