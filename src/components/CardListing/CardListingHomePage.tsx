import { getListingUrl } from '@/utils/urlUtil';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import ButtonCore from '../ButtonCore/ButtonCore';
import "./CardListing.css"
import { formatNumber } from '@/libs/helper';
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
    <Link href={listingUrl} className={clsx('card-common-listing card-common-listing--homepage group', className)}>
      <div className='card-common-listing__visual'>
        {listingDetail.type === 1 && (<CardListingRibbon variant="new" />)}
        <div className='card-common-listing__visual-wrapper'>
          <Image src={listingDetail?.imageThumbnailUrl} className='group-hover:scale-105' width={415} height={271} alt={'Image'} />
        </div>
      </div>
      <div className='card-common-listing__wrapper'>
        <div className='card-common-listing__inner'>
          <span className='card-common-listing__title line-clamp-2'>{listingDetail?.title}</span>
          <ul className='card-common-listing__info'>
            <li className='card-common-listing__info-entry'>
              <span className='card-common-listing__entry-label'>{t('EcomPropertyListingDetailPageLocationLocation')}</span>
              <div className='card-common-listing__entry-detail line-clamp-3'>{listingDetail?.location?.address}</div>
            </li>
            <li className='card-common-listing__info-entry'>
              {listingDetail.type === 1 ? (
                <>
                  <span className='card-common-listing__entry-label'>{t('EcomPropertyListingDetailPageLocationPrice')}</span>
                  <div className='card-common-listing__entry-detail'>{formatNumber(listingDetail?.priceVnd)}</div>
                </>
              ) : (
                <>
                  <span className='card-common-listing__entry-label'>{t('EcomPropertyListingDetailPageLocationRent')}</span>
                  <div className='card-common-listing__entry-detail'>{formatNumber(listingDetail?.priceVnd)} {t('/mo')}</div>
                </>
              )}
            </li>
            <li className='card-common-listing__info-entry'>
              <span className='card-common-listing__entry-label'>{t('EcomPropertyListingDetailPageLocationType')}</span>
              <div className='card-common-listing__entry-detail'>{listingDetail?.listingCategory?.name ?? 'ー'}</div>
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

export default CardListingHomePage;
