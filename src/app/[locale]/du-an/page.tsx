import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import ProjectConstant from '@/libs/constants/projectConstant';
import { ProjectListModel } from '@/models/projectModel/projectListModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import { FC } from 'react';
import PageResultModel from '../../../models/reponseModel/pageResultModel';
import PageProjectClient from './pageClient';

export interface PageProjectProps {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}

const getData = async (from: number = 0): Promise<PageResultModel<ProjectListModel>> => {
  try {
    const filter: SearchRequestModel = {
      from: from ?? 0,
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
    };
    const response = await projectApiService.getProjectsListLandingPage(filter);

    if (response) {
      return response;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
};

const PageProject: FC<PageProjectProps> = async ({ params, searchParams }) => {
  let from = 0;
  if (searchParams['from'] && !isNaN(Number.parseInt(searchParams['from'] as string))) {
    from = Number.parseInt(searchParams['from'] as string) - 1;
  }

  const projectResponse = await getData(from);
  let projects = [];
  let total = 0;

  if (projectResponse) {
    projects = projectResponse.data;
    total = projectResponse.total;
  }

  return <PageProjectClient initProjects={projects} initTotal={total} from={from} />;
};

export default PageProject;
