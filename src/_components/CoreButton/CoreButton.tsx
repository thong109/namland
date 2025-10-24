import clsx from 'clsx';
import React from 'react';

interface CoreButtonProps {
  preset?: 'primary' | 'secondary' | 'neutral';
  className?: string;
  onClick?: () => void;
  label: string;

  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const CoreButton: React.FC<CoreButtonProps> = ({
  preset = 'primary',
  className,
  onClick = () => {},
  label,
  type = 'button',
  disabled = false,
}) => {
  return (
    <button
      className={clsx(
        'min-w-24 rounded-lg px-3 py-2',
        {
          'border border-portal-primaryButtonAdmin bg-neutral-0 text-neutral-1000':
            preset === 'neutral',
          'bg-portal-primaryButtonAdmin font-bold text-neutral-0': preset === 'primary',
          'bg-opacity-50': disabled && preset === 'primary',
        },
        className,
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default CoreButton;
