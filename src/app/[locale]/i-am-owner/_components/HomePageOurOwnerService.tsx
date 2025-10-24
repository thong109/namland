'use client';
import CoreButton from '@/_components/CoreButton/CoreButton';
import { Carousel, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import { useState } from 'react';

type IProps = {
  data: any;
};

const HomePageOurOwnerService: React.FC<IProps> = ({ data, ...props }) => {
  const t = useTranslations('webLabel');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleBeforeChange = (from, to) => {
    setCurrentIndex(to);
  };

  const isCenterItem = (index) => {
    const middleIndex = currentIndex + 1 < data.length ? currentIndex + 1 : 0;
    return index === middleIndex;
  };

  return (
    <div className="swiper-iamowner container mb-2 mt-20">
      <div className="mb-8 flex flex-col items-baseline justify-between lg:flex-row">
        <Typography className="w-full text-left text-4xl font-bold text-portal-primaryLiving lg:w-fit lg:text-center">
          {t('HomePageOurOwnerService')}
        </Typography>
        <Link href={{ pathname: `/i-am-owner` }} className="w-full lg:w-fit">
          <Typography className="w-full text-right text-sm text-portal-primaryLiving underline lg:w-fit lg:text-center">
            {t('HomePageExplore')}
          </Typography>
        </Link>
      </div>

      <div className="relative">
        <Carousel
          dots={false}
          autoplay
          pauseOnHover
          autoplaySpeed={3000}
          beforeChange={handleBeforeChange}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
          slidesToShow={3}
        >
          {data?.map((serviceItem, index) => {
            return (
              <div key={`hio-${index}`} className="px-2 pb-5">
                <div
                  className={`flex flex-col items-center justify-center gap-3 ${isCenterItem(index) ? 'lg:gap-6' : ''}`}
                >
                  <div
                    className={`relative h-52 w-full overflow-hidden rounded-2xl shadow-lg duration-150 ease-in sm:h-64 ${isCenterItem(index) ? '' : 'lg:scale-75'}`}
                  >
                    <Image
                      alt={serviceItem?.fileName ?? 'img'}
                      src={serviceItem?.imageUrl}
                      className="h-full w-full object-fill"
                      loading="lazy"
                      fill
                    />
                  </div>
                  <div
                    className={`mx-auto w-full rounded-2xl bg-white shadow-lg duration-150 ease-in lg:w-[90%] ${isCenterItem(index) ? 'lg:scale-90' : ''}`}
                  >
                    <div className="grid grid-flow-row p-4">
                      <Typography className={`h-5 truncate font-semibold text-primaryColor`}>
                        {serviceItem.title}
                      </Typography>

                      <Typography className={`mt-2 whitespace-pre-line text-sm text-portal-gray`}>
                        {serviceItem.content}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>

      <div className="mt-4 flex justify-center">
        <Link href={{ pathname: `/i-am-owner` }}>
          <CoreButton className="w-fit" label={t('HomePageOurExploreOwnerServices')} />
        </Link>
      </div>
    </div>
  );
};

export default HomePageOurOwnerService;
