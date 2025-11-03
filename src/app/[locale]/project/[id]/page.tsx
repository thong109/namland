import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import ProjectInfo from './_components/ProjectInfo';
import RecentPropertiesForSale from './_components/RecentPropertiesForSale';
import GallerySwiperPrimary from '@/components/GallerySwiperPrimary/GallerySwiperPrimary';
import ButtonFavorite from '@/components/ButtonFavorite/ButtonFavorite';
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import { assetsImages } from '@/assets/images/package';
import "./style.css"
import PageSectionNavigation from '@/components/PageSectionNavigation/PageSectionNavigation';
import ProjectNewInquiry from '@/components/Projects/ProjectNewInquiry';

export interface PagePropertyDetailProps {
  params: any;
  searchParams: { [key: string]: string | string[] | undefined };
}

const getProjectDetail = async (id: string, locale: string): Promise<ProjectDetailModel> => {
  try {
    const projectItem = await projectApiService.getLandingPageWithId(id);

    return projectItem;
  } catch (error) {
    // console.log(error);
  }
};

export async function generateMetadata({ params }: PagePropertyDetailProps) {
  const lastIndex = params.id.lastIndexOf('-');
  const projectId = params.id.substring(lastIndex + 1);
  const projectDetail = await getProjectDetail(projectId, params.locale);
  const t = await getTranslator(params.locale);

  return {
    title: t.rich('webLabel.EcomProjectDetailPageTitle', {
      project: () => projectDetail?.name,
    }),
    description: projectDetail?.description,
    openGraph: {
      images: projectDetail?.thumbnail?.thumbUrl,

      description: `${projectDetail?.description}`,
      type: `website`,
      title: `${projectDetail?.name}`,
    },
  };
}

const PageDetailProject: FC<PagePropertyDetailProps> = async ({ params, searchParams }) => {
  const lastIndex = params.id.lastIndexOf('-');
  const listingId = params.id.substring(lastIndex + 1);
  const locale = useLocale();
  const projectDetail = await getProjectDetail(listingId, locale);

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
              label: 'Tổng quan',
              icon: assetsImages.commonIconNavigation.src,
              iconSize: 'calc(20 / 24 * 100%) auto',
            },
            {
              id: 'area',
              label: 'Vị trí',
              icon: assetsImages.commonIconNavigation06.src,
            },
            {
              id: 'amenities',
              label: 'Tiện ích cảnh quan',
              icon: assetsImages.commonIconNavigation07.src,
            },
            {
              id: 'partner',
              label: 'Đối tác',
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
            <ProjectInfo projectDetail={projectDetail} locale={params.locale} />
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

export default PageDetailProject;
