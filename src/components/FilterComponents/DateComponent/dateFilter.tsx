import { formatDate } from '@/libs/helper';
import { DatePicker } from 'antd';
import React, { InputHTMLAttributes } from 'react';

import './dateFilter.scss';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  placeholders?: [string, string];
  onChange?: (value?: any) => void;
  className?: string;
}
const { RangePicker }: any = DatePicker;
const RangeDateFilter = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholders, onChange, className }) => {
    return (
      <div className={`${className}`}>
        {/* <span
          className="min-w-fit border-b  
         border-[#E6E9EC]"
        >
          {label ? `${label}:` : undefined}
        </span> */}
        <RangePicker
          placeholder={placeholders}
          format={formatDate}
          allowEmpty={[true, true]}
          onChange={onChange}
          className="w-full"
        />
      </div>
    );
  },
);
export default RangeDateFilter;
