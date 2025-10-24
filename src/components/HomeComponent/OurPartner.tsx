'use client';

import { Spin } from 'antd';
import { FC, useEffect, useState } from 'react';
import Heading from './HeadLing';
// Import Swiper React components
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import apiHomePageService from '@/apiServices/externalApiServices/apiHomePageServices';
import partnerData from '@/models/masterDataModel/partnerModel';
import './style/swiper.scss';
// import required modules
import { Autoplay, Navigation } from 'swiper/modules';
export interface PropertiesForRentProps {
  className?: string;
  itemClassName?: string;
}
const PropertiesForRent: FC<PropertiesForRentProps> = ({ className = '', itemClassName = '' }) => {
  const t = useTranslations('webLabel');
  const [swiperRef, setSwiperRef] = useState(null);
  const [data, setData] = useState([] as partnerData[]);
  const [loading, setLoading] = useState(true);
  const [numOfPartner, setNumOfPartner] = useState(0);
  useEffect(() => {
    let width = window.innerWidth;
    if (width >= 1024) {
      setNumOfPartner(6);
    } else if (width >= 768) {
      setNumOfPartner(5);
    } else {
      setNumOfPartner(3.5);
    }
  }, []);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {}, [data]);
  const getData = async () => {
    try {
      let response = await apiHomePageService.getListPartner();
      if (response && response.success) {
        setData([...response.data]);
      }
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setLoading(false);
    }
  };
  const onClickItems = (item) => {
    window.open(item?.logoLink, '_blank');
  };
  return (
    <div className={`nc-SwiperOur ${className} mb-[50px] lg:mb-[180px]`}>
      {loading ? (
        <div className="flex justify-center">
          <Spin></Spin>
        </div>
      ) : (
        <>
          <Heading desc={t('EcomHomePageOurPartnerOurPartnerSubtitle')} isCenter>
            {t('EcomHomePageOurPartnerOurPartner')}
          </Heading>
          <Swiper
            onSwiper={setSwiperRef}
            slidesPerView="auto"
            spaceBetween={0}
            navigation={true}
            modules={[Autoplay, Navigation]}
            className="swiperOur"
            centeredSlides={data.length <= numOfPartner ? true : false}
            centeredSlidesBounds={data.length <= numOfPartner ? true : false}
            centerInsufficientSlides={data.length <= numOfPartner ? true : false}
            loop={true}
            loopedSlides={1}
            loopPreventsSliding
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              stopOnLastSlide: false,
              waitForTransition: true,
              pauseOnMouseEnter: false,
              reverseDirection: true,
            }}
            breakpoints={{
              300: {
                slidesPerView: 3.5,
                spaceBetween: 10,
              },
              576: {
                slidesPerView: 3.5,
                spaceBetween: 10,
              },
              768: {
                // width: 768,
                slidesPerView: 5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            }}
          >
            {data.map((item, index) => (
              <SwiperSlide key={index + 1}>
                <div
                  className="flex h-full w-full items-center justify-center transition-transform duration-300 lg:hover:scale-105"
                  onClick={() => {
                    onClickItems(item);
                  }}
                >
                  <img alt="" src={item.logoImageUrl} className="max-h-[220px] object-contain" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default PropertiesForRent;
