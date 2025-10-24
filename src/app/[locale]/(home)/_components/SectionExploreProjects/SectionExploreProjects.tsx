import { NAVIGATION } from '@/data/navigation';
import { postEcomEcomProjectGetListProject } from '@/ecom-sadec-api-client';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next-intl/link';
import { getTranslator } from 'next-intl/server';
import React from 'react';
import ExploreProjectCard from './ExploreProjectCard';
import './ExploreProjectCard.scss';

interface Props {
  locale: string;
}

const getProjects = async () => {
  const projects = (await postEcomEcomProjectGetListProject({
    requestBody: {
      from: 0,
      size: 5,
    },
  })) as ApiResponseModel<PageResultModel<ProjectDetailModel>>;
  return projects?.data?.data ?? [];
};

const SectionExploreProjects: React.FC<Props> = async ({ locale }) => {
  const t = await getTranslator(locale, 'webLabel');
  const commonTranslator = await getTranslator(locale, 'Common');

  const projects = await getProjects();

  return (
    <div className="container relative flex flex-col gap-4">
      <div className="flex grid-cols-3 flex-row justify-between lg:grid">
        <div className="col-span-1 hidden lg:block"></div>
        <h1 className="col-span-1 text-center text-3xl font-bold">
          {t('EcomHomePageExploreProject')}
        </h1>

        <div className="flex items-end justify-end lg:items-center">
          <Link
            href={{ pathname: NAVIGATION.projectList.href }}
            className="flex flex-row items-center gap-4"
          >
            <div className="cursor-pointer whitespace-nowrap text-green underline underline-offset-4 lg:uppercase lg:text-pmh-text lg:no-underline">
              {commonTranslator('ShowMore')}
            </div>
            <div className="hidden size-10 lg:inline-block">
              <ArrowRightCircleIcon className="size-full" />
            </div>
          </Link>
        </div>
      </div>
      <div className={clsx('lg:square-container flex overflow-x-auto max-lg:gap-4')}>
        {projects &&
          projects.map((project) => (
            <div
              key={project.id}
              className={clsx(
                'max-lg:h-60 max-lg:min-h-60 max-lg:w-60 max-lg:min-w-60',
                'lg:square',
              )}
            >
              <div className={clsx('lg:explore-project-card-content size-full')}>
                <ExploreProjectCard locale={locale} project={project} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SectionExploreProjects;
