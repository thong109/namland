'use client';

import { getEcomAdBannerGetAdBannerByPosition } from '@/ecom-sadec-api-client/services.gen';
import { AdBannerPositionEnum } from '@/libs/enums/AdBannerPositionEnum';
import Banner from '@/models/masterDataModel/bannerModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect } from 'react';

export interface IProps {}

const MiddleBanner: FC<IProps> = () => {
  const [underRentBanner, setUnderRentBanner] = React.useState<Banner | null>(null);

  useEffect(() => {
    getEcomAdBannerGetAdBannerByPosition({
      position: AdBannerPositionEnum.UnderRent,
    }).then((response: ApiResponseModel<Banner>) => {
      setUnderRentBanner(response.data);
    });
  }, [setUnderRentBanner]);

  if (
    !underRentBanner ||
    !underRentBanner.attachments ||
    underRentBanner.attachments.length === 0
  ) {
    return null;
  }

  return (
    <div className="container mb-4">
      <Link href={underRentBanner.attachments[0].bannerLink ?? ''} target={'_blank'} className="">
        <Image
          className="object-contain"
          src={underRentBanner.attachments[0].bannerImageUrl ?? ''}
          alt={underRentBanner.attachments[0].bannerName ?? ''}
          width={2560}
          height={1440}
        />
      </Link>
    </div>
  );
};

export default React.memo(MiddleBanner);
