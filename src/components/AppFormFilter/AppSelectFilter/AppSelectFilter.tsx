import { filterOptions } from '@/libs/helper';
import { Form, Select } from 'antd';
import { FC } from 'react';
export interface IProps {
  name: string;
  label?: string;
  options?: any[];
  onChange?: (value) => void;
  placeholder?: string;
  filterOption?: boolean;
  onSearch?: (value) => void;
  isMultiple?: boolean;
  allowClear?: boolean;
}

const AppSelectFilter: FC<IProps> = ({
  name,
  label,
  options,
  onChange,
  onSearch,
  placeholder,
  filterOption = true,
  isMultiple = false,
  allowClear = true,
}) => {
  return (
    <Form.Item name={name}>
      <Select
        options={options}
        allowClear={allowClear}
        showSearch
        mode={isMultiple ? 'multiple' : undefined}
        onChange={onChange}
        onSearch={onSearch}
        placeholder={placeholder}
        filterOption={filterOption ? filterOptions : false}
      />
    </Form.Item>
  );
};
export default AppSelectFilter;
