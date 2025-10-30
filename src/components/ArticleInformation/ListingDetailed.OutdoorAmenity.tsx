import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface ListingDetailedOutdoorAmenityProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ListingDetailedOutdoorAmenity: React.FC<ListingDetailedOutdoorAmenityProps> = ({
  locale,
  listingDetail,
}) => {
  const t = useTranslations('webLabel');

  const outdoorAmenities = useMemo(
    () => listingDetail?.outDoorAmenities ?? [],
    [listingDetail, listingDetail?.outDoorAmenities],
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {outdoorAmenities && outdoorAmenities.length ? (
        outdoorAmenities.map((item, index) => (
          <div key={item.id} className={clsx(`col-span-1 flex items-center`)}>
            <div
              className={`relative mr-[10px] flex h-[35px] w-[35px] items-center justify-center overflow-hidden rounded-full bg-[#F6F8F9]`}
            >
              <Image src={item.imageUrl} alt={item.name} width={20} height={20} />
            </div>{' '}
            <span className="text-[14px]">{item.name}</span>
          </div>
        ))
      ) : (
        <>{t('noData')}</>
      )}
    </div>
  );
};

export default React.memo(ListingDetailedOutdoorAmenity);
