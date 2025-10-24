import { Form, Radio } from 'antd';
import './index.scss';

export interface InputProps {
  name: string | string[];
  label?: string;
  rules?: any[];
  options: any[];
  onChange?: (value) => void;
  disabled?: boolean;
}

const FormRadioSelectPackage = ({
  name,
  label,
  rules,
  options,
  onChange,
  disabled = false,
}: InputProps) => {
  return (
    <div className="formRadio">
      <Form.Item rules={rules} name={name} label={label}>
        <Radio.Group onChange={onChange} optionType="button" buttonStyle="solid">
          {options.map((item) => (
            <Radio
              disabled={item?.numberOfPost < 1 || disabled}
              className="mb-1 ml-2 !rounded-full"
              value={item?.value || item?.id}
            >
              {item?.name}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </div>
  );
};

export default FormRadioSelectPackage;
