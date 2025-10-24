import { filterOptions } from '@/libs/helper';
import { Select } from 'antd';
import { useTranslations } from 'next-intl';
import React, { InputHTMLAttributes } from 'react';
import './selectFilter.scss';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  options: any[];
  placeholder?: string;
  onChange?: (value?: any) => void;
  onSearch?: (value?: any) => void;
  className?: string;
  isDisabled?: boolean;
  isBorder?: boolean;
  allowClear?: boolean;
  defaultValue?: any;
}

const SelectFilter = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    placeholder,
    options = [],
    onChange,
    className,
    onSearch,
    allowClear = true,
    defaultValue = null,
  }) => {
    const t = useTranslations('webLabel');

    return (
      <div className={`${className} selectFilter`}>
        <span className="min-w-fit border-b border-[#E6E9EC] pr-2">
          {label ? `${label}:` : undefined}
        </span>
        <Select
          placement="bottomLeft"
          dropdownMatchSelectWidth={false}
          defaultValue={defaultValue}
          allowClear={allowClear}
          showSearch
          onSearch={onSearch}
          size="small"
          filterOption={onSearch ? false : filterOptions}
          onChange={onChange}
          className="line-clamp-1 w-full border-b border-l-0 border-r-0 border-t-0 border-[#E6E9EC] bg-transparent pb-0 text-sm focus:outline-none focus:ring-0"
          options={options}
          placeholder={placeholder ?? t('All')}
        />
      </div>
    );
  },
);
export default SelectFilter;
