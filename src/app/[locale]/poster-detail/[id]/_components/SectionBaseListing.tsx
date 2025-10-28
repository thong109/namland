'use client';
import ListingCard from '@/components/ListingCard/ListingCard';
import { NAVIGATION } from '@/data/navigation';
import { getParamsStringFromObj } from '@/libs/appconst';
import clsx from 'clsx';
import { Link, useTranslations } from 'next-intl';
import { FC, useMemo } from 'react';

type SectionType = 'sale' | 'lease';

export interface SectionBaseListingProps {
  title: string;
  platinumListing: any;
  goldListing: any;
  basicListing: any;
  sectionType: SectionType;

  brokerId: string;
}

const SectionBaseListing: FC<SectionBaseListingProps> = ({
  title,
  platinumListing,
  goldListing,
  basicListing,
  sectionType,
  brokerId,
}) => {
  const t = useTranslations();

  const showMoreLink = useMemo(() => {
    let result = '';
    const paramsString = getParamsStringFromObj({
      pb: brokerId,
    });

    switch (sectionType) {
      case 'sale':
        result = NAVIGATION.saleListing.href + '?' + paramsString;
        break;
      case 'lease':
        result = NAVIGATION.rentListing.href + '?' + paramsString;
        break;
    }
    return result;
  }, [sectionType]);

  return (
    <>
      <div className={`relative flex flex-col gap-2 lg:flex-row`}>
        <div className={clsx('flex flex-col gap-4 lg:mx-auto lg:w-full')}>
          <div>
            <h1 className="text-center text-4xl font-bold text-portal-primaryLiving">{title}</h1>
          </div>
          <div className="hidden flex-col gap-4 lg:flex">
            {platinumListing?.data?.data?.map((item) => (
              <ListingCard key={item.id} listing={item} variant="platinum" />
            ))}
          </div>
          <div className="hidden flex-col gap-4 lg:flex">
            {goldListing?.data?.data?.map((item) => (
              <ListingCard key={item.id} listing={item} variant="gold" />
            ))}
          </div>
          <div className="hidden auto-rows-fr grid-cols-3 gap-4 lg:grid">
            {basicListing?.data?.data?.map((item) => (
              <div className="col-span-1">
                <ListingCard key={item.id} listing={item} variant="basic" />
              </div>
            ))}
          </div>
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

          {/* TODO: where to go? */}
          <Link
            href={showMoreLink}
            className="mb-4 cursor-pointer self-center text-portal-primaryLiving underline"
          >
            {t('Common.ShowMore')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default SectionBaseListing;
