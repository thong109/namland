import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import { ProjectMasterPlanModel } from '@/models/projectModel/projectMasterPlanModel';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import React, { FC } from 'react';

interface ProjectMasterPlanBlockProps {
  projectId: string;
}

const getProjectMasterPlan = async (projectId: string): Promise<ProjectMasterPlanModel[]> => {
  return (await projectApiService.getProjectMasterPlan(projectId)) ?? [];
};

const ProjectMasterPlanBlock: FC<ProjectMasterPlanBlockProps> = async ({
  projectId,
}: ProjectMasterPlanBlockProps) => {
  const locale = useLocale();
  const projectMasterPlans = await getProjectMasterPlan(projectId);

  const getImageLabel = (masterPlan: ProjectMasterPlanModel) => {
    const result =
      locale === 'vi'
        ? masterPlan.title
        : locale === 'en'
          ? masterPlan.titleEn
          : masterPlan.titleKr;

    return result ?? masterPlan.title;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {projectMasterPlans &&
        projectMasterPlans.map((m, index) => (
          <React.Fragment key={m.id.toString() + '-' + index.toString()}>
            {m.imageUrls &&
              m.imageUrls.map((i, subIndex) => (
                <div key={index + '-' + subIndex} className="relative col-span-1 min-h-[15rem]">
                  <Image src={i} fill alt={getImageLabel(m) + '-' + subIndex} />
                </div>
              ))}
          </React.Fragment>
        ))}
    </div>
  );
};

export default ProjectMasterPlanBlock;
