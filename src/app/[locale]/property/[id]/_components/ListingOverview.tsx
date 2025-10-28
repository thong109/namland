import { listingType } from '@/libs/appconst';
import { formatNumber } from '@/libs/helper';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';
import React from 'react';
import FavoriteButton from './ListingOverview.FavoriteButton';
import ShareButton from './ListingOverview.ShareButton';
import PropertyInfoBox from '@/components/ListingCard/_component/PropertyInfoBox';

interface ListingOverviewProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ListingOverview: React.FC<ListingOverviewProps> = ({ listingDetail, locale }) => {
  const t = useTranslations('webLabel');

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-base font-medium">{listingDetail?.title}</h1>
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          {listingDetail?.location?.formattedAddress}
        </div>
        <div className="flex justify-between lg:block">
          <PropertyInfoBox
            listingDetail={listingDetail}
            className={'flex gap-3 self-start px-2 py-1'}
            overrideBasedStyle
          />
          <div className="flex flex-col-reverse gap-2 lg:hidden">
            <div className="flex gap-8">
              <ShareButton listingDetail={listingDetail} locale={locale} />
              <FavoriteButton listingDetail={listingDetail} locale={locale} />
            </div>
            <label className="text-right font-medium text-[#A80707]">
              {formatNumber(locale === 'vi' ? listingDetail?.priceVnd : listingDetail?.priceUsd)}{' '}
              {listingDetail?.type === listingType.rent && t('/mo')}
            </label>
          </div>
        </div>
      </div>
      <div className="hidden flex-col gap-2 lg:flex">
        <div className="flex gap-8">
          <ShareButton listingDetail={listingDetail} locale={locale} />
          <FavoriteButton listingDetail={listingDetail} locale={locale} />
        </div>
        <label className="text-right font-medium text-[#A80707]">
          {formatNumber(listingDetail?.priceVnd)} {locale === 'vi' ? 'VNĐ' : 'VNĐ'}
          {listingDetail?.type === listingType.rent && t('/mo')}
        </label>
      </div>
    </div>
  );
};

export default React.memo(ListingOverview);
