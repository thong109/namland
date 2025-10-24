import clsx from 'clsx';
import React from 'react';

interface ChipButtonProps {
  onClick?: () => void;
  selected: boolean;
  label: string;
  className?: string;
}

const ChipButton: React.FC<ChipButtonProps> = ({ onClick, selected, label, className }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `chip-button ${className}`,
        'flex h-8 items-center justify-center whitespace-nowrap rounded-full border border-portal-primaryButtonAdmin px-3 py-1',
        selected === true
          ? 'chip-button-selected bg-portal-primaryButtonAdmin text-neutral-0'
          : 'bg-neutral-0 text-pmh-text',
      )}
      type="button"
    >
      {label}
    </button>
  );
};

export default ChipButton;
