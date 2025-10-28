import PriceNumberText from '@/components/PriceNumberText/PriceNumberText';
import { PriceDisplayTypeEnum } from '@/libs/enums/PriceDisplayTypeEnum';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ProjectInfoPriceRangeProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const ProjectInfoPriceRange: React.FC<ProjectInfoPriceRangeProps> = ({ locale, projectDetail }) => {
  const t = useTranslations('webLabel');

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="col-span-1 grid grid-cols-12">
        <div className="col-span-4 font-medium text-neutral-1000">
          {t('EcomProjectDetailForSale')}
        </div>
        <div className="col-span-8 text-neutral-500">
          <PriceNumberText
            value={projectDetail?.priceRange?.saleMinPrice}
            displayPriceType={PriceDisplayTypeEnum.FullPrice}
          />{' '}
          -{' '}
          <PriceNumberText
            value={projectDetail?.priceRange?.saleMinPrice}
            displayPriceType={PriceDisplayTypeEnum.FullPrice}
          />
        </div>
      </div>
      <div className="col-span-1 grid grid-cols-12">
        <div className="col-span-4 font-medium text-neutral-1000">
          {t('EcomProjectDetailForLease')}
        </div>
        <div className="col-span-8 text-neutral-500">
          <PriceNumberText
            value={projectDetail?.priceRange?.rentMinPrice}
            displayPriceType={PriceDisplayTypeEnum.FullPrice}
          />{' '}
          -{' '}
          <PriceNumberText
            value={projectDetail?.priceRange?.rentMaxPrice}
            displayPriceType={PriceDisplayTypeEnum.FullPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProjectInfoPriceRange);
