import { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './styles.scss';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

export interface SwiperComponentProps {
  listImage: {
    url?: string;
  }[];
}

const SwiperComponent: FC<SwiperComponentProps> = ({ listImage }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      {listImage && listImage.length ? (
        <div className="flex flex-col">
          <div className="relative h-[400px] lg:h-[600px]">
            <Swiper
              spaceBetween={0}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="swiperTop"
            >
              {listImage.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <img src={item?.url} alt={`swiper-image-${index}`} loading="lazy" />
                    <div className="absolute bottom-2 right-2 rounded bg-[rgba(13,38,59,0.25)] p-1 text-sm text-white">
                      {index + 1 + ' / ' + listImage?.length}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="mt-2 h-[50px] w-full lg:h-[100px]">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={5}
              slidesPerView={listImage?.length > 6 ? 6 : listImage.length}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="swiperBottom"
            >
              {listImage.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <img src={item?.url} alt={`swiper-slide-image-${index}`} className="rounded" />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default SwiperComponent;
