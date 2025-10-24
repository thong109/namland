'use client';
import Banner1 from '@/assets/images/banner-1.png';
import BannerModel from '@/models/masterDataModel/bannerModel';
import Image from 'next/image';
import { FC } from 'react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './styles.scss';
const AdsBannerComponent: FC<{ className?: string; banner?: BannerModel }> = ({
  className = '',
  banner,
}) => {
  const onClick = (item) => {
    window.open(item.bannerLink, '_blank');
  };
  return banner && banner?.status ? (
    <div className="SwiperBanner-Vertical">
      <Swiper
        spaceBetween={5}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: banner?.switchAfterSeconds ? banner?.switchAfterSeconds * 1000 : 2000,
          disableOnInteraction: true,
        }}
        modules={[Autoplay]}
        allowTouchMove={false}
      >
        {banner?.attachments.map((item) => {
          return (
            <SwiperSlide key={item?.bannerId} onClick={() => onClick(item)}>
              {' '}
              <img
                alt="QC_1"
                className={`h-screen w-full rounded ${className}`}
                src={item?.bannerImageUrl}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  ) : (
    <Image
      alt="QC_1"
      src={Banner1}
      className={`h-screen w-full rounded sm:h-[900px] ${className}`}
    />
  );
};

export default AdsBannerComponent;
