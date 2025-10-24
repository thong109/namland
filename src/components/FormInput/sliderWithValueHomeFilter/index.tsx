import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import { Slider } from 'antd';
import { SliderRangeProps, SliderSingleProps } from 'antd/es/slider';
import { SliderRef } from 'rc-slider';
import React, { useState } from 'react';
import './index.scss';
type InputProps = {
  markerFormatter: (value: number) => string;
};

const SliderWithHomeFilterDisplay = React.forwardRef<
  SliderRef,
  (SliderRangeProps | SliderSingleProps) & InputProps
>((props, ref) => {
  // const [marks, setMarks] = useState<SliderMarks>({});
  const [oldMarks, setOldMarks] = useState<[number, number]>([0, 0]);

  const getMark = (value: number) => {
    let positionClassV2 = '';
    if (value == props.value[0]) {
      positionClassV2 = 'shift-left-v2';
    } else {
      positionClassV2 = 'shift-right-v2';
    }
    return {
      style: {
        zIndex: markBeingChanged === value ? 10 : 1,
      },
      label: (
        <div
          className={
            'slider-mark bg-portal-primaryLiving-1 text-sm text-portal-primaryLiving ' +
            +positionClassV2
          }
        >
          {props.markerFormatter(value)}
        </div>
      ),
    };
  };

  let markBeingChanged = 0;

  // useEffect(() => {
  //   const result: SliderMarks = {};
  //   if (
  //     props.value != null &&
  //     typeof props.value != 'undefined' &&
  //     Array.isArray(props.value) &&
  //     props.value.length > 0
  //   ) {
  //     let markBeingChangeIndex = 1;
  //     if (props.value[0] !== oldMarks[0]) {
  //       markBeingChangeIndex = 0;
  //     } else if (props.value[1] !== oldMarks[1]) {
  //       markBeingChangeIndex = 1;
  //     }

  //     markBeingChanged = props.value[markBeingChangeIndex];
  //     setOldMarks([props.value[0], props.value[1]]);

  //     result[props.value[0].toString()] = getMark(props.value[0]);
  //     result[props.value[1].toString()] = getMark(props.value[1]);
  //   } else if (
  //     props.value != null &&
  //     typeof props.value != 'undefined' &&
  //     !Array.isArray(props.value)
  //   ) {
  //     result[props.value.toString()] = getMark(props.value);
  //   }
  //   setMarks(result);
  // }, [props.value]);

  return (
    <div className={'home-filter flex w-full items-center justify-center'}>
      <div className="left relative mr-[8px] lg:mr-[8px]">
        <div className="shift-left-v2 slider-mark bg-portal-primaryLiving-1 text-sm text-portal-primaryLiving">
          {props.value ? (
            <NumberFormatPrice value={props.value[0]} className=""></NumberFormatPrice>
          ) : (
            ''
          )}
        </div>
      </div>

      <Slider
        className={props.className ?? 'mt-12'}
        ref={ref}
        {...props}
        tooltip={{ open: false }}
      />
      <div className="right relative ml-[8px] lg:ml-[8px]">
        <div className="shift-right-v2 slider-mark bg-portal-primaryLiving-1 text-sm text-portal-primaryLiving">
          {props.value ? (
            <NumberFormatPrice value={props.value[1]} className=""></NumberFormatPrice>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});

export default SliderWithHomeFilterDisplay;
