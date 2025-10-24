import { LegalStatusEnum } from '@/libs/enums/LegalStatusEnum';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';

interface ListingDetailedPropertyDetailsProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ListingDetailedPropertyDetails: React.FC<ListingDetailedPropertyDetailsProps> = ({
  locale,
  listingDetail,
}) => {
  const t = useTranslations('webLabel');
  const enumTranslator = useTranslations('enum');

  const renderItem = useCallback(
    (title: string | React.ReactNode, value: string | number | React.ReactNode) => {
      return (
        <>
          <div className="col-span-1 text-sm font-medium text-neutral-900">{title}</div>
          <div className="col-span-1 text-sm font-normal text-neutral-500">{value}</div>
        </>
      );
    },
    [],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-1 grid grid-cols-2 grid-rows-4 gap-4">
        {renderItem(
          t('EcomPropertyDetailPageDetailPropertyType'),
          listingDetail?.listingCategory?.name ?? 'ー',
        )}
        {renderItem(t('EcomPropertyDetailPageDetailProject'), listingDetail?.project?.name ?? 'ー')}
        {/* {renderItem(t('EcomPropertyDetailPageDetailBlockTower'), listingDetail?.blockTower ?? 'ー')}
        {renderItem(t('EcomPropertyDetailPageDetailFloor'), listingDetail?.floor ?? 'ー')} */}
      </div>
      <div className="col-span-1 grid grid-cols-2 grid-rows-4 gap-4">
        {renderItem(
          t('EcomPropertyDetailPageDetailUnitCode'),
          listingDetail?.isShowUnitCode ? listingDetail?.unit?.unitNo ?? 'ー' : 'ー',
        )}
        {renderItem(
          t.rich('EcomPropertyDetailPageDetailArea', { sup: (chunk) => <sup>{chunk}</sup> }),
          listingDetail?.size ?? 'ー',
        )}
        {renderItem(t('EcomPropertyDetailPageDetailBedrooms'), listingDetail?.bedrooms ?? 'ー')}
        {renderItem(t('EcomPropertyDetailPageDetailBathrooms'), listingDetail?.bathrooms ?? 'ー')}
      </div>
      <div className="col-span-1 grid grid-cols-2 grid-rows-4 gap-4">
        {renderItem(
          t('EcomPropertyDetailPageDetailLegalStatus'),
          listingDetail?.legalStatus && typeof listingDetail?.legalStatus !== 'undefined'
            ? enumTranslator('LegalStatusEnum.' + LegalStatusEnum[listingDetail?.legalStatus])
            : 'ー',
        )}
        {renderItem(
          t('EcomPropertyDetailPageDetailGeneralFurnitureStatus'),
          listingDetail?.interior?.interiorName ?? 'ー',
        )}
        {renderItem(
          t('EcomPropertyDetailPageDetailView'),
          listingDetail?.views.length > 0
            ? listingDetail?.views.map((view) => view.name).join(', ')
            : 'ー',
        )}
      </div>
    </div>
  );
};

export default React.memo(ListingDetailedPropertyDetails);
