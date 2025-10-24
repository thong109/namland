import { DatePicker, Form } from 'antd';
import './index.scss';

export interface DateProps {
  name: string | string[];
  label?: string;
  rules?: any[];
  onChange?: (value) => void;
  required?: boolean;
  disabled?: boolean;
  disabledDate?: any;
  showTime?: boolean;
  format?: string;
  minuteStep?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49
    | 50
    | 51
    | 52
    | 53
    | 54
    | 55
    | 56
    | 57
    | 58;
}

const FormFloatDate = ({
  name,
  label,
  rules,
  onChange,
  disabled = false,
  disabledDate,
  showTime = false,
  format = 'DD/MM/YYYY',
  minuteStep = 1,
}: DateProps) => {
  return (
    <div className="formDatePicker">
      <Form.Item rules={rules} name={name} label={label}>
        <DatePicker
          onChange={onChange}
          placeholder=""
          disabledDate={disabledDate}
          disabled={disabled}
          showTime={showTime}
          format={format}
          allowClear={true}
          className="w-full"
          minuteStep={minuteStep}
        />
      </Form.Item>
    </div>
  );
};

export default FormFloatDate;
