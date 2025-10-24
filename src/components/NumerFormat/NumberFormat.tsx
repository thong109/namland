import { FC } from 'react';

import { NumericFormat } from 'react-number-format';
export interface NumberFormatPriceProps {
  className?: string;
  value: number;
}

const NumberFormat: FC<NumberFormatPriceProps> = ({ className = '', value }) => {
  function inputNumberFormatter(value) {
    return `${(value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  return (
    <NumericFormat
      className={className}
      value={value}
      displayType={'text'}
      renderText={(value) => inputNumberFormatter(value)}
    ></NumericFormat>
  );
};

export default NumberFormat;
