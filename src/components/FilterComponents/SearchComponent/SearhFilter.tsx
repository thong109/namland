import { Input } from 'antd/lib';
import React, { InputHTMLAttributes } from 'react';
import './searchFilter.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  onChange?: (value?: any) => void;
  className?: string;
  value?: string;
}

const SearchFilter = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, onChange, className, value }) => {
    return (
      <div className={`${className} searchFilter`}>
        <span className="min-w-fit border-b border-[#E6E9EC]">
          {label ? `${label}:` : undefined}
        </span>
        <Input
          value={value}
          allowClear
          onChange={onChange}
          className="w-full !rounded-none border-b border-l-0 border-r-0 border-t-0 border-[#E6E9EC] bg-transparent pb-0 text-sm focus:outline-none focus:ring-0"
          placeholder={placeholder}
        />
      </div>
    );
  },
);
export default SearchFilter;
