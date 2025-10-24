'use client';

import { Route } from '@/routers/types';
import { Spin } from 'antd';
import Link from 'next-intl/link';
import React, { ButtonHTMLAttributes, FC } from 'react';

export interface ButtonProps {
  className?: string;
  translate?: string;
  sizeClass?: string;
  textClass?: string;

  loading?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  href?: Route<string>;
  targetBlank?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const FormButton: FC<ButtonProps> = ({
  className = 'text-neutral-700 dark:text-neutral-200',
  translate = '',
  sizeClass = 'p-2',

  disabled = false,
  href,
  children,
  targetBlank,
  type,
  loading = false,
  onClick = () => {},
}) => {
  const CLASSES = `bg-portal-primaryLiving rounded w-max h-max sm:w-fit ${
    disabled
      ? 'text-gray-300'
      : 'text-white hover:bg-portal-primaryLiving hover:text-white drop-shadow'
  }  ${sizeClass} ${translate}  `;

  if (!!href) {
    return (
      <Link
        href={href}
        target={targetBlank ? '_blank' : undefined}
        className={`${CLASSES} `}
        onClick={onClick}
        rel={targetBlank ? 'noopener noreferrer' : undefined}
      >
        {children || `This is Link`}
      </Link>
    );
  }

  return (
    <div className={`${className}`}>
      <Spin spinning={loading} className="bg-transparent">
        <button
          disabled={disabled || loading}
          className={`${CLASSES}`}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      </Spin>
    </div>
  );
};

export default FormButton;
