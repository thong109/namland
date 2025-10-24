import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import ListingModel from '@/models/listingModel/listingModel';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import ProjectRecentListing from './projectRecentListing';

interface ProjectRecentListingForSaleProps {
  projectId: string;
}

const getRecentListingsForSale = async (projectId: string): Promise<ListingModel[]> => {
  return (await projectApiService.getRecentListingsForSale(projectId)) ?? [];
};

const ProjectRecentListingForSale: FC<ProjectRecentListingForSaleProps> = async ({ projectId }) => {
  const t = useTranslations('webLabel');

  const data = await getRecentListingsForSale(projectId);

  return (
    <ProjectRecentListing
      data={data}
      heading={
        <div className={`nc-Section-Heading relative mb-[40px] capitalize`}>
          <div className={'mx-auto mb-4 w-full max-w-2xl text-center'}>
            <h2 className={`text-3xl font-semibold md:text-4xl`}>
              {t('EcomProjectDetailRecentListingsForSale')}
            </h2>
          </div>
        </div>
      }
    />
  );
};

export default ProjectRecentListingForSale;
