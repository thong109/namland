import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';
import React from 'react';
import PropertyInfoBox from '@/components/CardListing/_component/PropertyInfoBox';
import { formatNumber } from '@/libs/helper';
import { listingType } from '@/libs/appconst';
import { assetsImages } from '@/assets/images/package';
import './ArticleInformationOverview.css';

interface ArticleInformationOverviewProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ArticleInformationOverview: React.FC<ArticleInformationOverviewProps> = ({ listingDetail, locale }) => {
  const t = useTranslations('webLabel');

  return (
    <div className='article-common-information article-common-information--overview' id='overview'>
      <h1 className='article-common-information__title'>{listingDetail?.title}</h1>
      <address className='article-common-information__address'><span className='article-common-information__address-icon' style={{ backgroundImage: `url(${assetsImages.commonIconLocation.src})` }}></span>{listingDetail?.location?.formattedAddress}</address>
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
      <div className='article-common-information__description'>
        <span className='article-common-information__description-label'>{t('EcomPropertyDetailPageDetailDescription')}</span>
        <div className='article-common-information__description-wrapper'>{listingDetail?.description}</div>
      </div>
    </div>
  );
};

export default React.memo(ArticleInformationOverview);
