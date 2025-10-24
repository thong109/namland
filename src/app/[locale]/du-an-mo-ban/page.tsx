'use server';
import favoriteApiService from '@/apiServices/externalApiServices/favoriteApiService';
import NewHomePageClient from './pageClient';

const fetchNewHome = async (
  currentPage,
  pageSize,
  keyword?,
  fromPrice?,
  toPrice?,
  fromArea?,
  toArea?,
  fromRoom?,
  toRoom?,
) => {
  const filter = {
    from: (currentPage - 1) * pageSize,
    size: pageSize,
    keyword,
    fromPrice,
    toPrice,
    fromArea,
    toArea,
    fromRoom,
    toRoom,
  };

  const response = await favoriteApiService.getAllLandingPage(filter);
  return {
    newHomeList: (response as any).data?.data || [],
    total: (response as any).data?.total || 0,
  };
};

const PageProject = async ({ searchParams }) => {
  const currentPage = parseInt(searchParams.page, 10) || 1;
  const pageSize = 9;
  const keyword = searchParams.keyword;
  const fromPrice = searchParams.fromPrice;
  const toPrice = searchParams.toPrice;
  const fromArea = searchParams.fromArea;
  const toArea = searchParams.toArea;
  const fromRoom = searchParams.fromRoom;
  const toRoom = searchParams.toRoom;
  const { newHomeList, total } = await fetchNewHome(
    currentPage,
    pageSize,
    keyword,
    fromPrice,
    toPrice,
    fromArea,
    toArea,
    fromRoom,
    toRoom,
  );

  return (
    <NewHomePageClient
      newHomeList={newHomeList}
      total={total}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
};

export default PageProject;
