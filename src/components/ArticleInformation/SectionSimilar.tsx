import CardListing from '@/components/CardListing/CardListing';
import {
  postEcomListingGetForSellByQuery,
  postEcomListingGetSimilarInProjectQuery,
} from '@/ecom-sadec-api-client/services.gen';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { getTranslator } from 'next-intl/server';
import React from 'react';

interface SectionSimilarProps {
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

const SectionSimilar: React.FC<SectionSimilarProps> = async ({ listingDetail, locale }) => {
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
      <div>Tin đăng bán khác</div>
      <div className="hidden flex-col gap-4 lg:flex">
        {platinumListing?.data?.data?.map((item) => (
          <CardListing key={item.id} listing={item} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 lg:flex">
        {goldListing?.data?.data?.map((item) => (
          <CardListing key={item.id} listing={item} />
        ))}
      </div>
      <div className="hidden auto-rows-fr grid-cols-3 gap-8 lg:grid">
        {basicListing?.data?.data?.map((item) => (
          <div className="col-span-1">
            <CardListing key={item.id} listing={item} />
          </div>
        ))}
      </div>
      <div className="flex gap-4 overflow-x-auto lg:hidden">
        {(platinumListing?.data?.data ?? [])
          .concat(goldListing?.data?.data ?? [])
          .concat(basicListing?.data?.data ?? [])
          .map((item) => (
            <div key={item.id} className="min-w-80 grow">
              <CardListing listing={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default React.memo(SectionSimilar);
