import { Form, Input } from 'antd';
import './index.scss';

export interface InputProps {
  name: string | string[];
  row?: number;
  label?: string;
  rules?: any[];
  onChange?: any;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}
const { TextArea } = Input;
const FormFloatInputArea = ({
  name,
  label,
  rules,
  onChange,
  row = 1,
  required,
  disabled = false,
  placeholder,
}: InputProps) => {
  return (
    <div className="formTextArea">
      <Form.Item rules={rules} name={name} label={label}>
        <TextArea
          placeholder={placeholder}
          disabled={disabled}
          allowClear
          onChange={onChange}
          autoSize={{ minRows: row, maxRows: 6 }}
        />
      </Form.Item>
    </div>
  );
};

export default FormFloatInputArea;
