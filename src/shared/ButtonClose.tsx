import twFocusClass from '@/utils/twFocusClass';
import { XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react';

export interface ButtonCloseProps {
  className?: string;
  onClick?: () => void;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({ className = '', onClick = () => {} }) => {
  return (
    <button
      className={
        `flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 ${className} ` +
        twFocusClass()
      }
      onClick={onClick}
    >
      <span className="sr-only">Close</span>
      <XMarkIcon className="h-6 w-6" />
    </button>
  );
};

export default ButtonClose;
