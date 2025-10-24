import IconLocation from '@/assets/icon/icon-location.svg';
import { getListingUrl } from '@/utils/urlUtil';
import { Carousel } from 'antd';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import PriceNumberText from '../PriceNumberText/PriceNumberText';
import AddToFavoriteButton from './_component/AddToFavoriteButton';
import LeaveInquiryButton from './_component/LeaveInquiryButton';
import PropertyInfoBox from './_component/PropertyInfoBox';

interface ListingCardPlatinumProps {
  className?: string;
  listing: any;
}

const ListingCardPlatinum: React.FC<ListingCardPlatinumProps> = ({ className, listing }) => {
  const locale = useLocale();

  const enumTranslator = useTranslations('enum');

  const listingDetail: any = listing;
  const listingUrl = getListingUrl(listingDetail.id, listingDetail.title);

  return (
    <div
      className={clsx(
        'relative min-h-80 border border-neutral-200 bg-neutral-0 p-2 pt-[15rem]',
        className,
      )}
    >
      <AddToFavoriteButton listingDetail={listing} />
      <div className="absolute left-0 top-2 h-56 w-full overflow-hidden">
        <Carousel
          infinite
          draggable
          slidesPerRow={3}
          autoplay={false}
          dots={{
            className: 'before:[&_li>button]:hidden',
          }}
        >
          {listingDetail?.imageThumbnailUrls?.map((image: any, index: number) => (
            <div key={index} className="relative h-[14rem] overflow-hidden px-2">
              <Image
                src={image.url}
                alt={`image-` + index}
                width={400}
                height={300}
                className="size-full object-cover"
              />
            </div>
          ))}
        </Carousel>
        <LeaveInquiryButton listingDetail={listingDetail} className="bottom-5 left-2" />
        <PropertyInfoBox listingDetail={listingDetail} className="bottom-5 right-2" />
      </div>

      <Link href={listingUrl} className="flex h-full flex-col gap-4 hover:text-[unset]">
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
          <label className="rounded-lg bg-neutral-300 px-2 py-2 text-xs font-semibold drop-shadow-md">
            {enumTranslator('ListPropertyStatusEnum.Platinum')}
          </label>
        </div>
      </Link>
    </div>
  );
};

export default ListingCardPlatinum;
