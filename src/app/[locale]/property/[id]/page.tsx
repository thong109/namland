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
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import GalleryPrimary from '@/components/GalleryPrimary/GalleryPrimary';
import SectionContact from '@/components/SectionContact/SectionContact';

const InquiryForm = dynamic(() => import('@/components/ArticleInformation/InquiryForm'), { ssr: false });

const SimilarListing = dynamic(() => import('@/components/ArticleInformation/SimilarListing'), { ssr: true });

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
        <div className='navigation-common-chitiet'>
          <div className='container'>
            <ul className='navigation-common-chitiet__wrapper'>
              <li className='navigation-common-chitiet__entry'><a href='#overview'>Tổng quan</a></li>
              <li className='navigation-common-chitiet__entry'><a href='#details'>Chi tiết căn hộ</a></li>
              <li className='navigation-common-chitiet__entry'><a href='#furniture'>Nội thất </a></li>
              <li className='navigation-common-chitiet__entry'><a href='#utilities'>Tiện ích</a></li>
              <li className='navigation-common-chitiet__entry'><a href='#location'>Bản đồ khu vực</a></li>
            </ul>
          </div>
        </div>
        <div className='section-chitiet__wrapper'>
          <div className='container'>
            <ArticleInformationOverview listingDetail={listingDetail} locale={params.locale} />
            <ArticleInformationDetails listingDetail={listingDetail} locale={params.locale} />
            <LinkedProject listingDetail={listingDetail} locale={params.locale} />
            <SimilarListing listingDetail={listingDetail} locale={params.locale} />
            <RatingComponent listingDetail={listingDetail} />
            <div className='flex-1'>
              <InquiryForm listingDetail={listingDetail} locale={params.locale} />
            </div>
          </div>
        </div>
      </div>
      <SectionContact />
    </>
  );
};

export default PageDetailProperty;
