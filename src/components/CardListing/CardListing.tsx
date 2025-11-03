'use client';

import { getListingUrl } from '@/utils/urlUtil';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import { formatNumber } from '@/libs/helper';
import './CardListing.css';

interface CardListingProps {
  className?: string;
  listing: any;
}

const CardListing: React.FC<CardListingProps> = ({ className, listing }) => {
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
  );
};

export default CardListing;
