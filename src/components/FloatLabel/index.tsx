import { FC, useEffect, useState } from 'react';

import './index.css';

export interface FloatingLabelProps {
  children: any;
  label: string;
  data?: any;
  required?: boolean;
  form?: any;
  name?: string;
  changeValue?: any;
}
const FloatLabel: FC<FloatingLabelProps> = ({
  children,
  label,
  data,
  required,
  form,
  name,
  changeValue,
}) => {
  const [focus, setFocus] = useState(
    form ? (form?.getFieldValue(name) != (undefined || null) ? true : false) : false,
  );
  const labelClass = focus || data ? 'label-custom label-float' : 'label-custom';
  useEffect(() => {
    form?.getFieldValue(name) !== undefined ? setFocus(true) : setFocus(false);
  }, [changeValue]);
  return (
    <div
      className={`float-label-custom mt-1`}
      onBlur={() => {
        if (form) {
          form?.getFieldValue(name) !== undefined ? setFocus(true) : setFocus(false);
        } else {
          setFocus(false);
        }
      }}
      onFocus={() => setFocus(true)}
    >
      {children}
      <label className={`${labelClass} text-gray-500`}>
        {label} {required && <span> *</span>}
      </label>
    </div>
  );
};

export default FloatLabel;
