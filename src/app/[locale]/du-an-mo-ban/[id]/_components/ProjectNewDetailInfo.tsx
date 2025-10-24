import { getTranslator } from 'next-intl/server';
import React from 'react';

interface Props {
  projectDetail: any;
  locale: string;
}

const renderItem = (title: string, value: string | number | React.ReactNode) => {
  return (
    <div className="flex pb-2">
      <div className="col-span-2 w-[35%] text-base font-medium text-neutral-900">{title} : </div>
      <div className="col-span-3 text-base font-normal text-neutral-500">{value}</div>
    </div>
  );
};

const ProjectNewDetailInfo: React.FC<Props> = async ({ projectDetail, locale }) => {
  const t = await getTranslator(locale);
  return (
    <>
      {/* Mobile */}
      <span className="mt-3 font-semibold lg:hidden">
        {t('webLabel.EcomProjectDetaiSpecification')}
      </span>
      <div className="grid grid-cols-2 border-b border-t border-black lg:hidden">
        <div className="col-span-1 flex flex-col border-b border-r border-black">
          <span className="pl-1 pt-1 text-xs lg:text-sm">
            {t('webLabel.EcomProjectDetailPageSiteArea')}
          </span>
          <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
            {projectDetail?.details?.siteArea}
          </span>
        </div>
        <div className="col-span-1 flex flex-col border-b border-black">
          <span className="pl-1 pt-1 text-xs lg:text-sm">
            {t('webLabel.EcomProjectDetailPageFloors')}
          </span>
          <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
            {projectDetail?.details?.floors}
          </span>
        </div>
        <div className="col-span-1 flex flex-col border-r border-black">
          <span className="pl-1 pt-1 text-xs lg:text-sm">
            {t('webLabel.EcomProjectDetailPageUnits')}
          </span>
          <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
            {projectDetail?.details?.units}
          </span>
        </div>
        <div className="col-span-1 flex flex-col">
          <span className="pl-1 pt-1 text-xs lg:text-sm">
            {t('webLabel.EcomProjectDetailPageManagementFeea')}
          </span>
          <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
            {projectDetail?.details?.managementFee}
          </span>
        </div>
      </div>

      <span className="mt-5 font-semibold lg:hidden">
        {t('webLabel.EcomProjectDetaiCompanyData')}
      </span>
      <div className="mb-8 grid grid-cols-2 border-b border-t border-black lg:hidden">
        <div className="col-span-1 flex flex-col border-r border-black">
          <span className="pl-1 pt-1 text-xs lg:text-sm">
            {t('webLabel.EcomProjectDetailPageConstruction')}
          </span>
          <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
            {projectDetail?.details?.construction}
          </span>
        </div>

        <div className="col-span-1 flex flex-col">
          <span className="pl-1 pt-1 text-xs lg:text-sm">
            {t('webLabel.EcomProjectDetailPageManagement')}
          </span>
          <span className="pb-1 pl-1 text-sm font-semibold lg:text-base">
            {' '}
            {projectDetail?.details?.management}
          </span>
        </div>
      </div>

      {/* End Mobile */}

      {/* Desktop */}
      <span className="mt-3 hidden font-semibold text-portal-primaryLiving lg:block">
        {t('webLabel.EcomProjectDetaiSpecification')}
      </span>
      <div className="mt-2 hidden grid-cols-3 lg:grid">
        <div className="col-span-1">
          {renderItem(
            t('webLabel.EcomProjectDetailPageSiteArea'),
            projectDetail?.details?.siteArea,
          )}
          {renderItem(
            t('webLabel.EcomProjectDetailPageManagementFeea'),
            projectDetail?.details?.managementFee,
          )}
        </div>
        <div className="col-span-1">
          {renderItem(t('webLabel.EcomProjectDetailPageUnits'), projectDetail?.details?.units)}
        </div>
        <div className="col-span-1">
          {renderItem(t('webLabel.EcomProjectDetailPageFloors'), projectDetail?.details?.floors)}
        </div>
      </div>
      <span className="mt-5 hidden font-semibold text-portal-primaryLiving lg:block">
        {t('webLabel.EcomProjectDetaiCompanyData')}
      </span>
      <div className="mt-2 hidden grid-cols-3 lg:grid">
        <div className="col-span-1">
          {renderItem(
            t('webLabel.EcomProjectDetailPageConstruction'),
            projectDetail?.details?.construction,
          )}
        </div>
        <div className="col-span-1">
          {renderItem(
            t('webLabel.EcomProjectDetailPageManagement'),
            projectDetail?.details?.management,
          )}
        </div>
      </div>
      {/* End Desktop */}
    </>
  );
};

export default ProjectNewDetailInfo;
