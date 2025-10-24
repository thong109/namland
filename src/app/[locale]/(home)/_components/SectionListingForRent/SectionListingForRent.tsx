'use server';

import { listingType } from '@/libs/appconst';
import { getTranslator } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { FC } from 'react';

const SectionHomePageListing = dynamic(
  () => import('../SectionHomePageListing/SectionHomePageListing'),
  { ssr: true },
);

export interface SectionListingForRentProps {
  locale: string;
  platinumListing: any;
}

const SectionListingForRent: FC<SectionListingForRentProps> = async ({
  locale,
  platinumListing,
}) => {
  const t = await getTranslator(locale, 'webLabel');

  return (
    <SectionHomePageListing
      type={listingType.rent}
      title={t('EcomHomePagePropertyForRent')}
      platinumListing={platinumListing}
    />
  );
};

export default SectionListingForRent;
