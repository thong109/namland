import { LegalStatusEnum } from '@/libs/enums/LegalStatusEnum';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';
import { formatNumber } from '@/libs/helper';
import { listingType } from '@/libs/appconst';

interface ArticleInformationOverviewAboutProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ArticleInformationOverviewAbout: React.FC<ArticleInformationOverviewAboutProps> = ({
  locale,
  listingDetail,
}) => {
  const t = useTranslations('webLabel');
  const enumTranslator = useTranslations('enum');
  const renderItem = useCallback(
    (title: string | React.ReactNode, value: string | number | React.ReactNode) => {
      return (
        <>
          <div className="col-span-1 text-sm font-medium text-neutral-900">{title}</div>
          <div className="col-span-1 text-sm font-normal text-neutral-500">{value}</div>
        </>
      );
    },
    [],
  );
  return (
    <div className='article-common-information__about'>
      <div className='article-common-information__about-price'>
        <div className='article-common-information__price-wrapper'>{formatNumber(locale === 'vi' ? listingDetail?.priceVnd : listingDetail?.priceUsd)}{' '}{listingDetail?.type === listingType.rent && t('/mo')}</div>
        <span className='article-common-information__price-note'>(Giá chưa bao gồm VAT và phí dịch vụ)</span>
      </div>
      <div className='article-common-information__about-entry'>
        <div className='article-common-information__entry-wrapper'>{listingDetail?.bedrooms ?? 'ー'}</div>
        <span className='article-common-information__entry-label'>Phòng ngủ</span>
      </div>
      <div className='article-common-information__about-entry'>
        <div className='article-common-information__entry-wrapper'>{listingDetail?.bathrooms ?? 'ー'}</div>
        <span className='article-common-information__entry-label'>Toilet</span>
      </div>
      <div className='article-common-information__about-entry'>
        <div className='article-common-information__entry-wrapper'>{listingDetail?.size ?? 'ー'}</div>
        <span className='article-common-information__entry-label'>Diện tích</span>
      </div>
    </div>
  );
};

export default React.memo(ArticleInformationOverviewAbout);
