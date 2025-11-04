import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import type { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import ArticleInformationOverview from '@/components/ArticleInformation/ArticleInformationOverview';
import { ArticleInformationRatings } from '@/components/ArticleInformation/ArticleInformationRatings';
import { assetsImages } from '@/assets/images/package';
import '../style.css';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import ButtonFavorite from '@/components/ButtonFavorite/ButtonFavorite';
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import GalleryPrimary from '@/components/GalleryPrimary/GalleryPrimary';
import SectionContact from '@/components/SectionContact/SectionContact';
import PageSectionNavigation from '@/components/PageSectionNavigation/PageSectionNavigation';
import { getTranslator } from 'next-intl/server';
import ArticleInformationDetails from '@/components/ArticleInformation/ArticleInformationDetails';

const SectionSimilar = dynamic(() => import('@/components/SectionSimilar/SectionSimilarProperty'), { ssr: true });

export interface PagePropertyDetailProps {
  params: any;
  searchParams: { [key: string]: string | string[] | undefined };
}

const getListingDetail = async (id: string, locale: string): Promise<listingPropertyModel> => {
  try {
    const rentCategories = await propertyApiService.getDetailListingLandingPage(id);
    return rentCategories;
  } catch (error) {
    // console.log(error);
  }
};

export async function generateMetadata({
  params,
  searchParams,
}: PagePropertyDetailProps): Promise<Metadata> {
  const lastIndex = params.id.lastIndexOf('-');
  const extractedString = params.id.substring(lastIndex + 1);
  const locale = useLocale();
  const property = await getListingDetail(extractedString, locale);

  try {
    return {
      title: property?.title,
      description: property?.shortDescription,
      openGraph: {
        images: property?.imageThumbnailUrls[0]?.url,
        url: `${window.location.origin}property/${extractedString}`,
        description: `${property?.shortDescription}`,
        type: `website`,
        title: `${property?.title}`,
      },
      robots: 'index, follow',
    };
  } catch (error) { }
}

const PageDetailProperty: FC<PagePropertyDetailProps> = async ({ params, searchParams }) => {
  const lastIndex = params.id.lastIndexOf('-');
  const listingId = params.id.substring(lastIndex + 1);
  const locale = useLocale();
  const t = await getTranslator(locale, 'webLabel');
  const listingDetail = await getListingDetail(listingId, locale);
  if (!listingDetail) {
    notFound();
  }
  return (
    <>
      <Breadcrumb
        additionalClass='breadcrumb-common--style-transparent'
        breadcrumbItems={[
          { path: '/', title: t('EcomMenuBarHome') },
          { path: '/sale-listing/', title: t('EcomCreateAPropertyPageDetailForSale') },
          { path: '', title: listingDetail?.title || '' },
        ]}
        hasBanner={false}
      />
      <div className='section-chitiet'>
        {(listingDetail?.imageUrls ?? []).slice(0, 4).map((image, index) => (
          <link key={index} rel='preload' href={image.url} as='image' />
        ))}
        <GalleryPrimary images={listingDetail?.imageUrls ?? []} />
        <PageSectionNavigation
          items={[
            {
              id: 'overview',
              label: t('EcomPropertyListingApprovePropertyOverview'),
              icon: assetsImages.commonIconNavigation.src,
              iconSize: 'calc(20 / 24 * 100%) auto',
            },
            {
              id: 'details',
              label: t('EcomPropertyListingApprovePropertyDetails'),
              icon: assetsImages.commonIconNavigation02.src,
            },
            {
              id: 'furniture',
              label: t('EcomPropertyListingApprovePropertyInterior'),
              icon: assetsImages.commonIconNavigation03.src,
            },
            {
              id: 'utilities',
              label: t('EcomPropertyListingApprovePropertyFacilities'),
              icon: assetsImages.commonIconNavigation04.src,
            },
            {
              id: 'location',
              label: t('EcomPropertyListingApprovePropertyLocation'),
              icon: assetsImages.commonIconNavigation05.src,
            },
          ]}
          additional={[
            <li key="fav"><ButtonFavorite listingDetail={listingDetail} locale={locale} /></li>,
            <li key="share"><ButtonShare listingDetail={listingDetail} locale={locale} /></li>,
          ]}
        />
        <div className='container'>
          <div className='section-chitiet__wrapper'>
            <ArticleInformationOverview listingDetail={listingDetail} locale={params.locale} />
            <ArticleInformationDetails listingDetail={listingDetail} locale={params.locale} />
          </div>
          <div className='section-chitiet__sidebar'>
            <ArticleInformationRatings listingDetail={listingDetail} locale={params.locale} />
          </div>
        </div>
      </div>
      <SectionSimilar listingDetail={listingDetail} locale={params.locale} />
      <SectionContact />
    </>
  );
};

export default PageDetailProperty;
