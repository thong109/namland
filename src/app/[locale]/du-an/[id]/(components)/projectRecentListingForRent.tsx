import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import ListingModel from '@/models/listingModel/listingModel';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import ProjectRecentListing from './projectRecentListing';

interface ProjectRecentListingForRentProps {
  projectId: string;
}

const getRecentListingsForRent = async (projectId: string): Promise<ListingModel[]> => {
  return (await projectApiService.getRecentListingsForRent(projectId)) ?? [];
};

const ProjectRecentListingForRent: FC<ProjectRecentListingForRentProps> = async ({ projectId }) => {
  const t = useTranslations('webLabel');

  const data = await getRecentListingsForRent(projectId);

  return (
    <ProjectRecentListing
      data={data}
      heading={
        <div className={`nc-Section-Heading relative mb-[40px] capitalize`}>
          <div className={'mx-auto mb-4 w-full max-w-2xl text-center'}>
            <h2 className={`text-3xl font-semibold md:text-4xl`}>
              {t('EcomProjectDetailRecentListingsForRent')}
            </h2>
          </div>
        </div>
      }
    ></ProjectRecentListing>
  );
};

export default ProjectRecentListingForRent;
