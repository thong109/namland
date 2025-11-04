'use client';

import {
  ElasticSearchQuery,
  ListingTypeEnum,
  postEcomListingGetForRentByQuery,
  postEcomListingGetForSellByQuery,
} from '@/ecom-sadec-api-client';
import { listingType } from '@/libs/appconst';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import Banner from '@/models/masterDataModel/bannerModel';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { FC, useEffect, useMemo, useState } from 'react';
import "./SectionHomePageListing.css";

const SectionHomePageListingCarouselClient = dynamic(
  () => import('./SectionHomePageListingCarouselClient'),
  { ssr: false },
);

const basedQuery = (): ElasticSearchQuery => ({
  from: 0,
  size: 12,
  sort: {
    field: 'createdAt',
    sortOrder: 1,
  },
});

export interface SectionHomePageListingProps {
  title: string;
  platinumListing: any;
  aboveBanner?: Banner;
  behindBanner?: Banner;
  type?: ListingTypeEnum;
}

const SectionHomePageListing: FC<SectionHomePageListingProps> = ({
  title,
  platinumListing,
  aboveBanner,
  behindBanner,
  type,
}) => {
  const t = useTranslations();

  const listingFilters = useMemo(
    () => ({
      platinum: {
        value: 'platinum',
        label: t('enum.ListPropertyStatusEnum.Platinum'),
      },
      new: {
        value: 'new',
        label: t('webLabel.new'),
      },
      popular: {
        value: 'popular',
        label: t('webLabel.popular'),
      },
    }),
    [t],
  );

  const queryService = useMemo(
    () =>
      type === listingType.sale
        ? postEcomListingGetForSellByQuery
        : postEcomListingGetForRentByQuery,
    [type],
  );

  const [delayedRenderCarousel, setDelayedRenderCarousel] = useState<boolean>(false);
  const [listingState, setListingState] = useState<any>(platinumListing);
  const [selectedFilter, setSelectedFilter] = useState<string>(listingFilters.platinum.value);
  const [isFilterChanged, setIsFilterChanged] = useState<boolean>(false);

  useEffect(() => {
    setDelayedRenderCarousel(true);
  }, []);

  useEffect(() => {
    if (delayedRenderCarousel && document) {
      setTimeout(() => {
        const elements = document.querySelectorAll('.homepage-listing-to-hide');
        elements.forEach((element) => {
          (element as any).style.display = 'none';
        });
      }, 600);
    }
  }, [delayedRenderCarousel]);

  const requestDataBody: ElasticSearchQuery = useMemo(() => {
    const requestBody = {
      ...basedQuery(),
    };

    if (selectedFilter === listingFilters.new.value) {
      requestBody.sort = {
        field: 'createdAt',
        sortOrder: 1,
      };
    } else if (selectedFilter === listingFilters.popular.value) {
      requestBody.sort = {
        field: 'listingStatistic.totalViews',
        sortOrder: 1,
      };
    } else {
      requestBody.query = {
        bool: {
          must: [
            {
              term: {
                priorityStatus: ListPropertyStatusEnum.Platinum,
              },
            },
          ],
        },
      };
      return requestBody;
    }

    return requestBody;
  }, [selectedFilter]);

  const { isLoading } = useQuery({
    queryKey: ['homepage-listing', setListingState, queryService, requestDataBody, selectedFilter],
    queryFn: async () => {
      const data = await queryService({
        requestBody: requestDataBody,
      });
      setListingState(data);
      return data;
    },
    enabled: isFilterChanged,
  });
  return (
    <div className='container'>
      <div className="listing_container relative">
        <div className='listing_viewport'>
          <p className="mb-1 text-xl md:text-[30px] font-semibold text-black leading-1">
            {title}
          </p>

          <div className="w-full overflow-visible">
            {delayedRenderCarousel && (
              <SectionHomePageListingCarouselClient
                isLoading={isLoading}
                listingState={listingState}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHomePageListing;
