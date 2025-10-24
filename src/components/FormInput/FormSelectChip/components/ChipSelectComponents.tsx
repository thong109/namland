'use client';

import React, { useCallback } from 'react';
import ChipItemButton from './ChipItemButton';

interface ChipSelectionFieldProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  multiple?: boolean;
  options: any[];
  disabled?: boolean;
}

const ChipSelectComponents: React.FC<ChipSelectionFieldProps> = ({
  value = [],
  onChange = () => {},
  multiple = false,
  options = [],
  disabled = false,
  ...props
}) => {
  const handleClick = useCallback(
    (option: any) => {
      if (!multiple) {
        onChange([option.id]);
      } else if (value.includes(option.id)) {
        onChange([...value.filter((type) => type !== option.id)]);
      } else {
        value.push(option.id);
        onChange([...value]);
      }
    },
    [value, onChange, multiple],
  );

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {options.map((o, index) => (
        <ChipItemButton
          key={index}
          onClick={disabled ? undefined : () => handleClick(o)}
          selected={value.includes(o.id)}
          label={o?.name}
        />
      ))}
    </div>
  );
};

export default ChipSelectComponents;
