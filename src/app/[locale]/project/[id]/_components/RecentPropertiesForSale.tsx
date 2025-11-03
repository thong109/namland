"use client";
import React from 'react';
import RecentPropertiesClient from './RecentPropertiesClient';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
const RecentPropertiesForSale = () => {
  const t = useTranslations('webLabel');

  return (
    <div className="pt-12 md:pt-[84px] pb-8 md:pb-[60px]">
      <div className="container">
        <Typography className="text-center text-black text-lg md:text-[30px] font-semibold mb-[13px]">
          {t(`EcomPropertyListingPageSearchProjectNameDifferent`)}
        </Typography>
        <RecentPropertiesClient />
      </div>
    </div>
  );
};

export default RecentPropertiesForSale;
