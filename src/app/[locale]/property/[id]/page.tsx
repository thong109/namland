import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import type { Metadata } from 'next';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import LinkedProject from '@/components/ArticleInformation/LinkedProject';
import ArticleInformationDetails from '@/components/ArticleInformation/ArticleInformationDetails';
import ArticleInformationOverview from '@/components/ArticleInformation/ArticleInformationOverview';
import { RatingComponent } from '@/components/ArticleInformation/RatingComponent';
import { assetsImages } from '@/assets/images/package';
import '../style.css';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import GalleryPrimary from '@/components/GalleryPrimary/GalleryPrimary';
import SectionContact from '@/components/SectionContact/SectionContact';

const InquiryForm = dynamic(() => import('@/components/ArticleInformation/InquiryForm'), { ssr: false });

const SectionSimilar = dynamic(() => import('@/components/ArticleInformation/SectionSimilar'), { ssr: true });

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
  } catch (error) {}
}

const PageDetailProperty: FC<PagePropertyDetailProps> = async ({ params, searchParams }) => {
  const lastIndex = params.id.lastIndexOf('-');
  const listingId = params.id.substring(lastIndex + 1);
  const locale = useLocale();
  const listingDetail = await getListingDetail(listingId, locale);
  if (!listingDetail) {
    notFound();
  }
  return (
    <>
      <Breadcrumb
        additionalClass='breadcrumb-common--style-transparent'
        breadcrumbItems={[
          { path: '/', title: 'Trang chủ' },
          { path: '/sale-listing/', title: 'Bán' },
          { path: '', title: 'Khu đô thị mới Khu đô thị Nam Long' },
        ]}
        hasBanner={false}
      />
      <div className='section-chitiet'>
        {(listingDetail?.imageUrls ?? []).slice(0, 4).map((image, index) => (
          <link key={index} rel='preload' href={image.url} as='image' />
        ))}
        <GalleryPrimary images={listingDetail?.imageUrls ?? []} />
        <div className='navigation-common-page'>
          <div className='container'>
            <ul className='navigation-common-page__wrapper'>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#overview'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation.src})`, backgroundSize: `calc(20 / 24 * 100%) auto` }}></span>Tổng quan</a>
              </li>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#details'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation02.src})`, backgroundSize: `calc(24 / 24 * 100%) auto` }}></span>Chi tiết căn hộ</a>
              </li>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#furniture'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation03.src})`, backgroundSize: `calc(24 / 24 * 100%) auto` }}></span>Nội thất </a>
              </li>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#utilities'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation04.src})`, backgroundSize: `calc(24 / 24 * 100%) auto` }}></span>Tiện ích</a>
              </li>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#location'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation05.src})`, backgroundSize: `calc(18 / 24 * 100%) auto` }}></span>Bản đồ khu vực</a>
              </li>
            </ul>
            <ul className='navigation-common-page__additional'>
              <li className='navigation-common-page__additional-entry'></li>
              <li className='navigation-common-page__additional-entry'></li>
            </ul>
          </div>
        </div>
        <div className='container'>
          <div className='section-chitiet__wrapper'>
            <ArticleInformationOverview listingDetail={listingDetail} locale={params.locale} />
            <ArticleInformationDetails listingDetail={listingDetail} locale={params.locale} />
          </div>
          <div className='section-chitiet__sidebar'>
            <LinkedProject listingDetail={listingDetail} locale={params.locale} />
            <RatingComponent listingDetail={listingDetail} />
          </div>
        </div>
      </div>
      <SectionSimilar listingDetail={listingDetail} locale={params.locale} />
      <SectionContact />
    </>
  );
};

export default PageDetailProperty;
