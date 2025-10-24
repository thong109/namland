'use-client';
import CardItemComponent from '@/components/Cards/CardItemProperties';
import { FC, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useTranslations } from 'next-intl';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './style.scss';
export interface SwiperComponentProps {
  className?: string;
  data?: any;
  onClick?: (item: any) => void;
  pagination?: boolean;
  navigation?: boolean;
  breakpoints?: any;
  center?: boolean;
  sizePerView?: number;
  type?: string;
  rightTitle?: boolean;
  hiddenMonth?: boolean;
}

const SwiperComponent: FC<SwiperComponentProps> = ({
  className = '',
  data,
  onClick,
  pagination,
  navigation,
  breakpoints,
  center,
  sizePerView,
  type,
  rightTitle,
  hiddenMonth,
}) => {
  const t = useTranslations('webLabel');
  const [swiperRef, setSwiperRef] = useState(null);

  return (
    <>
      <Swiper
        onSwiper={setSwiperRef}
        slidesPerView={'auto'}
        spaceBetween={10}
        navigation={navigation || false}
        pagination={pagination || false}
        modules={[Navigation]}
        className="swiperComponent"
        centerInsufficientSlides={center || false}
        centeredSlides={center || false}
        centeredSlidesBounds={center || false}
        breakpoints={{ ...breakpoints } || {}}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <div key={index} onClick={() => onClick(item)}>
              <CardItemComponent
                key={index}
                type={type}
                data={item}
                rightTitle={
                  rightTitle
                    ? item?.type == 1
                      ? t('EcomPropertyListingPageListViewForSale')
                      : t('EcomPropertyListingPageListViewForRent')
                    : ''
                }
                hiddenMonth={hiddenMonth}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperComponent;
