"use client";
import { getListingUrl } from '@/utils/urlUtil';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import ButtonCore from '../ButtonCore/ButtonCore';
import { formatNumber } from '@/libs/helper';

interface CardListingBasicProps {
  className?: string;
  listing: any;
}

const CardListingBasic: React.FC<CardListingBasicProps> = ({ className, listing }) => {
  const t = useTranslations('webLabel');
  const listingDetail: any = listing;
  const listingUrl = getListingUrl(listingDetail.id, listingDetail.title);

  return (
    <Link className={clsx('card-common-listing group', className)} href={listingUrl}>
      <div className='card-common-listing__visual'>
        <span className='card-common-listing__visual-status'>{t('EcomPropertyListingDetailPageLocationStatus')}</span>
        <div className='card-common-listing__visual-wrapper'>
          <Image src={listingDetail?.imageThumbnailUrl} className='group-hover:scale-105' width={415} height={271} alt={'Image'} />
        </div>
      </div>
      <div className='card-common-listing__wrapper'>
        <div>
          <span className='card-common-listing__title'>{listingDetail?.title}</span>
          <ul className='card-common-listing__info'>
            <li className='card-common-listing__info-entry'>
              <span className='card-common-listing__entry-label'>{t('EcomPropertyListingDetailPageLocationLocation')}</span>
              <div className='card-common-listing__entry-detail'>{listingDetail?.location?.address}</div>
            </li>
            <li className='card-common-listing__info-entry'>
              <span className='card-common-listing__entry-label'>{t('EcomPropertyListingDetailPageLocationPrice')}</span>
              <div className='card-common-listing__entry-detail'>{formatNumber(listingDetail?.priceVnd)}</div>
            </li>
          </ul>
        </div>
        <div className='card-common-listing__controller'>
          <ButtonCore preset='more' label={t('EcomPropertyListingDetailPageLocationDetail')} />
        </div>
      </div>
    </Link>
    // <div className={clsx('relative h-full transition-all ease-linear', className)}>
    //   <CardListingProjectInfo className={'left-0 top-44'} project={project} />
    //   <div className="flex h-full flex-col border border-neutral-400 bg-neutral-0">
    //     <div className="relative h-56 w-full overflow-hidden hover:text-[unset]">
    //       <div className="relative h-56 w-full">
    //         {listingDetail.imageThumbnailUrls && (
    //           <Link href={listingUrl}>
    //             <Image
    //               src={listingDetail.imageThumbnailUrls[0]?.thumbUrl}
    //               alt={'image'}
    //               className="size-full object-cover"
    //               width={200}
    //               height={120}
    //             />{' '}
    //           </Link>
    //         )}
    //       </div>
    //     </div>
    //     <div className="flex flex-col gap-2 border-b p-2">
    //       <div className="grid grid-cols-12">
    //         <Link
    //           href={listingUrl}
    //           className="col-span-11 !mb-0 line-clamp-1 text-base font-medium hover:text-[unset]"
    //         >
    //           {listingDetail?.title}
    //         </Link>
    //         <div className="relative col-span-1 flex items-center">
    //           <AddToFavoriteButton
    //             listingDetail={listingDetail}
    //             className="!left-1/2 !top-1/2 size-full !-translate-x-1/2 !-translate-y-1/2 !transform"
    //           />
    //         </div>
    //       </div>
    //       <Link
    //         href={listingUrl}
    //         className="flex items-center gap-1 text-xs text-neutral-500 hover:text-[unset]"
    //       >
    //         <Image src={IconLocation} alt="location-icon" width={16} height={16} />
    //         <div className="line-clamp-1">{listingDetail?.location?.formattedAddress}</div>
    //       </Link>
    //     </div>
    //     <Link href={listingUrl} className="hover:text-[unset]">
    //       <div className="grid grid-cols-12 divide-x hover:text-[unset]">
    //         <label className="col-span-6 flex items-center p-2 pl-2 font-bold">
    //           <PriceNumberText
    //             value={listingDetail?.priceVnd}
    //             displayPriceType={listingDetail?.displayPriceType}
    //           />
    //         </label>
    //         <div className="col-span-2 flex flex-col flex-wrap items-center justify-center py-2">
    //           <label className="mr-1 font-bold">{listingDetail.bedrooms}</label>
    //           {t('EcomHomePageRecentListingsForSaleBeds')}
    //         </div>
    //         <div className="col-span-2 flex flex-col flex-wrap items-center justify-center py-2">
    //           <label className="mr-1 font-bold">{listingDetail.bathrooms}</label>
    //           {t('EcomHomePageRecentListingsForSaleBaths')}
    //         </div>
    //         <div className="col-span-2 flex flex-col flex-wrap items-center justify-center py-2">
    //           <label className="mr-1 font-bold">{listingDetail.size}</label>
    //           <label>
    //             m<sup>2</sup>
    //           </label>
    //         </div>
    //       </div>
    //       <div className="bg-portal-primaryButtonAdmin p-4 text-center font-bold text-neutral-0">
    //         {t('EcomHomePageInquireNow')}
    //       </div>
    //     </Link>
    //   </div>
    // </div>
  );
};

export default CardListingBasic;
