import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import ProjectInfo from './_components/ProjectInfo';
import RecentPropertiesForLease from './_components/RecentPropertiesForLease';
import RecentPropertiesForSale from './_components/RecentPropertiesForSale';
import GallerySwiperPrimary from '@/components/GallerySwiperPrimary/GallerySwiperPrimary';
import ButtonFavorite from '@/components/ButtonFavorite/ButtonFavorite';
import ButtonShare from '@/components/ButtonShare/ButtonShare';
import { assetsImages } from '@/assets/images/package';
import "./style.css"
import dynamic from 'next/dynamic';

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
        <div className='navigation-common-page'>
          <div className='container'>
            <ul className='navigation-common-page__wrapper'>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#overview'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation.src})`, backgroundSize: `calc(20 / 24 * 100%) auto` }}></span>Tổng quan</a>
              </li>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#area'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation02.src})`, backgroundSize: `calc(24 / 24 * 100%) auto` }}></span>Vị trí</a>
              </li>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#amenities'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation03.src})`, backgroundSize: `calc(24 / 24 * 100%) auto` }}></span>Tiện ích cảnh quan</a>
              </li>
              <li className='navigation-common-page__entry'>
                <a className='navigation-common-page__entry-wrapper' href='#partner'><span className='navigation-common-page__entry-icon' style={{ backgroundImage: `url(${assetsImages.commonIconNavigation04.src})`, backgroundSize: `calc(24 / 24 * 100%) auto` }}></span>Đối tác</a>
              </li>
            </ul>
            <ul className='navigation-common-page__additional'>
              <li className='navigation-common-page__additional-entry'><ButtonFavorite listingDetail={projectDetail} locale={locale} /></li>
              <li className='navigation-common-page__additional-entry'><ButtonShare listingDetail={projectDetail} locale={locale} /></li>
            </ul>
          </div>
        </div>
        <div className="container">
          <div className='section-chitiet__wrapper'>
            <ProjectInfo projectDetail={projectDetail} locale={params.locale} />
          </div>

          <div className='section-chitiet__sidebar'>
            
          </div>
        </div>
        <RecentPropertiesForSale />
      </div>
    </>
  );
};

export default PageDetailProject;
