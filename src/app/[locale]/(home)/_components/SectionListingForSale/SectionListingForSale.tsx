'use server';

import { listingType } from '@/libs/appconst';
import { getTranslator } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { FC } from 'react';

const SectionHomePageListing = dynamic(
  () => import('../SectionHomePageListing/SectionHomePageListing'),
  { ssr: true },
);

export interface SectionListingForSaleProps {
  platinumListing: any;
  locale: string;
}

const SectionListingForSale: FC<SectionListingForSaleProps> = async ({
  locale,
  platinumListing,
}) => {
  const t = await getTranslator(locale, 'webLabel');

  return (
    <SectionHomePageListing
      type={listingType.sale}
      title={t('EcomHomePagePropertyForSale')}
      platinumListing={platinumListing}
    />
  );
};

export default SectionListingForSale;
