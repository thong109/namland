import { formatDate } from '@/libs/helper';
import { DatePicker, Form } from 'antd';
import { FC } from 'react';

const { RangePicker }: any = DatePicker;
export interface IProps {
  name: string;
  label?: string;
  onChange?: (value) => void;
}

const AppRangeDateFilter: FC<IProps> = ({ name, label, onChange }) => {
  return (
    <Form.Item name={name} label={label} className="custom-form-filter">
      <RangePicker
        onChange={onChange}
        format={formatDate}
        allowEmpty={[true, true]}
        className="custom-picker-portal w-full !rounded-none border-b border-l-0 border-r-0 border-t-0 !border-[#E6E9EC] bg-transparent pb-0 text-sm !shadow-none focus:outline-none focus:ring-0"
      />
    </Form.Item>
  );
};
export default AppRangeDateFilter;
