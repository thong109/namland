'use server';
import { postEcomEcomProjectGetListProject } from '@/ecom-sadec-api-client';
import PageProjectClient from './pageClient';

const fetchProject = async (currentPage, pageSize, keyword?) => {
  const filter = {
    from: (currentPage - 1) * pageSize,
    size: pageSize,
    keyword,
  };

  const response = await postEcomEcomProjectGetListProject({
    requestBody: filter,
  });
  return {
    projectList: (response as any).data?.data || [],
    total: (response as any).data?.total || 0,
  };
};

const PageProject = async ({ searchParams }) => {
  const currentPage = parseInt(searchParams.page, 10) || 1;
  const pageSize = 24;
  const keyword = searchParams.keyword;
  const { projectList, total } = await fetchProject(currentPage, pageSize, keyword);

  return (
    <PageProjectClient
      projectList={projectList}
      total={total}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
};

export default PageProject;
