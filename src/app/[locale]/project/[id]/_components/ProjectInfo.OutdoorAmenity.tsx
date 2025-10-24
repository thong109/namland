import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface ProjectInfoOutdoorAmenityProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const ProjectInfoOutdoorAmenity: React.FC<ProjectInfoOutdoorAmenityProps> = ({
  locale,
  projectDetail,
}) => {
  const t = useTranslations('webLabel');

  const amenities = useMemo(
    () => projectDetail?.outdoorAmenities ?? [],
    [projectDetail, projectDetail?.outdoorAmenities],
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {amenities && amenities.length ? (
        amenities.map((item, index) => (
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

export default React.memo(ProjectInfoOutdoorAmenity);
