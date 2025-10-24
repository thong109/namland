import { Form } from 'antd';
import TagsInputShape from './components/TagInput';

export interface InputProps {
  name: string | string[];
  label?: string;
  rules?: any[];
  onChange?: (value) => void;
  onSearch?: (value) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}

const FormTagInputShap = ({
  name,
  label,
  rules,
  disabled = false,
  placeholder,
  type,
}: InputProps) => {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      <TagsInputShape disabled={disabled} placeholder={placeholder} type={type} />
    </Form.Item>
  );
};

export default FormTagInputShap;
