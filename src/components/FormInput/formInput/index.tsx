import { Form, Input } from 'antd';
import './index.scss';

export interface InputProps {
  name: string | string[];

  label?: string;
  rules?: any[];
  onChange?: any;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

const FormFloatInput = ({
  name,

  label,
  rules,
  onChange,
  required,
  disabled = false,
  type = 'text',
}: InputProps) => {
  return (
    <div className="formInput">
      <Form.Item rules={rules} name={name} label={label}>
        <Input size="middle" type={type} disabled={disabled} allowClear onChange={onChange} />
      </Form.Item>
    </div>
  );
};

export default FormFloatInput;
