import { Slider } from 'antd';
import { SliderRangeProps, SliderSingleProps } from 'antd/es/slider';
import { SliderRef } from 'rc-slider';
import React from 'react';
import './index.scss';
type InputProps = {
  markerFormatter?: (value: number) => string;
  displayDistance?: string;
};

const SliderWithHomeFilterDisplay = React.forwardRef<
  SliderRef,
  (SliderRangeProps | SliderSingleProps) & InputProps
>((props, ref) => {
  // const [marks, setMarks] = useState<SliderMarks>({});

  return (
    <div className={'price-slide'}>
      <div className="flex w-full justify-between">
        <div className="relative flex h-[30px] w-[45%] items-center justify-center rounded-[5px] border text-center">
          <div className="">
            {props.value ? (
              <div className="flex gap-x-1">
                <span> {props.range ? props.value[0] : 0}</span>
                {'  '}
                {props?.displayDistance ? (
                  <span>{props?.displayDistance}</span>
                ) : (
                  <span>
                    m<sup>2</sup>
                  </span>
                )}
              </div>
            ) : (
              <div className="flex gap-x-1">
                0{' '}
                {props?.displayDistance ? (
                  <span> {props?.displayDistance}</span>
                ) : (
                  <span>
                    {' '}
                    m<sup>2</sup>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex h-[30px] w-[45%] items-center justify-center rounded-[5px] border text-center">
          <div className="">
            {props.value ? (
              <div className="flex gap-x-1">
                <span>
                  {' '}
                  {props.range ? props.value[1] : props.markerFormatter(Number(props.value))}
                </span>
                {'  '}
                {props?.displayDistance ? (
                  <span>{props?.displayDistance}</span>
                ) : (
                  <span>
                    {' '}
                    m<sup>2</sup>
                  </span>
                )}
              </div>
            ) : (
              <div className="flex gap-x-1">
                0{' '}
                {props?.displayDistance ? (
                  <span> {props?.displayDistance}</span>
                ) : (
                  <span>
                    {' '}
                    m<sup>2</sup>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Slider className={props.className ?? ''} ref={ref} {...props} tooltip={{ open: false }} />
    </div>
  );
});

export default SliderWithHomeFilterDisplay;
