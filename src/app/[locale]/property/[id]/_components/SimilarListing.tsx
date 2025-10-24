import ListingCard from '@/app/[locale]/_components/ListingCard/ListingCard';
import {
  postEcomListingGetForSellByQuery,
  postEcomListingGetSimilarInProjectQuery,
} from '@/ecom-sadec-api-client/services.gen';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { getTranslator } from 'next-intl/server';
import React from 'react';

interface SimilarListingProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const basedQuery = (listingId: string, projectId: string) => ({
  from: 0,
  size: 2,
  sort: {
    field: 'createdAt',
    sortOrder: 1,
  },
  query: {
    bool: {
      must: [
        {
          term: {
            projectId: projectId,
          },
        },
      ],
      must_not: [
        {
          term: {
            id: listingId,
          },
        },
      ],
    },
  },
});

const SimilarListing: React.FC<SimilarListingProps> = async ({ listingDetail, locale }) => {
  const t = await getTranslator(locale, 'webLabel');

  const platinumListing: any = await postEcomListingGetSimilarInProjectQuery({
    requestBody: {
      ...basedQuery(listingDetail.id, listingDetail.project.id),
      priorityStatus: ListPropertyStatusEnum.Platinum,
    },
    listingId: listingDetail.id,
  });
  const goldListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(listingDetail.id, listingDetail.project.id),
      priorityStatus: ListPropertyStatusEnum.Gold,
    },
  });

  const basicListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(listingDetail.id, listingDetail.project.id),
      size: 3,
      priorityStatus: ListPropertyStatusEnum.Basic,
    },
  });

  return (
    <div className={`flex flex-col gap-2`}>
      <div>
        <h1 className="text-center text-4xl font-bold text-portal-primaryLiving">
          {t('EcomPropertyDetailPageSimilarListingsSimilarListings')}
        </h1>
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
      <div className="hidden auto-rows-fr grid-cols-3 gap-8 lg:grid">
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
            <div key={item.id} className="min-w-80 grow">
              <ListingCard listing={item} variant="basic" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default React.memo(SimilarListing);
