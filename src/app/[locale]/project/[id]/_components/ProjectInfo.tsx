import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';
import ProjectInfoIndoorAmenity from './ProjectInfo.IndoorAmenity';
// import ProjectInfoLocation from './ProjectInfo.Location';
import ProjectInfoNearby from './ProjectInfo.Nearby';
import ProjectInfoOutdoorAmenity from './ProjectInfo.OutdoorAmenity';
import ProjectInfoPriceRange from './ProjectInfo.PriceRange';
import ProjectInfoProjectDetails from './ProjectInfo.ProjectDetails';

interface ProjectInfoProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ locale, projectDetail }) => {
  const t = useTranslations('webLabel');

  const blockTitleClassName = 'text-lg font-medium text-neutral-900 mb-4';

  return (
    <div className="flex flex-col gap-8 lg:px-6 lg:py-4">
      <div>
        <div className={clsx(blockTitleClassName)}>{t('EcomProjectDetailIntroduction')}</div>
        <div className="whitespace-pre-line">{projectDetail?.description}</div>
      </div>
      <div>
        <div className={clsx(blockTitleClassName)}>{t('EcomProjectDetailDetail')}</div>
        <div className="">
          <ProjectInfoProjectDetails locale={locale} projectDetail={projectDetail} />
        </div>
      </div>
      <div>
        <div className={clsx(blockTitleClassName)}>{t('EcomProjectDetailPriceRange')}</div>
        <ProjectInfoPriceRange locale={locale} projectDetail={projectDetail} />
      </div>
      <div>
        <div className={clsx(blockTitleClassName)}>{t('EcomProjectDetailIndoorAmenity')}</div>
        <ProjectInfoIndoorAmenity locale={locale} projectDetail={projectDetail} />
      </div>
      <div>
        <div className={clsx(blockTitleClassName)}>{t('EcomProjectDetailOutdoorAmenity')}</div>
        <ProjectInfoOutdoorAmenity locale={locale} projectDetail={projectDetail} />
      </div>
      {projectDetail?.nearBy?.length > 0 && (
        <div>
          <div className={clsx(blockTitleClassName)}>{t('EcomProjectDetailNearBy')}</div>
          <ProjectInfoNearby locale={locale} projectDetail={projectDetail} />
        </div>
      )}
      <div>
        <div className={clsx(blockTitleClassName)}>{t('EcomProjectDetailLocation')}</div>
        {/* <ProjectInfoLocation locale={locale} projectDetail={projectDetail} /> */}
      </div>
    </div>
  );
};

export default React.memo(ProjectInfo);
