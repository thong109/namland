import DateConstant from '@/libs/constants/dateConstant';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';

interface ProjectInfoProjectDetailsProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const ProjectInfoProjectDetails: React.FC<ProjectInfoProjectDetailsProps> = ({
  locale,
  projectDetail,
}) => {
  const t = useTranslations('webLabel');

  const renderItem = useCallback((title: string, value: string | number | React.ReactNode) => {
    return (
      <>
        <div className="col-span-1 text-sm font-medium text-neutral-900">{title}</div>
        <div className="col-span-1 text-sm font-normal text-neutral-500">{value}</div>
      </>
    );
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-1 grid grid-cols-2 grid-rows-3 gap-4">
        {renderItem(t('EcomProjectDetailProjectName'), projectDetail?.name)}
        {renderItem(t('EcomProjectDetailTotalArea'), projectDetail?.totalArea)}
        {renderItem(t('EcomProjectDetailHandOverYear'), projectDetail?.handOverYear)}
      </div>
      <div className="col-span-1 grid grid-cols-2 grid-rows-3 gap-4">
        {renderItem(
          t('EcomProjectDetailYearBuilt'),
          moment(projectDetail?.yearBuited).format(DateConstant.ShortFormat),
        )}
        {renderItem(t('EcomProjectDetailNumberOfFloor'), projectDetail?.numberOfFloor)}
        {renderItem(t('EcomProjectDetailNumberOfUnit'), projectDetail?.numberOfUnit)}
      </div>
      <div className="col-span-1 grid grid-cols-2 grid-rows-3 gap-4">
        {renderItem(
          t('EcomProjectDetailUnitTypeSale'),
          projectDetail?.unitTypeSell?.map((unit) => unit.name).join(', '),
        )}
        {renderItem(
          t('EcomProjectDetailUnitTypeLease'),
          projectDetail?.unitTypeRent?.map((unit) => unit.name).join(', '),
        )}
        {renderItem(t('EcomProjectDetailManagedBy'), projectDetail?.managedBy)}
      </div>
      <div className="col-span-1 grid grid-cols-2 grid-rows-3 gap-4">
        {renderItem(t('EcomProjectDetailOwner'), projectDetail?.owner)}
      </div>
    </div>
  );
};

export default React.memo(ProjectInfoProjectDetails);
