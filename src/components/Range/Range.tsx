import NumberTrim from '@/components/NumberTrim/NumberTrim';
import { Slider } from 'antd';
import './Range.css';

export interface InputProps {
  min?: number;
  max?: number;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}

const Range = ({ min = 0, max = 20000000000, value = [min, max], onChange }: InputProps) => {
  const marks = {
    [value[0]]: {
      label: (
        <div className='range-common__value range-common__value--start'>
          <NumberTrim value={value[0]} />
        </div>
      ),
    },
    [value[1]]: {
      label: (
        <div className='range-common__value range-common__value--end'>
          <NumberTrim value={value[1]} />
        </div>
      ),
    },
  };

  return (
    <>
      <Slider
        className='range-common'
        range
        marks={marks}
        onChange={onChange}
        min={min}
        max={max}
        value={value}
        tooltip={{ open: false }}
      />
    </>
  );
};

export default Range;
