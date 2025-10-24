import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import { Slider } from 'antd';

const SliderSize = ({ range = [undefined, undefined], onchange, max, ...props }) => {
  return (
    <div>
      <div className="flex w-full justify-between">
        <div className="relative h-[30px] w-[45%] items-center rounded-[5px] border text-center">
          <div className="flex h-full items-center justify-center">
            <NumberFormatPrice value={range[0] ?? '-'} />
          </div>
        </div>
        <div className="relative h-[30px] w-[45%] items-center rounded-[5px] border text-center">
          <div className="flex h-full items-center justify-center">
            <NumberFormatPrice value={range[1] ?? '-'} />
          </div>
        </div>
      </div>
      <Slider
        range={true}
        min={0}
        max={max}
        value={range}
        tooltip={{ open: false }}
        onChange={(value) => onchange(value as [number, number])}
      />
    </div>
  );
};

export default SliderSize;
