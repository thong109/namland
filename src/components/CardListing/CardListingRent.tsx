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
import CardListingRibbon from './_component/CardListingRibbon';

interface CardListingRentProps {
  className?: string;
  listing: any;
}

const CardListingRent: React.FC<CardListingRentProps> = ({ className, listing }) => {
  const t = useTranslations('webLabel');
  const listingDetail: any = listing;
  const listingUrl = getListingUrl(listingDetail.id, listingDetail.title);
  
  return (
    <Link className={clsx('card-common-listing card-common-listing--rent group', className)} href={listingUrl}>
      <div className='card-common-listing__visual'>
        <CardListingRibbon variant='sale' />
        <div className='card-common-listing__visual-wrapper'>
          <Image src={listingDetail?.imageThumbnailUrl} className='group-hover:scale-[1.3] transition-transform duration-[3s] ease-in-out' width={415} height={271} alt={'Image'} />
        </div>
      </div>
      <div className='card-common-listing__wrapper'>
        <div className='card-common-listing__inner'>
          <div className='card-common-listing__price'>
            <span className='card-common-listing__price-main'>12,32 triệu/tháng</span>
            <span className='card-common-listing__price-original'>17,07 triệu/tháng</span>
          </div>
          <ul className='list-common-properties'>
            <li className='list-common-properties__item'>
              <span className='list-common-properties__item-icon list-common-properties__item-icon--bedroom'></span>
              <span className='list-common-properties__item-label'>{listingDetail?.bedrooms}</span>
            </li>
            <li className='list-common-properties__item'>
              <span className='list-common-properties__item-icon list-common-properties__item-icon--bathroom'></span>
              <span className='list-common-properties__item-label'>{listingDetail?.bathrooms}</span>
            </li>
            <li className='list-common-properties__item'>
              <span className='list-common-properties__item-icon list-common-properties__item-icon--area'></span>
              <span className='list-common-properties__item-label'>{listingDetail?.size} m²</span>
            </li>
          </ul>
          <div className='card-common-listing__detail line-clamp-2'>{listingDetail?.shortDescription}</div>
        </div>
      </div>
    </Link>
  );
};

export default CardListingRent;
