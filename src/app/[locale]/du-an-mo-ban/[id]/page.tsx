import newHomeApiService from '@/apiServices/externalApiServices/apiNewHomeService';
import { NewHomeLandingPageModel } from '@/models/newHomeModel/newHomeModelLandingPage';
import { getTranslator } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import GallerySwiperPrimary from '@/components/GallerySwiperPrimary/GallerySwiperPrimary';
import ButtonFavorite from '@/components/ButtonFavorite/ButtonFavorite';
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import RecentPropertiesForSale from '../../project/[id]/_components/RecentPropertiesForSale';
import { useLocale } from 'next-intl';
import { assetsImages } from '@/assets/images/package';
import PageSectionNavigation from '@/components/PageSectionNavigation/PageSectionNavigation';
import './style.css';
import ProjectNewInfo from './_components/ProjectNewInfo';
import ProjectNewInquiry from '@/components/Projects/ProjectNewInquiry';

export interface PagePropertyDetailProps {
  params: any;
  searchParams: { [key: string]: string | string[] | undefined };
}

const getNewHomeDetail = async (id: string): Promise<NewHomeLandingPageModel> => {
  try {
    const newHomes = await newHomeApiService.getLandingPageWithId(id);

    return newHomes;
  } catch (error) {
    // console.log(error);
  }
};

export async function generateMetadata({ params }: PagePropertyDetailProps) {
  const lastIndex = params.id.lastIndexOf('-');
  const projectId = params.id.substring(lastIndex + 1);

  const projectDetail: any = await getNewHomeDetail(projectId);

  const t = await getTranslator(params.locale);

  return {
    title: t.rich('webLabel.EcomProjectDetailPageTitle', {
      project: () => projectDetail?.title,
    }),
    description: projectDetail?.title,
    openGraph: {
      images: projectDetail?.thumbnail?.thumbUrl,

      description: `${projectDetail?.title}`,
      type: `website`,
      title: `${projectDetail?.title}`,
    },
  };
}

const PageDetailNewHome: FC<PagePropertyDetailProps> = async ({ params }) => {
  const lastIndex = params.id.lastIndexOf('-');
  const listingId = params.id.substring(lastIndex + 1);
  const projectDetail = await getNewHomeDetail(listingId);
  const locale = useLocale();
  const t = await getTranslator(locale, 'webLabel');

  if (!projectDetail) {
    notFound();
  }
  return (
    <>
      <GallerySwiperPrimary images={projectDetail.images ?? []} />
      <div className='section-chitiet'>
        <PageSectionNavigation
          items={[
            {
              id: 'overview',
              label: t('EcomPropertyListingApprovePropertyOverview'),
              icon: assetsImages.commonIconNavigation.src,
              iconSize: 'calc(20 / 24 * 100%) auto',
            },
            {
              id: 'area',
              label: t('EcomProjectDetailLocation'),
              icon: assetsImages.commonIconNavigation06.src,
            },
            {
              id: 'amenities',
              label: t('EcomPropertyDetailPageLocationAmenities', { name: '' }),
              icon: assetsImages.commonIconNavigation07.src,
            },
            {
              id: 'partner',
              label: t('EcomPropertyDetailPageLocationPartner', { name: '' }),
              icon: assetsImages.commonIconNavigation08.src,
            },
          ]}
          additional={[
            <li key="fav"><ButtonFavorite listingDetail={projectDetail} locale={locale} /></li>,
            <li key="share"><ButtonShare listingDetail={projectDetail} locale={locale} /></li>,
          ]}
        />
        <div className="container">
          <div className='section-chitiet__wrapper'>
            <ProjectNewInfo projectDetail={projectDetail} locale={params.locale} />
          </div>

          <div className='section-chitiet__sidebar'>
            <ProjectNewInquiry projectDetail={projectDetail} />
          </div>
        </div>
        <RecentPropertiesForSale />
      </div>
    </>
  );
};

export default PageDetailNewHome;
