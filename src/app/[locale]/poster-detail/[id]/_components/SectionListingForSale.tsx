'use server';

import { postEcomListingGetForSellByQuery } from '@/ecom-sadec-api-client';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import { SaleTypeEnum } from '@/libs/enums/SaleTypeEnum';
import { getTranslator } from 'next-intl/server';
import { FC } from 'react';
import SectionBaseListing from './SectionBaseListing';

export interface SectionListingForSaleProps {
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

const SectionListingForSale: FC<SectionListingForSaleProps> = async ({ locale, brokerId }) => {
  const t = await getTranslator(locale, 'webLabel');

  const platinumListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(ListPropertyStatusEnum.Platinum, 2, brokerId, SaleTypeEnum.Sale),
    },
  });
  const goldListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(ListPropertyStatusEnum.Gold, 2, brokerId, SaleTypeEnum.Sale),
    },
  });

  const basicListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(ListPropertyStatusEnum.Basic, 3, brokerId, SaleTypeEnum.Sale),
      size: 3,
    },
  });
  return (
    <SectionBaseListing
      title={t('EcomPosterDetailBrokerPagePropertiesForSale')}
      platinumListing={platinumListing}
      goldListing={goldListing}
      basicListing={basicListing}
      brokerId={brokerId}
      sectionType="sale"
    />
  );
};

export default SectionListingForSale;
