import { useLocale } from 'next-intl';
import { FC } from 'react';

import { NumericFormat } from 'react-number-format';
export interface NumberFormatPriceProps {
  className?: string;
  value: number;
  localeParams?: string;
}

const NumberFormatPrice: FC<NumberFormatPriceProps> = ({ className = '', value, localeParams }) => {
  const locale = useLocale();
  function lamTronSo(number) {
    var lamTron = Math.round(number * 100) / 100; // Làm tròn đến 3 chữ số thập phân
    if (lamTron % 1 === 0) {
      return Math.round(lamTron)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace(/\./g, ','); // Trả về số nguyên nếu không có dư
    } else {
      return lamTron
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace(/\./g, ','); // Trả về số thập phân nếu có dư
    }
  }
  const formatNumberToTrieuTy = (value) => {
    const formatWithOneDecimal = (number) => {
      const str = number.toString();
      const [integer, decimal] = str.split('.');
      return decimal ? `${integer}.${decimal.substring(0, 2)}` : integer;
    };

    if (value >= 1000000000) {
      return (
        formatWithOneDecimal(value / 1000000000) +
        (locale === 'vi' ? ' tỷ' : locale === 'en' ? ' bil' : '억')
      );
    } else if (value >= 1000000) {
      return (
        formatWithOneDecimal(value / 1000000) +
        (locale === 'vi' ? ' tr' : locale === 'en' ? ' mil' : '만')
      );
    } else if (value >= 1000) {
      return (
        formatWithOneDecimal(value / 1000) +
        (locale === 'vi' ? ' nghìn' : locale === 'en' ? ' th' : '천')
      );
      return value.toString();
    }
  };
  if (!localeParams) {
    localeParams = locale;
  }
  return localeParams == 'vi' ? (
    <NumericFormat
      className={className}
      value={value}
      displayType={'text'}
      // Sử dụng dấu ngăn cách hàng nghìn
      renderText={(value) => formatNumberToTrieuTy(value)}
    ></NumericFormat>
  ) : (
    <NumericFormat
      className={className}
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={localeParams == 'vi' ? '' : ''}
    ></NumericFormat>
  );
};

export default NumberFormatPrice;
