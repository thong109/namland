import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  label?: string;
  disable?: boolean;
  required?: boolean;
  numRow?: number;
}

const FloatArea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  (
    {
      className = '',
      sizeClass = '',
      fontClass = 'text-sm font-normal',
      rounded = 'rounded-2xl',
      children,
      label = 'label',
      required = false,
      type = 'text',
      disable = false,
      numRow = 2,
      ...args
    },
    ref,
  ) => {
    return (
      <div className={`relative z-0 ${rounded} ${fontClass} ${sizeClass} ${className}`}>
        <textarea
          ref={ref}
          disabled={disable}
          rows={numRow}
          {...args}
          className={`block w-full px-0 py-2 text-sm ${
            disable ? 'text-gray-400' : 'text-black'
          } peer appearance-none border-0 border-b-2 border-gray-300 bg-transparent focus:border-portal-primaryLiving focus:outline-none focus:ring-0`}
          placeholder=" "
        ></textarea>
        <label
          className={`absolute top-3 -z-10 origin-[0] -translate-y-6 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-portal-primaryLiving`}
        >
          {label}
          {required && <span className="text--portal-primaryLiving">*</span>}
        </label>
      </div>
    );
  },
);

export default FloatArea;
