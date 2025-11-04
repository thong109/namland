import { postEcomListingGetForSellByQuery } from '@/ecom-sadec-api-client/services.gen';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import SectionSimilarPropertyClient from './SectionSimilarPropertyClient';
import "./SectionSimilar.css";

interface SectionSimilarProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const basedQuery = (listingId: string, projectId: string, from: number, size: number) => ({
  from,
  size,
  sort: { field: 'createdAt', sortOrder: 1 },
  query: {
    bool: {
      must: [{ term: { projectId } }],
      must_not: [{ term: { id: listingId } }],
    },
  },
});

export default async function SectionSimilar({ listingDetail, locale }: SectionSimilarProps) {
  const size = 4;
  const res: any = await postEcomListingGetForSellByQuery({
    requestBody: basedQuery(listingDetail.id, listingDetail.project.id, 0, size),
  });

  const Client: any = SectionSimilarPropertyClient;

  return (
    <Client
      listingDetail={listingDetail}
      initialData={res?.data?.data ?? []}
      total={res?.data?.total ?? 0}
      pageSize={size}
      locale={locale}
    />
  );
}
