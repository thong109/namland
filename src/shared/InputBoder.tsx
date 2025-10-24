'use client';
import EyeCloseIcon from '@/assets/icon/eye-close.svg';
import EyeIcon from '@/assets/icon/eye.svg';
import Image from 'next/image';
import React, { useState } from 'react';
interface InputProps {
  type: string;
  value?: string;
  placeholder?: string;
  label: string;
  onChange?: (value: string) => void;
  isValid?: boolean;
  name?: string;
  required?: any;
  props?: any;
  className?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  value,
  placeholder,
  onChange,
  isValid,
  label,
  name,
  required,
  props,
  className,
  disabled = false,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.value);
  };
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative z-0 my-4">
      <input
        disabled={disabled}
        {...props}
        value={value}
        name={name}
        onChange={handleInputChange}
        type={showPass ? 'text' : type}
        id={label}
        placeholder=" "
        autoComplete="new-password"
        className={`${className} peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 hover:border-portal-primaryLiving focus:border-portal-primaryLiving focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white`}
      />
      <label
        htmlFor={label}
        className={` ${className} absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 dark:text-gray-400`}
      >
        {label}
        {required && <span className=""> *</span>}
      </label>
      <div className={`${type == 'password' ? '' : 'hidden'}`}>
        <Image
          alt=""
          onClick={() => {
            setShowPass(!showPass);
          }}
          src={showPass ? EyeIcon : EyeCloseIcon}
          className={`absolute right-0 top-4 h-5 w-5`}
        ></Image>
      </div>
    </div>
  );
};

export default Input;
