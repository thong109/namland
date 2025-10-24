import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import { FC } from 'react';
import ProjectBrochureBlockClient from './projectBrochureBlockClient';

interface ProjectBrochureBlockProps {
  projectId: string;
}

const getProductBrochures = async (projectId: string) => {
  return (await projectApiService.getProjectBrochure(projectId)) ?? [];
};

const ProjectBrochureBlock: FC<ProjectBrochureBlockProps> = async ({ projectId }) => {
  const brochures = await getProductBrochures(projectId);

  return <ProjectBrochureBlockClient brochures={brochures} />;
};

export default ProjectBrochureBlock;
