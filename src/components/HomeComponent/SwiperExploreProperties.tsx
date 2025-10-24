'use client';

import { Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CardItemCategories from './CardItemCategories';
import Heading from './HeadLing';

import usePropertyType from '@/hooks/usePropertyType';
import { isMobile } from 'react-device-detect';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../Swiper/style.scss';
export interface SwiperExplorePropertiesProps {
  className?: string;
  itemClassName?: string;
}

const SwiperExploreProperties: FC<SwiperExplorePropertiesProps> = ({
  className = '',
  itemClassName = '',
}) => {
  const t = useTranslations('webLabel');

  // const [propertyTypes, setPropertyTypes] = useState<PropertyTypeModel[]>([]);
  const { propertyTypes } = usePropertyType();
  const [loading, setLoading] = useState(true);

  const [swiperRef, setSwiperRef] = useState(null);
  let itemPerRow = 5;
  useEffect(() => {
    // Promise.all([
    //   apiMasterDataService
    //     .getPropertyTypes()
    //     .then(x => setPropertyTypes(x?.data)),
    // ]).finally(() => {
    //   setLoading(false);
    // });
    setLoading(false);
  }, []);
  return (
    <>
      <div className={`nc-SectionSliderNewCategories ${className} w-full lg:min-h-[350px]`}>
        <Heading
          desc={t('EcomHomePageExploreOurPropertiesExploreOurPropertiesSubtitle')}
          isCenter={true}
        >
          {' '}
          {t('EcomHomePageExploreOurPropertiesExploreOurProperties')}
        </Heading>
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spin></Spin>
          </div>
        ) : (
          <Swiper
            onSwiper={setSwiperRef}
            slidesPerView={'auto'}
            spaceBetween={10}
            navigation={isMobile ? false : true}
            modules={[Navigation]}
            className="swiperComponent"
            centerInsufficientSlides={isMobile ? false : true}
            centeredSlides={isMobile ? false : true}
            centeredSlidesBounds={isMobile ? false : true}
            breakpoints={{
              320: {
                slidesPerView: 2.5,
                spaceBetween: 5,
              },
              321: {
                // width: 576,
                slidesPerView: 2.5,
                spaceBetween: 5,
              },
              768: {
                // width: 768,
                slidesPerView: 3,
                spaceBetween: 5,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1165: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
          >
            {propertyTypes.map((item, index) => (
              <SwiperSlide
                key={item?.id}
                className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] lg:h-[240px] lg:w-[240px]"
              >
                <CardItemCategories taxonomy={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default SwiperExploreProperties;
