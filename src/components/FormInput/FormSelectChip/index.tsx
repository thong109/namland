import { Form } from 'antd';
import ChipSelectComponents from './components/ChipSelectComponents';
import './index.scss';

export interface InputProps {
  name: string | string[];
  label?: string;
  rules?: any[];
  options: any[];
  onChange?: (value) => void;
  disabled?: boolean;
}

const FormSelectChip = ({ name, label, rules, options, disabled = false }: InputProps) => {
  return (
    <div className="formSelectChip">
      <Form.Item rules={rules} name={name} label={label}>
        <ChipSelectComponents disabled={disabled} multiple options={options} />
      </Form.Item>
    </div>
  );
};

export default FormSelectChip;
