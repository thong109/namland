import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import type { Metadata } from 'next';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import BigGallery from '../../_components/BigGallery/BigGallery';
import LinkedProject from './_components/LinkedProject';
import ListingDetailedInfo from './_components/ListingDetailedInfo';
import ListingOverview from './_components/ListingOverview';
import { RatingComponent } from './_components/RatingComponent';

const InquiryForm = dynamic(() => import('./_components/InquiryForm'), { ssr: false });

const SimilarListing = dynamic(() => import('./_components/SimilarListing'), { ssr: true });

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
      {(listingDetail?.imageUrls ?? []).slice(0, 4).map((image, index) => (
        <link key={index} rel="preload" href={image.url} as="image" />
      ))}
      <div className="container flex flex-col gap-10 pb-20">
        <BigGallery images={listingDetail?.imageUrls ?? []} />
        <ListingOverview listingDetail={listingDetail} locale={params.locale} />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-col gap-10 lg:w-3/4">
            <ListingDetailedInfo listingDetail={listingDetail} locale={params.locale} />
            <LinkedProject listingDetail={listingDetail} locale={params.locale} />
            <SimilarListing listingDetail={listingDetail} locale={params.locale} />
            <RatingComponent listingDetail={listingDetail} />
          </div>
          <div className="flex-1">
            <InquiryForm listingDetail={listingDetail} locale={params.locale} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PageDetailProperty;
