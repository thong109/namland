import CardListing from '@/components/CardListing/CardListing';
import {
  postEcomListingGetForSellByQuery,
  postEcomListingGetSimilarInProjectQuery,
} from '@/ecom-sadec-api-client/services.gen';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { getTranslator } from 'next-intl/server';
import { Pagination } from 'antd';
import React from 'react';
import './SectionSimilar.css'

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
    <div className='section-common-similar'>
      <div className='container'>
        <div className='section-common-similar__title'>Tin đăng bán khác</div>
        <div className='section-common-similar__wrapper'>
          {basicListing?.data?.data?.map((item) => (
            <div className='section-common-similar__entry'>
              <CardListing key={item.id} listing={item} />
            </div>
          ))}
        </div>
        <div className="pagination-common">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SectionSimilar);
