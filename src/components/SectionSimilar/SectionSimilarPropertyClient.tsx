'use client';

import { useState, useEffect } from 'react';
import { Pagination, Spin } from 'antd';
import { postEcomListingGetForSellByQuery } from '@/ecom-sadec-api-client/services.gen';
import CardListing from '@/components/CardListing/CardListing';
import CardListingRent from '@/components/CardListing/CardListingRent';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';

export default function SectionSimilarPropertyClient({ listingDetail, locale }) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ from: 0, size: listingDetail?.type == 1 ? 3 : 4, total: 0 });
  const [loading, setLoading] = useState(false);

  const t = useTranslations('webLabel');

  const fetchData = async (from = 0) => {
    setLoading(true);
    try {
      const res = await postEcomListingGetForSellByQuery({
        requestBody: {
          from,
          size: pagination.size,
          sort: { field: 'createdAt', sortOrder: 1 },
          query: {
            bool: {
              must: [{ term: { projectId: listingDetail.project.id } }],
              must_not: [{ term: { id: listingDetail.id } }],
            },
          },
        },
      }) as ApiResponseModel<PageResultModel<listingPropertyModel>>;

      setData(res?.data?.data ?? []);
      setPagination({
        from: res?.data?.from ?? 0,
        size: res?.data?.size ?? listingDetail?.type == 1 ? 3 : 4,
        total: res?.data?.total ?? 0,
      });
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={`section-common-similar ${listingDetail?.type == 1 ? 'section-common-similar--sale' : 'section-common-similar--rent'}`}>
        <div className="container">
          <div className='section-common-similar__title'>{listingDetail?.type == 1 ? t('EcomCreateAPropertyPageDetailForSaleOther') : t('EcomCreateAPropertyPageDetailForRentOther')}</div>
          <div className="section-common-similar__wrapper relative">
            {data.map((item) => (
              <div className="section-common-similar__entry" key={item.id}>
                {listingDetail.type === 1 ? (
                  <CardListing listing={item} />
                ) : (
                  <CardListingRent listing={item} />
                )}
              </div>
            ))}
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/30 rounded-lg">
                <Spin />
              </div>
            )}
          </div>

          {pagination.total > pagination.size && (
            <div className="pagination-common">
              <Pagination
                current={Math.floor(pagination.from / pagination.size) + 1}
                pageSize={pagination.size}
                total={pagination.total}
                showSizeChanger={false}
                onChange={(page) => fetchData((page - 1) * pagination.size)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
