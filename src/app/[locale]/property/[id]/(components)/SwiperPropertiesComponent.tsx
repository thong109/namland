import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './styles.scss';

// import required modules
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import * as _ from 'lodash';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
const SwiperPropertiesComponent = ({ listImage }: any) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [urlLinkLogo, setUrlLinkLogo] = useState({} as any);
  useEffect(() => {
    if (allSettingLandingPage) {
      let find = _.find(allSettingLandingPage, { key: 'LOGO_IMAGE' });
      if (find) {
        setUrlLinkLogo(find.value);
      }
    }
  }, [allSettingLandingPage]);
  return (
    <>
      {listImage && listImage?.length ? (
        <div className="swiper-properties flex h-[270px] flex-col lg:h-[723px]">
          <div className="relative h-[220px] lg:h-[600px]">
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
                    <img src={item?.url} loading="lazy" />
                    {urlLinkLogo && urlLinkLogo?.IsActive ? (
                      <img
                        alt="logo"
                        src={urlLinkLogo.Image}
                        className="absolute left-1/2 top-1/2 z-10 !h-24 !w-auto -translate-x-1/2 -translate-y-1/2 transform object-fill opacity-20"
                      ></img>
                    ) : null}
                    <div className="absolute bottom-2 right-2 rounded bg-[rgba(0,0,0,0.6)] p-1 text-sm text-white">
                      {index + 1 + ' / ' + listImage?.length}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="h-[40px] w-full lg:h-[100px]">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={5}
              // slidesPerView={listImage?.length > 6 ? 6+0.001 : listImage.length+0.001}
              slidesPerView={6.001}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="swiperBottom mt-1 lg:mt-2"
            >
              {listImage.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <img src={item?.url} className="rounded" loading="lazy" />
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

export default SwiperPropertiesComponent;
