import IconLocation from '@/assets/icon/icon-location.svg';
import { getListingUrl } from '@/utils/urlUtil';
import clsx from 'clsx';
import { useLocale } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import PriceNumberText from '../PriceNumberText/PriceNumberText';
import AddToFavoriteButton from './_component/AddToFavoriteButton';
import PropertyInfoBox from './_component/PropertyInfoBox';

interface ListingCardBasicProps {
  className?: string;
  listing: any;
}

const ListingCardBasic: React.FC<ListingCardBasicProps> = ({ className, listing }) => {
  const locale = useLocale();

  const listingDetail: any = listing;

  const listingUrl = getListingUrl(listingDetail.id, listingDetail.title);
  return (
    <div className={clsx('relative h-full transition-all ease-linear hover:scale-105', className)}>
      <AddToFavoriteButton listingDetail={listing} />

      <Link
        href={listingUrl}
        className="flex h-full flex-col gap-4 border border-neutral-200 bg-neutral-0 p-2 hover:text-[unset]"
      >
        <div className="relative">
          <div className="relative h-52 w-full">
            {listingDetail.imageThumbnailUrls && (
              <Image src={listingDetail.imageThumbnailUrls[0]?.url} alt={'image'} fill />
            )}
          </div>

          <PropertyInfoBox listingDetail={listingDetail} className="bottom-2 right-2" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="!mb-0 line-clamp-2 text-base font-medium">{listingDetail?.title}</div>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Image src={IconLocation} alt="location-icon" width={16} height={16} />
            {listingDetail?.location?.formattedAddress}
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <label className="font-medium text-[#A80707]">
            <PriceNumberText
              value={locale === 'vi' ? listingDetail?.priceVnd : listingDetail?.priceUsd}
              displayPriceType={listingDetail?.displayPriceType}
            />
          </label>
        </div>
      </Link>
    </div>
  );
};

export default ListingCardBasic;
