import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React from 'react';
import ListingDetailedIndoorAmenity from './ListingDetailed.IndoorAmenity';
import ListingDetailedNearby from './ListingDetailed.Nearby';
import ListingDetailedOutdoorAmenity from './ListingDetailed.OutdoorAmenity';
import ListingDetailedPropertyDetails from './ListingDetailed.PropertyDetails';
import { YouTubeComponent } from './YoutubeEmbed';

const ListingDetailedLocation = dynamic(() => import('./ListingDetailed.Location'), { ssr: false });

interface ListingDetailedInfoProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ListingDetailedInfo: React.FC<ListingDetailedInfoProps> = ({ locale, listingDetail }) => {
  const t = useTranslations('webLabel');

  const blockTitleClassName = 'text-lg font-medium text-neutral-900 mb-4';

  return (
    <div className="flex flex-col gap-8 lg:rounded-[20px] lg:border lg:border-neutral-200 lg:px-6 lg:py-4">
      <div>
        <div className={clsx(blockTitleClassName)}>
          {t('EcomPropertyDetailPageDetailDescription')}
        </div>
        <div className="whitespace-pre-line">{listingDetail?.description}</div>
      </div>
      <div>
        <div className={clsx(blockTitleClassName)}>
          {t('EcomPropertyDetailPageDetailPropertyDetails')}
        </div>
        <div className="">
          <ListingDetailedPropertyDetails locale={locale} listingDetail={listingDetail} />
        </div>
      </div>
      {listingDetail?.inDoorAmenities?.length > 0 && (
        <div>
          <div className={clsx(blockTitleClassName)}>
            {t('EcomPropertyDetailPageIndoorAmenity')}
          </div>
          <ListingDetailedIndoorAmenity locale={locale} listingDetail={listingDetail} />
        </div>
      )}
      {listingDetail?.outDoorAmenities?.length > 0 && (
        <div>
          <div className={clsx(blockTitleClassName)}>
            {t('EcomPropertyDetailPageOutdoorAmenity')}
          </div>
          <ListingDetailedOutdoorAmenity locale={locale} listingDetail={listingDetail} />
        </div>
      )}
      {listingDetail?.nearBy?.length > 0 && (
        <div>
          <div className={clsx(blockTitleClassName)}>{t('EcomPropertyDetailPageNearByNearBy')}</div>
          <ListingDetailedNearby locale={locale} listingDetail={listingDetail} />
        </div>
      )}
      {listingDetail?.videoLink && (
        <div>
          <div className={clsx(blockTitleClassName)}>
            {t('EcomPropertyListingDetailPageGalleryVideosVideoLink')}
          </div>
          <YouTubeComponent videoUrl={listingDetail?.videoLink} />
        </div>
      )}
      <div>
        <div className={clsx(blockTitleClassName)}>{t('EcomPropertyDetailPageLocation')}</div>
        <ListingDetailedLocation locale={locale} listingDetail={listingDetail} />
      </div>
    </div>
  );
};

export default React.memo(ListingDetailedInfo);
