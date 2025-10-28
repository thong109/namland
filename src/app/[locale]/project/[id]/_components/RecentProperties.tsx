import ListingCard from '@/components/ListingCard/ListingCard';
import { NAVIGATION } from '@/data/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface SimilarListingProps {
  locale: string;
  title: string;
  platinumListing: any;
  goldListing: any;
  basicListing: any;
  type: 'sale' | 'lease';
}

const RecentProperties: React.FC<SimilarListingProps> = ({
  title,
  basicListing,
  goldListing,
  platinumListing,
  type,
}) => {
  const t = useTranslations();

  return (
    <div className={`flex flex-col gap-4`}>
      <div>
        <h1 className="text-center text-4xl font-bold text-portal-primaryLiving">{title}</h1>
      </div>
      {platinumListing?.data?.data.length > 0 && (
        <div className="hidden flex-col gap-4 lg:flex">
          {platinumListing?.data?.data?.map((item) => (
            <ListingCard key={item.id} listing={item} variant="platinum" />
          ))}
        </div>
      )}
      {goldListing?.data?.data?.length > 0 && (
        <div className="hidden flex-col gap-4 lg:flex">
          {goldListing?.data?.data?.map((item) => (
            <ListingCard key={item.id} listing={item} variant="gold" />
          ))}
        </div>
      )}
      {basicListing?.data?.data.length > 0 && (
        <div className="hidden auto-rows-fr grid-cols-3 gap-4 lg:grid">
          {basicListing?.data?.data?.map((item) => (
            <div className="col-span-1">
              <ListingCard key={item.id} listing={item} variant="basic" />
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto lg:hidden">
        {(platinumListing?.data?.data ?? [])
          .concat(goldListing?.data?.data ?? [])
          .concat(basicListing?.data?.data ?? [])
          .map((item) => (
            <div key={item.id} className="min-w-60 grow">
              <ListingCard listing={item} variant="basic" />
            </div>
          ))}
      </div>

      <div className="flex justify-center text-portal-primaryLiving">
        <Link href={type === 'lease' ? NAVIGATION.rentListing.href : NAVIGATION.saleListing.href}>
          {t('Common.ShowMore')}
        </Link>
      </div>
    </div>
  );
};

export default React.memo(RecentProperties);
