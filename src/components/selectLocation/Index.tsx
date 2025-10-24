import { filterOptions } from '@/libs/helper';
import { Form, Select } from 'antd';
import './index.scss';

export interface InputProps {
  name: string | string[];
  form: any;
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
}

const SelectLocation = ({
  name,
  form,
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
}: InputProps) => {
  return (
    <div className="formSelectLocation">
      <Form.Item rules={rules} name={name} label={label}>
        <Select
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
  );
};

export default SelectLocation;
