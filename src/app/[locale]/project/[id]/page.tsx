import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import GalleryPrimary from '@/components/GalleryPrimary/GalleryPrimary';
import ProjectInfo from './_components/ProjectInfo';
import RecentPropertiesForLease from './_components/RecentPropertiesForLease';
import RecentPropertiesForSale from './_components/RecentPropertiesForSale';

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
      project: () => projectDetail.name,
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
      {(projectDetail?.images ?? []).slice(0, 4).map((image, index) => (
        <link key={index} rel="preload" href={image.url} as="image" />
      ))}
      <div className="container flex flex-col gap-10 pb-20">
        <h1 className="text-center text-4xl font-bold text-neutral-1000">{projectDetail.name}</h1>
        <GalleryPrimary images={projectDetail.images ?? []} />
        <div className="flex flex-col gap-10">
          <ProjectInfo projectDetail={projectDetail} locale={params.locale} />
          <RecentPropertiesForLease projectDetail={projectDetail} locale={params.locale} />
          <RecentPropertiesForSale projectDetail={projectDetail} locale={params.locale} />
        </div>
      </div>
    </>
  );
};

export default PageDetailProject;
