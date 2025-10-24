import { Form } from 'antd';
import SelectionComponent from './Components/SelectionComponent';
import './index.scss';

export interface InputProps {
  name: string | string[];
  label?: string;
  rules?: any[];
  options: any[];
  multiSelect?: boolean;
  onChange?: (value) => void;
  required?: boolean;
  showSearch?: boolean;
  disabled?: boolean;
  placeholder?: string;
  amenityEnum?: number;
}

const FormSelectIcon = ({
  name,
  label,
  rules,
  options,
  disabled = false,
  amenityEnum,
}: InputProps) => {
  return (
    <div className="formSelectIcon">
      <Form.Item rules={rules} name={name} label={label}>
        <SelectionComponent
          amenityEnum={amenityEnum}
          disabled={disabled}
          options={options?.map((p) => ({
            name: p.name,
            value: p.value,
            imageUrl: p.imageUrl,
          }))}
          optionStyle="iconLabel"
        />
      </Form.Item>
    </div>
  );
};

export default FormSelectIcon;
