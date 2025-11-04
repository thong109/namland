import { postEcomEcomProjectGetListProject } from '@/ecom-sadec-api-client';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import ProjectCardItem from '@/app/[locale]/project/_components/projectCardItem';
import { getTranslator } from 'next-intl/server';

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
    <div className="container relative flex flex-col gap-4">
      <p className="mb-1 text-xl md:text-[30px] font-semibold text-black leading-1">
        {t('EcomHomePageExploreProject')}
      </p>
      <div className="grid grid-cols-12 gap-4 md:gap-[30px]">
        {projects.map((item, index) => (
          <div className="col-span-12 sm:col-span-6 lg:col-span-4" key={`prj-${index}`}>
            <ProjectCardItem data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionExploreProjects;
