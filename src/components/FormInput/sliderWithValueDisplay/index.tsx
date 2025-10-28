import NumberUtil from '@/utils/numberUtil';
import { Slider } from 'antd';
import { SliderMarks, SliderRangeProps, SliderSingleProps } from 'antd/es/slider';
import { useLocale } from 'next-intl';
import { SliderRef } from 'rc-slider';
import React, { useEffect, useState } from 'react';
import './index.scss';
type InputProps = {
  markerFormatter: (value: number) => string;
};

const SliderWithValueDisplay = React.forwardRef<
  SliderRef,
  (SliderRangeProps | SliderSingleProps) & InputProps
>((props, ref) => {
  const [marks, setMarks] = useState<SliderMarks>({});
  const [oldMarks, setOldMarks] = useState<[number, number]>([0, 0]);
  const locale = useLocale();
  const getMark = (value: number) => {
    let positionClass = '';
    if ((props.max - value) / props.max <= 0.1) {
      positionClass = 'shift-left';
    } else if ((props.max - value) / props.max >= 0.9) {
      positionClass = 'shift-right';
    }

    return {
      style: {
        zIndex: markBeingChanged === value ? 10 : 1,
      },
      label: (
        <div
          className={
            'slider-mark bg-portal-primaryLiving-1 text-sm text-portal-primaryLiving ' +
            positionClass
          }
        >
          {locale == 'vi' ? NumberUtil.formatNumberToTrieuTy(value) : props.markerFormatter(value)}
        </div>
      ),
    };
  };

  let markBeingChanged = 0;

  useEffect(() => {
    const result: SliderMarks = {};
    if (
      props.value != null &&
      typeof props.value != 'undefined' &&
      Array.isArray(props.value) &&
      props.value.length > 0
    ) {
      let markBeingChangeIndex = 1;
      if (props.value[0] !== oldMarks[0]) {
        markBeingChangeIndex = 0;
      } else if (props.value[1] !== oldMarks[1]) {
        markBeingChangeIndex = 1;
      }

      markBeingChanged = props.value[markBeingChangeIndex];
      setOldMarks([props.value[0], props.value[1]]);

      result[props.value[0].toString()] = getMark(props.value[0]);
      result[props.value[1].toString()] = getMark(props.value[1]);
    } else if (
      props.value != null &&
      typeof props.value != 'undefined' &&
      !Array.isArray(props.value)
    ) {
      result[props.value.toString()] = getMark(props.value);
    }
    setMarks(result);
  }, [props.value]);

  return (
    <div className="default-slide">
      <Slider
        className={'mt-12 ' + (props.className ?? '')}
        ref={ref}
        {...props}
        marks={marks}
        tooltip={{ open: false }}
      />
    </div>
  );
});

export default SliderWithValueDisplay;
