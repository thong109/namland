'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, { FC } from 'react';

import { NumericFormat } from 'react-number-format';
export interface IProps {
  className?: string;
  value: number;
  localeParams?: string;
}

const lamTronSo = (number) => {
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
};

const NumberTrim: FC<IProps> = ({ className = '', value, localeParams }) => {
  const locale = useLocale();
  const t = useTranslations();

  const formatNumberToTrieuTy = (value) => {
    if (value >= 1000000000) {
      return (
        lamTronSo(value / 1000000000) + (locale === 'vi' ? ' tỷ' : locale === 'en' ? ' bil' : '억')
      );
    } else if (value >= 1000000) {
      return (
        lamTronSo(value / 1000000) + (locale === 'vi' ? ' tr' : locale === 'en' ? ' mil' : '만')
      );
    } else if (value >= 1000) {
      return (
        lamTronSo(value / 1000) + (locale === 'vi' ? ' nghìn' : locale === 'en' ? ' th' : '천')
      );
    } else {
      return value.toString();
    }
  };
  if (!localeParams) {
    localeParams = locale;
  }
  return (
    <>
      <NumericFormat
        className={`${className}`}
        value={value}
        displayType={'text'}
        renderText={(value) => formatNumberToTrieuTy(value)}
      ></NumericFormat>
    </>
  );
};

export default React.memo(NumberTrim);
