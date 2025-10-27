import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import { Slider } from 'antd';
import { RangeProps, SliderSingleProps } from 'antd/es/slider';
import { SliderRef } from 'rc-slider';
import React from 'react';
import './index.scss';
type InputProps = {
  markerFormatter: (value: number) => string;
};

const SliderWithHomeFilterDisplay = React.forwardRef<
  SliderRef,
  (RangeProps | SliderSingleProps) & InputProps
>((props, ref) => {
  // const [marks, setMarks] = useState<SliderMarks>({});

  return (
    <div className={'price-slide'}>
      <div className="flex w-full justify-between">
        <div className="relative h-[30px] w-[45%] items-center rounded-[5px] border text-center">
          <div className="flex h-full items-center justify-center">
            {props.value ? (
              <NumberFormatPrice value={props.value[0]} className=""></NumberFormatPrice>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="relative h-[30px] w-[45%] items-center rounded-[5px] border text-center">
          <div className="flex h-full items-center justify-center">
            {props.value ? (
              <NumberFormatPrice value={props.value[1]} className=""></NumberFormatPrice>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>

      <Slider className={props.className ?? ''} ref={ref} {...props} tooltip={{ open: false }} />
    </div>
  );
});

export default SliderWithHomeFilterDisplay;
