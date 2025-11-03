import CardListing from '@/components/CardListing/CardListing';
import CardListingRent from '@/components/CardListing/CardListingRent';
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
  const basicListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(listingDetail.id, listingDetail.project.id),
      size: 3,
      priorityStatus: ListPropertyStatusEnum.Basic,
    },
  });
  return (
    <div className={`section-common-similar ${listingDetail?.type==1 ? 'section-common-similar--rent' : 'section-common-similar--sale'}`}>
      <div className='container'>
        <div className='section-common-similar__title'>{listingDetail?.type==1 ? `Tin đăng bán khác` : `Tin cho thuê khác`}</div>
        <div className='section-common-similar__wrapper'>
          {basicListing?.data?.data?.map((item) => (
            <div className='section-common-similar__entry'>
              {listingDetail?.type==1 ? <CardListing key={item.id} listing={item} /> : <CardListingRent key={item.id} listing={item} />}
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
