import LangDropdownFlag from '@/components/Header/SelectLanguageMenu';
import React, { InputHTMLAttributes, useState } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  label?: string;
  disable?: boolean;
  required?: boolean;
  multiLanguage?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;

  enValue?: string;
  onEnValueChange?: (value: string) => void;

  krValue?: string;
  onKrValueChange?: (value: string) => void;
}

const FloatInput = React.forwardRef<HTMLInputElement, InputProps>(
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
      multiLanguage = false,
      value,
      onValueChange,
      enValue,
      onEnValueChange,
      krValue,
      onKrValueChange,
      ...args
    },
    ref,
  ) => {
    const [selectedLang, setSelectedLange] = useState<string>('vi');

    const inputClassname = `${disable ? 'text-gray-400' : 'text-black'} ${
      multiLanguage ? 'pr-20' : ''
    } w-full block py-2 px-0 text-sm bg-transparent border-0 border-b border-[#a6a6a8] appearance-none  focus:outline-none focus:ring-0`;

    return (
      <div
        className={`relative z-0 ${rounded} ${fontClass} ${sizeClass} ${className} focus-within:z-20`}
      >
        {!multiLanguage && (
          <input
            ref={ref}
            disabled={disable}
            type={type}
            {...args}
            className={`${inputClassname}`}
            placeholder=" "
            value={value}
          />
        )}

        {multiLanguage && selectedLang == 'vi' && (
          <input
            ref={ref}
            disabled={disable}
            type={type}
            {...args}
            className={`${inputClassname}`}
            placeholder=" "
            value={value}
            onChange={(e) => onValueChange && onValueChange(e.target.value)}
          />
        )}

        {multiLanguage && selectedLang == 'en' && (
          <input
            ref={ref}
            disabled={disable}
            type={type}
            {...args}
            className={`${inputClassname}`}
            placeholder=" "
            value={enValue}
            onChange={(e) => onEnValueChange && onEnValueChange(e.target.value)}
          />
        )}

        {multiLanguage && selectedLang == 'kr' && (
          <input
            ref={ref}
            disabled={disable}
            type={type}
            {...args}
            className={`${inputClassname}`}
            placeholder=" "
            value={krValue}
            onChange={(e) => onKrValueChange && onKrValueChange(e.target.value)}
          />
        )}
        <label
          className={`absolute top-3 -z-10 origin-[0] -translate-y-6 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-90`}
        >
          {label}
          {required && <span className="text--portal-primaryLiving">*</span>}
        </label>
        {multiLanguage && (
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 transform`}>
            <LangDropdownFlag
              panelClassName="z-20 px-4 w-screen max-w-[100px] mt-4 right-0 sm:px-0"
              onChange={setSelectedLange}
            ></LangDropdownFlag>
          </div>
        )}
      </div>
    );
  },
);

export default FloatInput;
