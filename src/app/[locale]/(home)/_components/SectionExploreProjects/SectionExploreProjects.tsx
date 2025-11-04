import { postEcomEcomProjectGetListProject } from '@/ecom-sadec-api-client';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import ProjectCardItem from '@/app/[locale]/project/_components/projectCardItem';
import { getTranslator } from 'next-intl/server';
import "./SectionExploreProjects.css";

interface Props {
  locale: string;
}

const getProjects = async () => {
  const res = (await postEcomEcomProjectGetListProject({
    requestBody: { from: 0, size: 6 },
  })) as ApiResponseModel<PageResultModel<ProjectDetailModel>>;
  return res?.data?.data ?? [];
};

const SectionExploreProjects = async ({ locale }: Props) => {
  const t = await getTranslator(locale, 'webLabel');
  const projects = await getProjects();

  return (
    <div className="container">
      <div className="explore__container">
        <p className="explore__title">
          {t('EcomHomePageExploreProject')}
        </p>
        <div className="explore__list">
          {projects.map((item, index) => (
            <div className="explore__item" key={`prj-${index}`}>
              <ProjectCardItem data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionExploreProjects;
