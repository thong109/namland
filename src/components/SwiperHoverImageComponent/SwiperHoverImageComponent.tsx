import { FC } from 'react';

import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './styles.scss';
const SwiperHoverImageComponent: FC<{
  className?: string;
  listImage?: any[];
}> = ({ className = '', listImage }) => {
  return (
    <div className="SwiperBanner-Vertical">
      <Swiper
        spaceBetween={0}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {listImage?.map((item, index) => {
          return (
            <SwiperSlide key={index + 1}>
              {' '}
              <img
                loading="lazy"
                alt="QC_1"
                className={`imgCustom h-full w-full object-cover lg:hidden ${className}`}
                src={item?.url}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SwiperHoverImageComponent;
