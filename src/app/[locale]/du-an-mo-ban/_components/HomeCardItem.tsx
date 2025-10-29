'use client';
import { locationIconFavoriteIcon } from '@/libs/appComponents';
import { getNewHomeDetailUrl } from '@/utils/urlUtil';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import { isMobile } from 'react-device-detect';
import AddToFavoriteButtonNewHome from './AddToFavoriteButtonNewHome';
import { assetsImages } from '@/assets/images/package';
import { formatArea } from '@/utils/convertUtil';

type IProps = {
  data: any;
  className?: string;
};

const HomeCardItem: React.FC<IProps> = ({ data, className = '', ...props }) => {
  const t = useTranslations('webLabel');

  const {
    id,
    title,
    location,
    thumbnail,
    toArea,
    fromArea,
  } = data;
  const projectDetailUrl = getNewHomeDetailUrl(id, title);

  return (
    <div
      className={`flex h-full flex-col border border-portal-gray-border transition p-[22px] mobile:p-4 rounded-[10px] cursor-pointer group ${className}`}
    >
      <Link legacyBehavior href={projectDetailUrl}>
        <div className={`relative w-full overflow-hidden`}>
          <div className="relative pt-[calc(450/410*100%)] mb-[12px] overflow-hidden">
            <Image
              alt="image"
              src={thumbnail?.thumbUrl}
              loading="lazy"
              className='group-hover:scale-105 transition-transform duration-500 ease-in-out'
              fill
            />
          </div>
          <div className="grid grid-col gap-x-[4px] border-b border-portal-gray-border pb-[9px] mb-[6px]">
            <Typography className='text-portal-gray-7 font-semibold text-lg leading-1.3 mb-[4px]'>{title}</Typography>
            <Typography className='text-base text-portal-gray-8 leading-[1.5]'>{t('EcomProjectManagementPageNewHomeUnitArea')}: <span className="text-portal-gray-7">
              {t('EcomProjectLstNewHomeFromToArea', {
                fromArea: fromArea,
                toArea: toArea,
              })}
            </span>
            </Typography>
          </div>
          <div className="flex items-start">
            <Image
              alt=""
              src={assetsImages.commonIconLocation}
              className="h-[22px] w-[22px]"
              loading="eager"
            />
            <Typography className="text-base text-portal-gray-8 leading-[1.5] ml-[3px] min-h-[42px] line-clamp-2">
              {location?.address}
            </Typography>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeCardItem;
