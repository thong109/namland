'use client';

import { OptionModel } from '@/models/optionModel/optionModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';
import ButtonChip from '../ButtonChip/ButtonChip';
import './SelectorChip.css';

interface SelectorChipProps {
  className?: string;
  value?: any;
  onChange?: (values: any) => void;
  allowClear?: boolean;
  multiple?: boolean;
  options: OptionModel[];
  hasAny?: boolean;
  tidyItem?: boolean;
}

const SelectorChip: React.FC<SelectorChipProps> = ({
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
    <div className={`selector-common-chip ${clsx(className ? className : '')}`}>
      {hasAny && (
        <ButtonChip
          key={'any'}
          onClick={() => handleClick(null)}
          selected={value === undefined || value === null}
          label={t('Common.Any')}
        />
      )}
      {options.map((o, index) => (
        <ButtonChip
          key={index}
          onClick={() => handleClick(o.id)}
          selected={multiple ? value?.includes(o.id) : value === o.id}
          label={o.name || o.value}
        />
      ))}
    </div>
  );
};

export default SelectorChip;
