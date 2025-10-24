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

const AppRadioFilter = ({ name, label, rules, options, onChange }: InputProps) => {
  return (
    <div className="appRadio">
      <Form.Item rules={rules} name={name} label={label}>
        <Radio.Group onChange={onChange} optionType="button" buttonStyle="solid">
          {options.map((item) => (
            <Radio className="mb-1 ml-2 !rounded-full" value={item?.value || item?.id}>
              {item?.name}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </div>
  );
};

export default AppRadioFilter;
