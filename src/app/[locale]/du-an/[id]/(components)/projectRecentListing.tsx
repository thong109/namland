'use client';

import CardItemProperties from '@/components/Cards/CardItemProperties';
import ListingModel from '@/models/listingModel/listingModel';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.scss';

interface ProjectRecentListingProps {
  data: ListingModel[];
  heading: JSX.Element;
}

const ProjectRecentListing: FC<ProjectRecentListingProps> = ({ data, heading }) => {
  const t = useTranslations('webLabel');
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + '</span>';
    },
  };

  if (data && data.length > 0) {
    return (
      <div className="h-[650px] bg-white">
        {heading}
        <div className="swiper-listing flex h-[480px] flex-col">
          <Swiper
            pagination={pagination}
            modules={[Pagination, Autoplay]}
            className=""
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
            }}
          >
            {_.map(data, (item, index) => {
              return (
                <SwiperSlide key={index + 1}>
                  <div className="h-full w-full">
                    <CardItemProperties data={item} />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ProjectRecentListing;
