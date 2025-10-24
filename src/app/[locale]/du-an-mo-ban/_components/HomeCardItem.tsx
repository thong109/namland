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
    type,
    toArea,
    fromArea,
    fromRoom,
    toRoom,
    newHomesStatistics,
    fromPrice,
    toPrice,
  } = data;
  const projectDetailUrl = getNewHomeDetailUrl(id, title);

  return (
    <>
      {!isMobile ? (
        <div
          className={`flex h-full flex-col border border-portal-border transition lg:hover:scale-[1.03] ${className}`}
        >
          <Link legacyBehavior href={projectDetailUrl}>
            <div className={`relative h-64 w-full overflow-hidden`}>
              <div className="absolute z-10 h-full w-full bg-black/40" />
              <Image
                alt="image"
                src={thumbnail?.thumbUrl}
                className="h-full w-full"
                loading="lazy"
                fill
              />
              <div className="absolute left-1/2 top-1/2 z-20 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
                <Typography className={`line-clamp-1 pb-1 text-lg font-semibold text-white`}>
                  {title}
                </Typography>
                <Typography className={`mb-1 flex text-xs text-white`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
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
                  {location?.address}
                </Typography>
                <Typography className={`flex text-lg font-semibold text-white`}>
                  {t('EcomProjectLstNewHomeFromToPriceConvert', {
                    fromPrice: fromPrice / 1_000_000,
                    toPrice: toPrice / 1_000_000,
                  })}
                </Typography>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div
          className={`flex h-full flex-col border border-portal-border transition lg:hover:scale-[1.03] ${className}`}
        >
          <Link legacyBehavior href={projectDetailUrl}>
            <div
              className={`relative flex h-44 w-full overflow-hidden border-[0.5px] border-black`}
            >
              <div className="relative h-full w-[50%]">
                <Image
                  alt="image"
                  src={thumbnail?.thumbUrl}
                  className="object-cover"
                  loading="lazy"
                  layout="fill"
                />
              </div>
              <div className="ml-2 grid w-[50%] grid-cols-3">
                <div className="col-span-6 flex flex-col justify-start py-1">
                  <span className="line-clamp-2 text-start text-sm font-semibold">{title}</span>
                  <div className="col-span-6 flex">
                    <span className="text-base"> {locationIconFavoriteIcon}</span>
                    <span className="ml-1 line-clamp-2 text-xs">{location?.address}</span>
                  </div>
                </div>
                <div className="col-span-6 grid grid-cols-3 border-b-[0.5px] border-t-[0.5px] border-black">
                  <div className="col-span-1 flex items-center justify-center border-r-[0.5px] border-black px-1 text-center text-xs">
                    {type?.name}
                  </div>
                  <div className="col-span-1 flex items-center border-r-[0.5px] border-black px-1 text-center text-xs">
                    {t('EcomProjectLstNewHomeFromToArea', {
                      fromArea: fromArea,
                      toArea: toArea,
                    })}
                  </div>
                  <div className="col-span-1 flex items-center px-1 text-center text-xs">
                    {t('EcomProjectLstNewHomeFromToRoom', {
                      fromRoom: fromRoom,
                      toRoom: toRoom,
                    })}
                  </div>
                </div>
                <div className="col-span-6 flex items-center justify-between">
                  <span className="line-clamp-2 text-sm font-semibold">
                    {t('EcomProjectLstNewHomeFromToPriceConvert', {
                      fromPrice: fromPrice / 1_000_000,
                      toPrice: toPrice / 1_000_000,
                    })}
                  </span>
                  <div className="flex flex-col items-center justify-center">
                    <AddToFavoriteButtonNewHome
                      listingDetail={data}
                      className="!left-1/2 !top-1/2 size-full !-translate-x-1/2 !-translate-y-1/2 !transform"
                    />
                    {/* <HeartIcon
                      onClick={(e) => onTickisFavourite(e, !isFavourite)}
                      height={28}
                      width={28}
                      className={clsx(`${isFavourite && 'fill-portal-primaryButtonAdmin'}`)}
                    /> */}
                    <span className="text-xs"> {newHomesStatistics?.totalFavored}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default HomeCardItem;
