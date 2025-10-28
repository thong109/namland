'use client';

import CardListingHomePage from '@/components/CardListing/CardListing.HomePage';
import SelectorChip from '@/components/SelectorChip/SelectorChip';
import { NAVIGATION } from '@/data/navigation';
import {
  ElasticSearchQuery,
  ListingTypeEnum,
  postEcomListingGetForRentByQuery,
  postEcomListingGetForSellByQuery,
} from '@/ecom-sadec-api-client';
import { listingType } from '@/libs/appconst';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import Banner from '@/models/masterDataModel/bannerModel';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC, useEffect, useMemo, useState } from 'react';

const SectionHomePageListingCarouselClient = dynamic(
  () => import('./SectionHomePageListingCarouselClient'),
  { ssr: false },
);

const basedQuery = (): ElasticSearchQuery => ({
  from: 0,
  size: 10,
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
    <div>
      {aboveBanner?.attachments?.length > 0 && (
        <div className="container hidden lg:block">
          <Image
            src={aboveBanner.attachments[0].bannerImageUrl}
            alt={aboveBanner.attachments[0].bannerName}
            width={2440}
            height={1920}
          />
        </div>
      )}
      <div className="container relative flex flex-col gap-6 lg:flex-row">
        <div
          className={clsx(
            'flex flex-col gap-4 lg:w-3/4',
            !behindBanner || !behindBanner.attachments || behindBanner.attachments.length <= 0
              ? 'lg:w-full'
              : 'lg:w-3/4',
          )}
        >
          <div className="rever grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-0">
            <div className="order-2 col-span-1 flex items-center justify-start lg:order-1">
              <div className="overflow-x-auto">
                <SelectorChip
                  className={clsx(
                    '[&_button.chip-button-selected]:text-pmh-text',
                    '[&_button.chip-button-selected]:!border-portal-primaryButtonAdmin',
                    '[&_button.chip-button]:border-pmh-text',
                  )}
                  options={Object.keys(listingFilters).map((x) => ({
                    id: listingFilters[x].value,
                    name: listingFilters[x].label,
                  }))}
                  value={selectedFilter}
                  onChange={(value) => {
                    setSelectedFilter(value);
                    setIsFilterChanged(true);
                  }}
                />
              </div>
            </div>
            <div className="order-1 col-span-1 grid grid-cols-2 lg:order-2 lg:col-span-2">
              <div className="flex items-end justify-start lg:items-center lg:justify-center">
                <h1 className="text-3xl font-bold">{title}</h1>
              </div>
              <div className="flex items-end justify-end lg:items-center">
                <Link
                  href={`${
                    type === listingType.sale
                      ? NAVIGATION.saleListing.href
                      : NAVIGATION.rentListing.href
                  }`}
                  className="flex flex-row flex-nowrap items-center gap-4"
                >
                  <div className="cursor-pointer whitespace-nowrap text-green underline underline-offset-4 lg:uppercase lg:text-pmh-text lg:no-underline">
                    {t('Common.ShowMore')}
                  </div>
                  <div className="hidden size-10 lg:inline-block">
                    <ArrowRightCircleIcon className="size-full" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="h-[422px] w-full overflow-x-hidden overflow-y-hidden">
            <div className="homepage-listing-to-hide flex h-[422px] w-full flex-row overflow-x-auto overflow-y-hidden">
              {platinumListing?.data?.data?.map((item) => (
                <div key={item.id} className="h-full shrink-0 grow basis-1/4">
                  <CardListingHomePage listing={item} className="px-2" />
                </div>
              ))}
            </div>
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
