'use client';

import Banner from '@/models/masterDataModel/bannerModel';
import { Carousel } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect } from 'react';

const TopBannerCarouselImage = dynamic(() => import('./TopBannerCarouselImage'), { ssr: false });

export interface IProps {
  initAboveSaleBanner: Banner;
}

const TopBanner: FC<IProps> = ({ initAboveSaleBanner }) => {
  const [aboveSaleBanner, _] = React.useState<Banner | null>(initAboveSaleBanner);
  const [showCarousel, setShowCarousel] = React.useState(false);

  useEffect(() => {
    setShowCarousel(true);
  }, [setShowCarousel]);

  if (
    !aboveSaleBanner ||
    !aboveSaleBanner.attachments ||
    aboveSaleBanner.attachments.length === 0
  ) {
    return null;
  }

  return (
    <div className="container mb-4 max-h-[386px] lg:h-[386px]">
      {!showCarousel && (
        <Link
          key={aboveSaleBanner.attachments[0].bannerId}
          href={aboveSaleBanner.attachments[0].bannerLink ?? ''}
          target={'_blank'}
          className=""
        >
          <Image
            className="object-contain"
            src={aboveSaleBanner.attachments[0]?.bannerImageUrl ?? ''}
            alt={aboveSaleBanner.attachments[0].bannerName ?? ''}
            sizes="80vw"
            width={1920}
            height={1080}
            priority
          />
        </Link>
      )}
      {showCarousel && (
        <Carousel
          autoplay={true}
          autoplaySpeed={aboveSaleBanner?.switchAfterSeconds * 1000}
          dots={{
            className:
              'absolute !-bottom-6 lg:!-bottom-4 !justify-start [&_button]:!bg-portal-yellow',
          }}
        >
          {aboveSaleBanner.attachments.map((attachment, index) =>
            index === 0 ? (
              <Link
                key={attachment.bannerId}
                href={attachment.bannerLink ?? ''}
                target={'_blank'}
                className=""
              >
                <Image
                  className="object-contain"
                  src={attachment?.bannerImageUrl ?? ''}
                  alt={attachment.bannerName ?? ''}
                  sizes="80vw"
                  width={1920}
                  height={1080}
                  priority
                />
              </Link>
            ) : (
              <TopBannerCarouselImage attachment={attachment} key={attachment.bannerId} />
            ),
          )}
        </Carousel>
      )}
    </div>
  );
};

export default React.memo(TopBanner);
