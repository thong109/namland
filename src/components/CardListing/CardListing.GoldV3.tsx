import IconLocation from '@/assets/icon/icon-location.svg';
import { getListingUrl } from '@/utils/urlUtil';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import PriceNumberText from '../PriceNumberText/PriceNumberText';
import AddToFavoriteButton from './_component/AddToFavoriteButton';
import LeaveInquiryButton from './_component/LeaveInquiryButton';
import PropertyInfoBox from './_component/PropertyInfoBox';

interface CardListingGoldProps {
  className?: string;
  listing: any;
}

const CardListingGold: React.FC<CardListingGoldProps> = ({ className, listing }) => {
  const locale = useLocale();

  const enumTranslator = useTranslations('enum');

  const listingDetail: any = listing;

  const images = listingDetail?.imageThumbnailUrls ?? [];

  const listingUrl = getListingUrl(listingDetail.id, listingDetail.title);

  return (
    <div className={clsx('relative', className)}>
      <AddToFavoriteButton listingDetail={listing} />

      <Link
        href={listingUrl}
        className="flex min-h-60 gap-4 border border-neutral-200 bg-neutral-0 p-2 hover:text-[unset]"
      >
        <div className="relative grid w-5/12 grid-cols-12 grid-rows-3 gap-1">
          <div className="relative col-span-9 row-span-3">
            {images[0] && <Image src={images[0]?.url} alt={images[0]?.name} fill />}
          </div>
          <div className="relative col-span-3 row-span-1">
            {images[1] && <Image src={images[1]?.url} alt={images[1]?.name} fill />}
          </div>
          <div className="relative col-span-3 row-span-1">
            {images[2] && <Image src={images[2]?.url} alt={images[2]?.name} fill />}
          </div>
          <div className="relative col-span-3 row-span-1">
            {images[3] && <Image src={images[3]?.url} alt={images[3]?.name} fill />}
          </div>

          <LeaveInquiryButton listingDetail={listingDetail} className="bottom-2 left-2" />
          <PropertyInfoBox listingDetail={listingDetail} className="bottom-2 right-2" />
        </div>
        <div className="flex w-7/12 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-base font-medium">{listingDetail?.title}</div>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Image src={IconLocation} alt="location-icon" width={16} height={16} />
              {listingDetail?.location?.formattedAddress}
            </div>
            <div className="text-neutral-550 text-sm">{listingDetail?.shortDescription}</div>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <label className="font-medium text-[#A80707]">
              <PriceNumberText
                value={locale === 'vi' ? listingDetail?.priceVnd : listingDetail?.priceUsd}
                displayPriceType={listingDetail?.displayPriceType}
              />
            </label>
            <label className="rounded-lg bg-yellow px-2 py-2 text-xs font-semibold text-yellow-200 drop-shadow-md">
              {enumTranslator('ListPropertyStatusEnum.Gold')}
            </label>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardListingGold;
