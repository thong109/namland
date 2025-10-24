import NumberTrim from '@/components/NumberTrim/NumberTrim';
import { Slider } from 'antd';
export interface InputProps {
  min?: number;
  max?: number;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}

const SliderRange = ({ min = 0, max = 20000000000, value = [min, max], onChange }: InputProps) => {
  const marks = {
    [value[0]]: {
      label: (
        <div className="font-semibold">
          <NumberTrim value={value[0]} />
        </div>
      ),
    },
    [value[1]]: {
      label: (
        <div className="absolute -right-3 top-[-33px] font-semibold">
          <NumberTrim value={value[1]} />
        </div>
      ),
    },
  };

  return (
    <>
      <Slider
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

export default SliderRange;
