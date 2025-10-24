'use server';

import { postEcomListingGetForRentByQuery } from '@/ecom-sadec-api-client';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import { SaleTypeEnum } from '@/libs/enums/SaleTypeEnum';
import { getTranslator } from 'next-intl/server';
import { FC } from 'react';
import SectionBaseListing from './SectionBaseListing';

export interface SectionListingForRentProps {
  locale: string;
  brokerId: string;
}

const basedQuery = (
  propertyStatus: ListPropertyStatusEnum,
  size: number,
  createdBy: string,
  propertySaleType: SaleTypeEnum,
) => ({
  from: 0,
  size: size,
  sort: {
    field: 'createdAt',
    sortOrder: 1 as 0 | 1,
  },
  query: {
    bool: {
      must: [
        {
          term: {
            priorityStatus: propertyStatus,
          },
        },
        {
          term: {
            'createdBy.keyword': createdBy,
          },
        },
        {
          term: {
            type: propertySaleType,
          },
        },
      ],
    },
  },
});

const SectionListingForRent: FC<SectionListingForRentProps> = async ({ locale, brokerId }) => {
  const t = await getTranslator(locale, 'webLabel');

  const platinumListing: any = await postEcomListingGetForRentByQuery({
    requestBody: {
      ...basedQuery(ListPropertyStatusEnum.Platinum, 2, brokerId, SaleTypeEnum.Rent),
    },
  });
  const goldListing: any = await postEcomListingGetForRentByQuery({
    requestBody: {
      ...basedQuery(ListPropertyStatusEnum.Gold, 2, brokerId, SaleTypeEnum.Rent),
    },
  });

  const basicListing: any = await postEcomListingGetForRentByQuery({
    requestBody: {
      ...basedQuery(ListPropertyStatusEnum.Basic, 3, brokerId, SaleTypeEnum.Rent),
      size: 3,
    },
  });

  return (
    <SectionBaseListing
      title={t('EcomPosterDetailBrokerPagePropertiesForLease')}
      platinumListing={platinumListing}
      goldListing={goldListing}
      basicListing={basicListing}
      brokerId={brokerId}
      sectionType="lease"
    />
  );
};

export default SectionListingForRent;
