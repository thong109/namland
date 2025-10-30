import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';
import React from 'react';
import FavoriteButton from '@/components/ArticleInformation/ArticleInformationOverview.FavoriteButton';
import ShareButton from '@/components/ArticleInformation/ArticleInformationOverview.ShareButton';
import PropertyInfoBox from '@/components/CardListing/_component/PropertyInfoBox';
import { assetsImages } from '@/assets/images/package';
import ArticleInformationOverviewAbout from './ArticleInformationOverviewAbout';

interface ArticleInformationOverviewProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ArticleInformationOverview: React.FC<ArticleInformationOverviewProps> = ({ listingDetail, locale }) => {
  const t = useTranslations('webLabel');

  return (
    <div className='article-common-information article-common-information--overview' id='overview'>
      <h1 className='article-common-information__title'>{listingDetail?.title}</h1>
      <address className='article-common-information__address'><span className='article-common-information__address-icon'></span>{listingDetail?.location?.formattedAddress}</address>
      <ArticleInformationOverviewAbout locale={locale} listingDetail={listingDetail} />
      <div className='article-common-information__description'>
        <span className='article-common-information__description-label'>{t('EcomPropertyDetailPageDetailDescription')}</span>
        <div className='article-common-information__description-wrapper'>{listingDetail?.description}</div>
      </div>
    </div>
  );
};

export default React.memo(ArticleInformationOverview);
