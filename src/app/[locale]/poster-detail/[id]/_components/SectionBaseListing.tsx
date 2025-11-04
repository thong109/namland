'use client';
import CardListing from '@/components/CardListing/CardListing';
import { NAVIGATION } from '@/data/navigation';
import { getParamsStringFromObj } from '@/libs/appconst';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
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
            <h1 className="text-center text-2xl md:text-4xl font-bold text-portal-primaryLiving">{title}</h1>
          </div>
          <div className="auto-rows-fr md:grid-cols-3 lg:grid-cols-4 gap-4 grid-col md:grid-flow-row grid">
            {[
              platinumListing?.data?.data ?? [],
              goldListing?.data?.data ?? [],
              basicListing?.data?.data ?? [],
            ]
              .flat()
              .map((item) => (
                <div className="col-span-1" key={item.id}>
                  <CardListing listing={item} />
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
