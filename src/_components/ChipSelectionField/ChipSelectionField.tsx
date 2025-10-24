'use client';

import { OptionModel } from '@/models/optionModel/optionModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';
import ChipButton from '../ChipButton/ChipButton';

interface ChipSelectionFieldProps {
  className?: string;
  value?: any;
  onChange?: (values: any) => void;
  allowClear?: boolean;
  multiple?: boolean;
  options: OptionModel[];
  hasAny?: boolean;
  tidyItem?: boolean;
}

const ChipSelectionField: React.FC<ChipSelectionFieldProps> = ({
  className,
  multiple = false,
  value = null,
  onChange = () => {},
  options = [],
  allowClear = true,
  hasAny = false,
  tidyItem = false,
  ...props
}) => {
  const t = useTranslations();

  const handleClick = useCallback(
    (option: string | number | boolean) => {
      if (!multiple) {
        if (allowClear && value === option) {
          onChange(null);
        } else {
          onChange(option);
        }
      } else {
        if (!option) {
          onChange(null);
        } else if (Array.isArray(value) && value?.includes(option)) {
          onChange(value.filter((type) => type !== option));
        } else {
          onChange([...(Array.isArray(value) ? value : []), option]);
        }
      }
    },
    [value, onChange, multiple],
  );

  return (
    <div className={clsx('flex flex-wrap gap-2', className, tidyItem ? 'flex-wrap' : 'flex-row')}>
      {hasAny && (
        <ChipButton
          key={'any'}
          onClick={() => handleClick(null)}
          selected={value === undefined || value === null}
          label={t('Common.Any')}
          className={clsx(tidyItem ? 'min-w-[calc(33.33%-8px)] flex-grow' : '')}
        />
      )}
      {options.map((o, index) => (
        <ChipButton
          key={index}
          onClick={() => handleClick(o.id)}
          selected={multiple ? value?.includes(o.id) : value === o.id}
          label={o.name || o.value}
          className={clsx(tidyItem ? 'min-w-[calc(33.33%-8px)] flex-grow' : '')}
        />
      ))}
    </div>
  );
};

export default ChipSelectionField;
