import { NewHomeLandingPageModel } from '@/models/newHomeModel/newHomeModelLandingPage';
import { getTranslator } from 'next-intl/server';
import React from 'react';
import AddToFavoriteButtonNewHome from '../../_components/AddToFavoriteButtonNewHome';

interface ProjectInfoProps {
  locale: string;
  projectDetail: NewHomeLandingPageModel;
}

const renderItem = (title: string, value: string | number | React.ReactNode) => {
  return (
    <div className="flex pb-2">
      <div className="col-span-2 w-[35%] text-base font-medium text-neutral-900">{title} : </div>
      <div className="col-span-3 text-base font-normal text-neutral-500">{value}</div>
    </div>
  );
};

const ProjectNewInfo: React.FC<ProjectInfoProps> = async ({ projectDetail, locale }) => {
  const t = await getTranslator(locale);

  return (
    <>
      <div className="flex flex-col">
        <>
          <div className="flex justify-between">
            <h1 className="line-clamp-2 text-base font-semibold text-neutral-1000 lg:text-xl">
              {projectDetail?.title}
            </h1>
            <AddToFavoriteButtonNewHome
              listingDetail={projectDetail}
              className="!left-1/2 !top-1/2 size-full !-translate-x-1/2 !-translate-y-1/2 !transform"
            />
          </div>
          <div className="flex items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </span>
            <span className="ml-1 line-clamp-2 text-xs lg:text-base">
              {projectDetail?.location?.address}
            </span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-lg font-bold text-portal-primaryLiving">
              {t('webLabel.EcomProjectDetailPageTotalPrice', {
                fromPrice: projectDetail?.fromPrice / 1_000_000,
                toPrice: projectDetail?.toPrice / 1_000_000,
              })}
            </span>
          </div>
        </>

        {/* Mobile */}
        <div className="mt-3 grid grid-cols-2 border-b border-t border-black lg:hidden">
          <div className="col-span-1 flex flex-col border-b border-r border-black">
            <span className="pl-1 pt-1 text-xs lg:text-sm">
              {t('webLabel.EcomProjectDetailPageTotalPrice')}
            </span>
            <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
              {projectDetail?.totalPrice}
            </span>
          </div>
          <div className="col-span-1 flex flex-col border-b border-black">
            <span className="pl-1 pt-1 text-xs lg:text-sm">
              {t('webLabel.EcomProjectDetailPageParkingFee')}
            </span>
            <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
              {projectDetail?.parkingFee}
            </span>
          </div>
          <div className="col-span-1 flex flex-col border-b border-r border-black">
            <span className="pb-1 pl-1 pt-1 text-xs lg:text-sm">
              {t('webLabel.EcomProjectDetailPageLayout')}
            </span>
            <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
              {projectDetail?.layout}
            </span>
          </div>
          <div className="col-span-1 flex flex-col border-b border-black">
            <span className="pl-1 pt-1 text-xs lg:text-sm">
              {t('webLabel.EcomProjectDetailPageUnitArea')}
            </span>
            <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
              {projectDetail?.unitArea}
            </span>
          </div>
          <div className="col-span-1 flex flex-col border-r border-black">
            <span className="pl-1 pt-1 text-xs lg:text-sm">
              {t('webLabel.EcomProjectDetailPageHandOverYear')}
            </span>
            <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
              {projectDetail?.handoverYear}
            </span>
          </div>
          <div className="col-span-1 flex flex-col">
            <span className="pb-1 pl-1 pt-1 text-xs lg:text-sm">
              {t('webLabel.EcomProjectDetailPageInvestor')}
            </span>
            <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
              {projectDetail?.investor}
            </span>
          </div>
        </div>

        {/* Desktop */}
        <div className="mt-2 hidden grid-cols-3 lg:grid">
          <div className="col-span-1">
            {renderItem(t('webLabel.EcomProjectDetailPageTotalPrice'), projectDetail?.totalPrice)}
            {renderItem(t('webLabel.EcomProjectDetailPageParkingFee'), projectDetail?.parkingFee)}
          </div>
          <div className="col-span-1">
            {renderItem(t('webLabel.EcomProjectDetailPageLayout'), projectDetail?.layout)}
            {renderItem(t('webLabel.EcomProjectDetailPageUnitArea'), projectDetail?.unitArea)}
          </div>
          <div className="col-span-1">
            {renderItem(
              t('webLabel.EcomProjectDetailPageHandOverYear'),
              projectDetail?.handoverYear,
            )}

            {renderItem(t('webLabel.EcomProjectDetailPageInvestor'), projectDetail?.investor)}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProjectNewInfo);
