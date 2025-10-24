'use client';

import React, { FC, useEffect, useState } from 'react';
import './radioButton.scss';

export interface RadioModel {
  value: number | string;
  label: number | string;
}

export interface ButtonProps {
  className?: string;

  disabled?: boolean;
  onChange?: (value) => void;
  children?: React.ReactNode;
  option?: RadioModel[];
  defaultValue?: any;
}

const RadioButton: FC<ButtonProps> = ({
  option = [],
  disabled = false,
  children,
  defaultValue,
  onChange = () => {},
}) => {
  const [choosedValue, setChoosedValue] = useState(undefined);

  useEffect(() => {
    onChange(choosedValue);
  }, [choosedValue]);

  return (
    <div className={`toggle select-none drop-shadow-2xl`}>
      {option.map((item) => {
        return (
          <>
            <input
              type="radio"
              name="radio-default"
              value={item.value}
              onClick={() => setChoosedValue(item.value)}
              id={item.value.toString()}
              defaultChecked={item.value === defaultValue}
            />
            <label htmlFor={item.value.toString()}>{item.label}</label>
          </>
        );
      })}
    </div>
  );
};

export default RadioButton;
