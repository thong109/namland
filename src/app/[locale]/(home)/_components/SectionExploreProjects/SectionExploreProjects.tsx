'use client';
import { NAVIGATION } from '@/data/navigation';
import { postEcomEcomProjectGetListProject } from '@/ecom-sadec-api-client';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import clsx from 'clsx';
import Link from 'next-intl/link';
import React from 'react';
import ExploreProjectCard from './ExploreProjectCard';
import './ExploreProjectCard.scss';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import ProjectCardItem from '@/app/[locale]/project/_components/projectCardItem';

interface Props {
  locale: string;
}

const getProjects = async () => {
  const projects = (await postEcomEcomProjectGetListProject({
    requestBody: {
      from: 0,
      size: 6,
    },
  })) as ApiResponseModel<PageResultModel<ProjectDetailModel>>;
  return projects?.data?.data ?? [];
};

const SectionExploreProjects: React.FC<Props> = async ({ locale }) => {
  const t = useTranslations('webLabel');
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
