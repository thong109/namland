import IconLocation from '@/assets/icon/icon-location.svg';
import { getListingUrl } from '@/utils/urlUtil';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import PriceNumberText from '../PriceNumberText/PriceNumberText';
import AddToFavoriteButton from './_component/AddToFavoriteButton';
import CardListingProjectInfo from './_component/CardListingProjectInfo';
import CardListingRibbon from './_component/CardListingRibbon';

interface CardListingHomePageProps {
  className?: string;
  listing: any;
}

const CardListingHomePage: React.FC<CardListingHomePageProps> = ({ className, listing }) => {
  const t = useTranslations('webLabel');

  const listingDetail: any = listing;
  const { project } = listing;
  const listingUrl = getListingUrl(listingDetail.id, listingDetail.title);
  return (
    <div className={clsx('relative h-full transition-all ease-linear', className)}>
      <CardListingRibbon className={'left-2'} variant="platinum" />
      <CardListingProjectInfo className={'left-2 top-48'} project={project} />
      <div className="flex h-full flex-col border border-neutral-400 bg-neutral-0">
        <Link href={listingUrl} className="relative p-2 hover:text-[unset]">
          <div className="relative h-56 w-full">
            {listingDetail.imageThumbnailUrls && listingDetail.imageThumbnailUrls.length > 0 && (
              <Image
                src={listingDetail.imageThumbnailUrls[0]?.thumbUrl}
                alt={'image'}
                className="object-cover"
                sizes="200px"
                fill
              />
            )}
          </div>
        </Link>
        <div className="flex flex-col gap-2 border-b p-2">
          <div className="grid grid-cols-12">
            <Link
              href={listingUrl}
              className="col-span-11 !mb-0 line-clamp-1 text-base font-medium hover:text-[unset]"
            >
              {listingDetail?.title}
            </Link>
            <div className="relative col-span-1 flex items-center">
              <AddToFavoriteButton
                listingDetail={listingDetail}
                className="!left-1/2 !top-1/2 size-full !-translate-x-1/2 !-translate-y-1/2 !transform"
              />
            </div>
          </div>
          <Link
            href={listingUrl}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-[unset]"
          >
            <Image src={IconLocation} alt="location-icon" width={16} height={16} />
            <div className="line-clamp-1">{listingDetail?.location?.formattedAddress}</div>
          </Link>
        </div>
        <Link href={listingUrl} className="hover:text-[unset]">
          <div className="grid grid-cols-12 divide-x hover:text-[unset]">
            <label className="col-span-6 flex items-center p-2 pl-2 font-bold">
              <PriceNumberText
                value={listingDetail?.priceVnd}
                displayPriceType={listingDetail?.displayPriceType}
              />
            </label>
            <div className="col-span-2 p-2 text-center">
              <label className="font-bold">{listingDetail.bedrooms}</label>{' '}
              {t('EcomHomePageRecentListingsForSaleBeds')}
            </div>
            <div className="col-span-2 p-2 text-center">
              <label className="font-bold">{listingDetail.bathrooms}</label>{' '}
              {t('EcomHomePageRecentListingsForSaleBaths')}
            </div>
            <div className="col-span-2 p-2 text-center">
              <label className="font-bold">{listingDetail.size}</label> m<sup>2</sup>
            </div>
          </div>
          <div className="bg-portal-primaryButtonAdmin p-4 text-center font-bold text-neutral-0">
            {t('EcomHomePageInquireNow')}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CardListingHomePage;
