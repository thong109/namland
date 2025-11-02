import PriceNumberText from '@/components/PriceNumberText/PriceNumberText';
import { Slider } from 'antd';
import Range from '../Range/Range';

export interface IProps {
  range?: any;
  onchange?: (value: [number | undefined, number | undefined]) => void;
  max?: any;
}
const SliderFrice = ({ onchange, max, range = [undefined, undefined], ...props }: IProps) => {
  return (
    <div className='popup-common-searchprice__range'>
      <div className='popup-common-searchprice__range-label'>
        <div className='popup-common-searchprice__label-field'><PriceNumberText value={range[0] ?? '-'} displayPriceType={0} /></div>
        <div className='popup-common-searchprice__label-field'><PriceNumberText value={range[1] ?? '-'} displayPriceType={0} /></div>
      </div>
      <Range min={0} max={max} onChange={(value) => onchange(value as [number, number])} defaultValue={range} />
    </div>
  );
};

export default SliderFrice;
