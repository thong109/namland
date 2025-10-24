'use client';

import { PriceDisplayTypeEnum } from '@/libs/enums/PriceDisplayTypeEnum';
import { useLocale, useTranslations } from 'next-intl';
import React, { FC } from 'react';

import { NumericFormat } from 'react-number-format';
export interface PriceNumberTextProps {
  className?: string;
  value: number;
  displayPriceType: PriceDisplayTypeEnum;
  localeParams?: string;
}

const PriceNumberText: FC<PriceNumberTextProps> = ({
  className = '',
  value,
  localeParams,
  displayPriceType,
}) => {
  const locale = useLocale();
  const t = useTranslations();

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
        className={className}
        value={value}
        displayType={'text'}
        // Sử dụng dấu ngăn cách hàng nghìn
        renderText={(value) => 'VND ' + formatNumberToTrieuTy(value)}
      ></NumericFormat>

      {/* {displayPriceType === PriceDisplayTypeEnum.PricePerMonth && (
        <span> / {t('Common.month')}</span>
      )} */}
    </>
  );
};
export default React.memo(PriceNumberText);
