'use client';

import CardProject from '@/components/Cards/CardProject';
import { ProjectListModel } from '@/models/projectModel/projectListModel';
import { Pagination, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import projectApiService from '../../../apiServices/externalApiServices/projectApiService';
import ProjectConstant from '../../../libs/constants/projectConstant';
import SearchRequestModel from '../../../models/searchModel/searchRequestModel';

export interface PageProjectProps {
  initProjects: ProjectListModel[];
  initTotal: number;
  from: number;
}

const PageProjectClient: FC<PageProjectProps> = ({ initProjects, initTotal = 0, from = 0 }) => {
  const t = useTranslations('webLabel');
  const errorTrans = useTranslations('error');
  const router = useRouter();
  const pathname = usePathname();
  const [projects, setProjects] = useState<ProjectListModel[]>(initProjects ?? []);
  const [total, setTotal] = useState<number>(initTotal ?? 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<SearchRequestModel>({
    from: from,
    size: ProjectConstant.TotalProjectsInPage,
    query: {
      bool: {
        must: [
          {
            term: {
              isActive: true,
            },
          },
        ],
      },
    },
    sort: {
      label: 'Số thứ tự tăng dần',
      field: 'order',
      sortOrder: 0,
      isDefault: true,
    },
  });

  const getProjectList = async () => {
    setIsLoading(true);
    try {
      const response = await projectApiService.getProjectsListLandingPage(filter);

      if (response) {
        setProjects(response.data);
        setTotal(response.total);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setNewStringQuery = () => {
    const queryStr = `from=${filter.from + 1}`;

    router.replace(pathname + '?' + queryStr);
  };

  const onPageChange = (page: any, pageSize: any) => {
    filter.from = (page - 1) * filter.size!;
    setNewStringQuery();
    setFilter({ ...filter });
    getProjectList();
  };

  return (
    <div className="container pb-20 pt-5">
      <Typography className="text-center text-4xl font-bold">
        {t('EcomProjectsPageProjects')}
      </Typography>
      <Typography className="mt-4 text-center">{t('EcomProjectsPageLoremIpsum')}</Typography>
      {isLoading && (
        <div className="grid-cols-full mt-10 grid text-center">
          <Spin />
        </div>
      )}
      {!isLoading && projects && projects.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-11 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <div key={project.id} className="col-span-1">
              <CardProject project={project}></CardProject>
            </div>
          ))}
        </div>
      )}
      {projects && projects.length > 0 && (
        <div className="mt-11">
          <div className="w-full text-center">
            {t('EcomProjectListingShowTotalProjects', {
              itemsPerPage: projects.length,
              total: total,
            })}
          </div>
          <div className="flex w-full justify-center pb-3">
            <Pagination
              current={Math.floor(filter.from / filter.size) + 1}
              pageSize={filter.size}
              total={total}
              showSizeChanger={false}
              onChange={onPageChange}
            />
          </div>
        </div>
      )}
      {(!projects || projects.length === 0) && (
        <>
          <div className="mt-10 text-center">{errorTrans('projectsNotFound')}</div>
        </>
      )}
    </div>
  );
};

export default PageProjectClient;
