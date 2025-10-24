import PriceNumberText from '@/app/[locale]/_components/PriceNumberText/PriceNumberText';
import { Slider } from 'antd';

export interface IProps {
  range?: any;
  onchange?: (value: [number | undefined, number | undefined]) => void;
  max?: any;
}
const SliderFrice = ({ onchange, max, range = [undefined, undefined], ...props }: IProps) => {
  return (
    <div>
      <div className="flex w-full justify-between">
        <div className="relative h-[30px] w-[45%] items-center rounded-[5px] border text-center">
          <div className="flex h-full items-center justify-center">
            <PriceNumberText value={range[0] ?? '-'} displayPriceType={0} />
          </div>
        </div>
        <div className="relative h-[30px] w-[45%] items-center rounded-[5px] border text-center">
          <div className="flex h-full items-center justify-center">
            <PriceNumberText value={range[1] ?? '-'} displayPriceType={0} />
          </div>
        </div>
      </div>
      <Slider
        range={true}
        min={0}
        max={max}
        tooltip={{ open: false }}
        onChange={(value) => onchange(value as [number, number])}
        value={range}
      />
    </div>
  );
};

export default SliderFrice;
