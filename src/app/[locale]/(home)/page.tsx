import logoHT from '@/assets/icon/logo-domdom.svg';
import {
  getEcomAdBannerGetAdBannerByPosition,
  postEcomListingGetForRentByQuery,
  postEcomListingGetForSellByQuery,
} from '@/ecom-sadec-api-client';
import { AdBannerPositionEnum } from '@/libs/enums/AdBannerPositionEnum';
import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import Banner from '@/models/masterDataModel/bannerModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import { createTranslator } from 'next-intl';
import { getMessages } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import EntrustAgent from '../find-agent/_components/EntrustAgent';
import MiddleBanner from './_components/MiddleBanner/MiddleBanner';
import SectionHero from './_components/SectionHero/SectionHero';
import SectionListingForRent from './_components/SectionListingForRent/SectionListingForRent';
import SectionListingForSale from './_components/SectionListingForSale/SectionListingForSale';
import TopBanner from './_components/TopBanner/TopBanner';
import SectionContact from '@/components/SectionContact/SectionContact';

const SectionExploreProjects = dynamic(
  () => import('./_components/SectionExploreProjects/SectionExploreProjects'),
  { ssr: true },
);

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t('LocaleLayout.title'),
    icons: [{ rel: 'icon ', url: logoHT.src }],
    description: t('LocaleLayout.description'),
    robots: 'index, follow',
  };
}

const basedQuery = (propertyStatus: ListPropertyStatusEnum) => ({
  from: 0,
  size: 10,
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
      ],
    },
  },
});

const PageHome: FC<Props> = async ({ params: { locale } }) => {
  const aboveSaleBanner = (
    (await getEcomAdBannerGetAdBannerByPosition({
      position: AdBannerPositionEnum.AboveSale,
    })) as ApiResponseModel<Banner>
  )?.data;

  const salePlatinumListing: any = await postEcomListingGetForSellByQuery({
    requestBody: { ...basedQuery(ListPropertyStatusEnum.Platinum) },
  });

  const rentPlatinumListing: any = await postEcomListingGetForRentByQuery({
    requestBody: { ...basedQuery(ListPropertyStatusEnum.Platinum) },
  });

  return (
    <main className="nc-PageHome relative flex flex-col gap-16 pb-0">
      <SectionHero locale={locale} />
      <TopBanner initAboveSaleBanner={aboveSaleBanner} />
      <SectionListingForSale locale={locale} platinumListing={salePlatinumListing} />
      <SectionListingForRent locale={locale} platinumListing={rentPlatinumListing} />
      <MiddleBanner />
      <div className="container">
        <EntrustAgent />
      </div>
      <SectionExploreProjects locale={locale} />
      <SectionContact />
    </main>
  );
};

export default PageHome;
