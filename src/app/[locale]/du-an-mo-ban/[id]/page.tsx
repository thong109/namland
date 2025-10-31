import newHomeApiService from '@/apiServices/externalApiServices/apiNewHomeService';
import { NewHomeLandingPageModel } from '@/models/newHomeModel/newHomeModelLandingPage';
import { getTranslator } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import LayoutImage from './_components/LayoutImage';
import PorjectNewNews from './_components/PorjectNewNews';
import ProjectNewDetailInfo from './_components/ProjectNewDetailInfo';
import ProjectNewInfo from './_components/ProjectNewInfo';
import ProjectNewInquiry from './_components/ProjectNewInquiry';
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

  if (!projectDetail) {
    notFound();
  }
  return (
    <>
      <div className="container flex h-full flex-col gap-2">
        {/* <Image
          src={projectDetail?.thumbnail?.thumbUrl}
          alt="thumbnail"
          layout="responsive"
          width={100}
          height={20} // This is a placeholder, the real height is controlled by CSS
          className="!max-h-[240px] w-screen object-cover lg:!max-h-[600px]"
          priority
        /> */}
        <div className="flex flex-col">
          <ProjectNewInfo projectDetail={projectDetail} locale={params.locale} />

          <LayoutImage layouts={projectDetail?.layouts} locale={params.locale} />

          <PorjectNewNews projectDetail={projectDetail} />

          <ProjectNewDetailInfo projectDetail={projectDetail} locale={params.locale} />

          <ProjectNewInquiry projectDetail={projectDetail} />
        </div>
      </div>
    </>
  );
};

export default PageDetailNewHome;
