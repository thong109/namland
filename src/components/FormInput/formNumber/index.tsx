import { inputNumberFormatter, inputNumberParse } from '@/libs/helper';
import { Form, InputNumber } from 'antd';
import './index.scss';

export interface InputProps {
  name: string | string[];
  label?: string;
  rules?: any[];
  onChange?: any;
  required?: boolean;
  disabled?: boolean;
  maxNum?: number;
  special?: any;
  showFormat?: boolean;
  precision?: number;
  step?: number;
}

const FormFloatNumber = ({
  name,
  label,
  rules,
  onChange,
  disabled = false,
  maxNum,
  special,
  showFormat = true,
  precision,
  step = 1,
}: InputProps) => {
  return (
    <div className="w-full">
      <Form.Item
        rules={rules}
        name={name}
        label={
          <span>
            {label} {special && special}
          </span>
        }
      >
        <InputNumber
          min={0}
          step={step}
          precision={precision}
          max={maxNum}
          disabled={disabled}
          className="w-full"
          formatter={showFormat ? (value) => inputNumberFormatter(value) : undefined}
          parser={(value) => inputNumberParse(value)}
          onChange={onChange}
        />
      </Form.Item>
    </div>
  );
};

export default FormFloatNumber;
