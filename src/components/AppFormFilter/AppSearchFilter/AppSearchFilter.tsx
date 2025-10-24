import { Form, Input } from 'antd';
import { FC } from 'react';

export interface IProps {
  name: string;
  label?: string;
  onChange?: (value) => void;
  placeholder?: string;
}

const AppSearchFilter: FC<IProps> = ({ name, label, onChange, placeholder }) => {
  return (
    <>
      <Form.Item name={name} className="custom-form-filter">
        <Input allowClear size="middle" onChange={onChange} placeholder={placeholder} />
      </Form.Item>

      <style scoped>
        {`
.ant-form-item {
margin-bottom: 10px
        }
`}
      </style>
    </>
  );
};
export default AppSearchFilter;
