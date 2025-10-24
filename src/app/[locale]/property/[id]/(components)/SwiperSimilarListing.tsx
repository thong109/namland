import { FC, useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.scss';

// import required modules
import CardItemProperties from '@/components/Cards/CardItemProperties';
import * as _ from 'lodash';
import { useTranslations } from 'next-intl';
import { Pagination } from 'swiper/modules';

export interface BadgeVipProps {
  className?: string;
  desc?: string;
  data: any[];
  number?: number;
}

const SwiperPropertiesComponent: FC<BadgeVipProps> = ({ data, number }) => {
  const t = useTranslations('webLabel');
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + '</span>';
    },
  };
  const [numberSlide, setNumberSlide] = useState(0);
  const [arrayData, setArrayData] = useState<any[]>([]);
  useEffect(() => {
    let dataTest = [...data];
    setNumberSlide(Math.ceil(data.length / number));
    let array = [];
    for (let i = 0; i < dataTest.length; i += number) {
      array.push(dataTest.slice(i, i + number));
    }
    setArrayData(array);
  }, [data]);
  return (
    <>
      <div className="swiper-listing flex h-[480px] flex-col">
        {arrayData && arrayData.length ? (
          <Swiper pagination={pagination} modules={[Pagination]} className="">
            <>
              {_.map(arrayData, (arr, index) => {
                return (
                  <SwiperSlide key={index + 1}>
                    <div className="flex h-[400px] w-full items-center justify-center">
                      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-4">
                        {_.map(arr, (item, index2) => {
                          return (
                            <div key={item.id + index2} className="h-full w-full px-2">
                              <CardItemProperties
                                data={item}
                                isReplace
                                rightTitle={
                                  item?.type == 1
                                    ? t('EcomPropertyListingPageListViewForSale')
                                    : t('EcomPropertyListingPageListViewForRent')
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </>
          </Swiper>
        ) : null}
      </div>
    </>
  );
};

export default SwiperPropertiesComponent;
