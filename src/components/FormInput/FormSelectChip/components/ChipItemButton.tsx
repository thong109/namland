import clsx from 'clsx';
import React from 'react';

interface ChipButtonProps {
  onClick?: () => void;
  selected: boolean;
  label: string;
}

const ChipItemButton: React.FC<ChipButtonProps> = ({ onClick, selected, label }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex h-8 items-center justify-center whitespace-nowrap rounded-3xl border border-property-item-background-selected px-4 py-1 text-[#575757]',
        {
          'bg-property-item-background-selected text-[#ffffff]': selected === true,
        },
      )}
      type="button"
    >
      {label}
    </button>
  );
};

export default ChipItemButton;
