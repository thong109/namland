import { FC, useMemo, useState } from 'react';

import { Form } from 'antd';
import { FormItemProps } from 'antd/lib';
import clsx from 'clsx';
import './index.css';

export interface FloatingLabelProps {
  children: any;
  label: string;
  required?: boolean;
  form?: any;
  name?: string;
}
const FloatLabel: FC<FloatingLabelProps & FormItemProps> = ({
  children,
  label,
  required,
  form,
  name,
  ...props
}) => {
  const [focus, setFocus] = useState(false);
  const data = Form.useWatch(name, form);

  const labelClass = useMemo(
    () => (focus || data ? 'label-custom label-float' : 'label-custom'),
    [focus, data],
  );

  return (
    <div
      className={clsx(`float-label-custom mt-1`, props.className)}
      onBlur={() => {
        setFocus(false);
      }}
      onFocus={() => setFocus(true)}
    >
      <Form.Item name={name} {...{ className: 'relative', ...props }}>
        {children}
      </Form.Item>
      <label className={clsx(`text-gray-500`, labelClass)}>
        {label} {required && <span> *</span>}
      </label>
    </div>
  );
};

export default FloatLabel;
