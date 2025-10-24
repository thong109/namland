'use client';

import { Spin } from 'antd';
import { FC, useEffect, useState } from 'react';
import Heading from './HeadLing';
// Import Swiper React components
import Agent1 from '@/assets/images/agent1.png';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useTranslations } from 'next-intl';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import apiHomePageService from '@/apiServices/externalApiServices/apiHomePageServices';
import AgencyOurModel from '@/models/masterDataModel/agencyOurModel';
import Link from 'next-intl/link';
import './style/swiper.scss';

// import required modules
import { isMobile } from 'react-device-detect';
import { Navigation } from 'swiper/modules';
export interface ListTopAgencyComponentsProps {
  className?: string;
  itemClassName?: string;
}
const ListTopAgencyComponents: FC<ListTopAgencyComponentsProps> = ({
  className = '',
  itemClassName = '',
}) => {
  const t = useTranslations('webLabel');
  const [swiperRef, setSwiperRef] = useState(null);
  const [data, setData] = useState<AgencyOurModel[]>([] as AgencyOurModel[]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {}, [data]);
  const getData = async () => {
    try {
      let response = await apiHomePageService.getListOurAgency();
      if (response && (await response.success)) {
        setData([...response.data]);
        setLoading(false);
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };
  const onClickItem = (item) => {};
  return (
    <div className={`nc-SwiperAgency ${className} mb-[20px]`}>
      {loading ? (
        <div className="flex justify-center">
          <Spin></Spin>
        </div>
      ) : (
        <>
          <Heading desc={t('EcomHomePageMeetOurAgentsMeetOurAgentssubtitle')} isCenter>
            {t('EcomHomePageMeetOurAgentsMeetOurAgents')}
          </Heading>

          <Swiper
            onSwiper={setSwiperRef}
            slidesPerView="auto"
            spaceBetween={5}
            navigation={true}
            modules={[Navigation]}
            className="swiperAgency"
            centeredSlidesBounds={isMobile ? false : true}
            centeredSlides={isMobile ? false : true}
            // loopedSlides={1}
            // loopPreventsSliding
            // loop={isMobile?false:true}
            breakpoints={{
              300: {
                slidesPerView: 1.5,
                spaceBetween: 5,
              },
              576: {
                // width: 576,
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                // width: 768,
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: data?.length > 5 ? 5 : data?.length,
                spaceBetween: 15,
              },
            }}
          >
            {data.map((item, index) => (
              <SwiperSlide key={index + item.id}>
                <Link
                  href={`/agency/${item?.id}`}
                  className="flex h-full w-full items-center justify-center"
                >
                  <div className="flex !h-[320px] w-full flex-col items-center justify-center transition-transform duration-300 lg:hover:scale-105">
                    <div className="flex !h-[90%] w-[100%] justify-center">
                      <img
                        alt=""
                        src={item?.avatarUrl ? item.avatarUrl : Agent1.src}
                        className="!h-[100%] object-cover lg:!w-[220px]"
                      />
                    </div>
                    <div className="text center text-one-line bottom-[1px] z-10 mt-[-15px] w-[80%] rounded bg-white py-[3px] shadow lg:!w-[180px]">
                      {item?.firstName && item?.lastName
                        ? item?.firstName + ' ' + item?.lastName
                        : t('noName')}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default ListTopAgencyComponents;
