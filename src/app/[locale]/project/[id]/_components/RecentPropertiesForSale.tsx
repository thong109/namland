import { postEcomListingGetForSellByQuery } from '@/ecom-sadec-api-client/services.gen';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { getTranslator } from 'next-intl/server';
import React from 'react';
import RecentProperties from './RecentProperties';

interface RecentPropertiesForSaleProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const basedQuery = (projectId: string) => ({
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
    },
  },
});

const RecentPropertiesForSale: React.FC<RecentPropertiesForSaleProps> = async ({
  projectDetail,
  locale,
}) => {
  const t = await getTranslator(locale, 'webLabel');

  const platinumListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(projectDetail.id),
      priorityStatus: ListPropertyStatusEnum.Platinum,
    },
  });
  const goldListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(projectDetail.id),
      priorityStatus: ListPropertyStatusEnum.Gold,
    },
  });

  const basicListing: any = await postEcomListingGetForSellByQuery({
    requestBody: {
      ...basedQuery(projectDetail.id),
      size: 3,
      priorityStatus: ListPropertyStatusEnum.Basic,
    },
  });
  const totalListing =
    (platinumListing?.data?.data?.length ?? 0) +
    (goldListing?.data?.data?.length ?? 0) +
    (basicListing?.data?.data?.length ?? 0);
  return (
    <>
      {totalListing > 0 ? (
        <RecentProperties
          title={t('EcomProjectDetailPropertiesForSale')}
          locale={locale}
          basicListing={basicListing}
          goldListing={goldListing}
          platinumListing={platinumListing}
          type="sale"
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default React.memo(RecentPropertiesForSale);
