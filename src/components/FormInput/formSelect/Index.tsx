import { filterOptions } from '@/libs/helper';
import { Form, Select } from 'antd';
import './index.scss';

export interface InputProps {
  name: string | string[];
  label?: string;
  rules?: any[];
  options: any[];
  multiSelect?: boolean;
  onChange?: (value) => void;
  onSearch?: (value) => void;
  required?: boolean;
  showSearch?: boolean;
  filterOption?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onKeyDown?: (value) => void;
  initialValue?: any;
}

const FormFloatSelect = ({
  name,
  label,
  rules,
  options,
  multiSelect = false,
  onChange,
  required,
  showSearch = false,
  filterOption = true,
  disabled = false,
  onSearch,
  placeholder,
  onKeyDown,
}: InputProps) => {
  return (
    <>
      <div className="formSelect">
        <Form.Item rules={rules} name={name} label={label}>
          <Select
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            mode={multiSelect ? `multiple` : undefined}
            onChange={onChange}
            allowClear
            showSearch={showSearch}
            onSearch={onSearch}
            optionFilterProp="children"
            options={options}
            filterOption={filterOption ? filterOptions : false}
          />
        </Form.Item>
      </div>
    </>
  );
};

export default FormFloatSelect;
